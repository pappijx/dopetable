import type { Character, HealthStatus } from '@/types/character';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TableState {
  // Data
  characters: Character[];
  isLoading: boolean;
  isUpdatingViewed: boolean;
  error: string | null;

  // Filters
  searchQuery: string;
  healthFilters: Set<HealthStatus>;

  // Sorting
  sortDirection: 'asc' | 'desc' | null;

  // Selection
  selectedIds: Set<string>;
  viewedIds: Set<string>;

  // Actions
  fetchCharacters: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleHealthFilter: (health: HealthStatus) => void;
  clearHealthFilters: () => void;
  toggleSort: () => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;
  markAsViewed: () => void;
  markAsUnviewed: () => void;
}

export const useTableStore = create<TableState>()(
  devtools(
    (set, get) => ({
      // Initial state
      characters: [],
      isLoading: false,
      isUpdatingViewed: false,
      error: null,
      searchQuery: '',
      healthFilters: new Set(),
      sortDirection: null,
      selectedIds: new Set(),
      viewedIds: new Set(),

      // Fetch characters from API
      fetchCharacters: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/characters');
          if (!response.ok) {
            throw new Error('Failed to fetch characters');
          }
          const data = await response.json();

          // Build viewedIds set from character data
          const viewedIds = new Set<string>();
          data.forEach((char: Character) => {
            if (char.viewed) {
              viewedIds.add(char.id);
            }
          });

          set({ characters: data, viewedIds, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Search
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      // Health filters
      toggleHealthFilter: (health: HealthStatus) => {
        set((state) => {
          const newFilters = new Set(state.healthFilters);
          if (newFilters.has(health)) {
            newFilters.delete(health);
          } else {
            newFilters.add(health);
          }
          return { healthFilters: newFilters };
        });
      },

      clearHealthFilters: () => set({ healthFilters: new Set() }),

      // Sorting
      toggleSort: () => {
        set((state) => {
          if (state.sortDirection === null) {
            return { sortDirection: 'asc' };
          } else if (state.sortDirection === 'asc') {
            return { sortDirection: 'desc' };
          } else {
            return { sortDirection: null };
          }
        });
      },

      // Selection
      toggleSelection: (id: string) => {
        set((state) => {
          const newSelected = new Set(state.selectedIds);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return { selectedIds: newSelected };
        });
      },

      toggleSelectAll: (ids: string[]) => {
        set((state) => {
          const allSelected = ids.every((id) => state.selectedIds.has(id));
          if (allSelected) {
            // Deselect all visible rows
            const newSelected = new Set(state.selectedIds);
            ids.forEach((id) => newSelected.delete(id));
            return { selectedIds: newSelected };
          } else {
            // Select all visible rows
            return { selectedIds: new Set([...state.selectedIds, ...ids]) };
          }
        });
      },

      clearSelection: () => set({ selectedIds: new Set() }),

      // Mark as viewed/unviewed
      markAsViewed: async () => {
        const { selectedIds, viewedIds, characters } = get();
        const ids = Array.from(selectedIds);
        console.log('Marked as viewed:', ids);

        // Set loading state
        set({ isUpdatingViewed: true });

        // Optimistically update UI - both viewedIds and characters array
        const updatedViewedIds = new Set([...viewedIds, ...selectedIds]);
        const updatedCharacters = characters.map((char) =>
          selectedIds.has(char.id) ? { ...char, viewed: true } : char
        );

        set({
          viewedIds: updatedViewedIds,
          characters: updatedCharacters,
          selectedIds: new Set(),
        });

        try {
          const response = await fetch('/api/characters', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, viewed: true }),
          });

          if (!response.ok) {
            throw new Error('Failed to update viewed status');
          }
          // Success - no need to refetch, already updated locally
          set({ isUpdatingViewed: false });
        } catch (error) {
          console.error('Error marking as viewed:', error);
          // Revert optimistic update on error
          const revertedViewed = new Set(viewedIds);
          ids.forEach((id) => revertedViewed.delete(id));
          const revertedCharacters = characters.map((char) =>
            selectedIds.has(char.id) ? { ...char, viewed: false } : char
          );
          set({
            viewedIds: revertedViewed,
            characters: revertedCharacters,
            isUpdatingViewed: false,
          });
        }
      },

      markAsUnviewed: async () => {
        const { selectedIds, viewedIds, characters } = get();
        const ids = Array.from(selectedIds);
        console.log('Marked as unviewed:', ids);

        // Set loading state
        set({ isUpdatingViewed: true });

        // Optimistically update UI - both viewedIds and characters array
        const updatedViewedIds = new Set(viewedIds);
        selectedIds.forEach((id) => updatedViewedIds.delete(id));
        const updatedCharacters = characters.map((char) =>
          selectedIds.has(char.id) ? { ...char, viewed: false } : char
        );

        set({
          viewedIds: updatedViewedIds,
          characters: updatedCharacters,
          selectedIds: new Set(),
        });

        try {
          const response = await fetch('/api/characters', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, viewed: false }),
          });

          if (!response.ok) {
            throw new Error('Failed to update viewed status');
          }
          // Success - no need to refetch, already updated locally
          set({ isUpdatingViewed: false });
        } catch (error) {
          console.error('Error marking as unviewed:', error);
          // Revert optimistic update on error
          const revertedCharacters = characters.map((char) =>
            selectedIds.has(char.id) ? { ...char, viewed: true } : char
          );
          set({
            viewedIds: new Set([...viewedIds, ...ids]),
            characters: revertedCharacters,
            isUpdatingViewed: false,
          });
        }
      },
    }),
    { name: 'TableStore' }
  )
);
