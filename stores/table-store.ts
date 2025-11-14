import type { Character, HealthStatus } from '@/types/character';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TableState {
  // Data
  characters: Character[];
  isLoading: boolean;
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
          set({ characters: data, isLoading: false });
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
      markAsViewed: () => {
        const { selectedIds, viewedIds } = get();
        console.log('Marked as viewed:', Array.from(selectedIds));
        set({
          viewedIds: new Set([...viewedIds, ...selectedIds]),
          selectedIds: new Set(),
        });
      },

      markAsUnviewed: () => {
        const { selectedIds, viewedIds } = get();
        console.log('Marked as unviewed:', Array.from(selectedIds));
        const newViewed = new Set(viewedIds);
        selectedIds.forEach((id) => newViewed.delete(id));
        set({
          viewedIds: newViewed,
          selectedIds: new Set(),
        });
      },
    }),
    { name: 'TableStore' }
  )
);
