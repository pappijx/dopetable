import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTableStore } from '@/stores/table-store';
import type { Character, HealthStatus } from '@/types/character';

// Mock fetch globally
global.fetch = vi.fn();

describe('useTableStore', () => {
  const mockCharacters: Character[] = [
    {
      id: '1',
      name: 'Naruto',
      location: 'Konoha',
      health: 'Healthy',
      power: 5000,
      viewed: false,
    },
    {
      id: '2',
      name: 'Sasuke',
      location: 'Konoha',
      health: 'Injured',
      power: 4800,
      viewed: true,
    },
    {
      id: '3',
      name: 'Gaara',
      location: 'Suna',
      health: 'Critical',
      power: 3500,
      viewed: false,
    },
  ];

  beforeEach(() => {
    // Reset store state before each test
    useTableStore.setState({
      characters: [],
      isLoading: false,
      isUpdatingViewed: false,
      error: null,
      searchQuery: '',
      healthFilters: new Set(),
      sortDirection: null,
      selectedIds: new Set(),
      viewedIds: new Set(),
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = useTableStore.getState();

      expect(state.characters).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.isUpdatingViewed).toBe(false);
      expect(state.error).toBe(null);
      expect(state.searchQuery).toBe('');
      expect(state.healthFilters).toEqual(new Set());
      expect(state.sortDirection).toBe(null);
      expect(state.selectedIds).toEqual(new Set());
      expect(state.viewedIds).toEqual(new Set());
    });
  });

  describe('fetchCharacters', () => {
    it('fetches characters successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacters,
      } as Response);

      const { fetchCharacters } = useTableStore.getState();
      await fetchCharacters();

      const state = useTableStore.getState();
      expect(state.characters).toEqual(mockCharacters);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('sets loading state while fetching', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(fetch).mockReturnValueOnce(promise as any);

      const { fetchCharacters } = useTableStore.getState();
      const fetchPromise = fetchCharacters();

      // Check loading state
      expect(useTableStore.getState().isLoading).toBe(true);

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => mockCharacters,
      });

      await fetchPromise;

      expect(useTableStore.getState().isLoading).toBe(false);
    });

    it('builds viewedIds set from fetched characters', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCharacters,
      } as Response);

      const { fetchCharacters } = useTableStore.getState();
      await fetchCharacters();

      const state = useTableStore.getState();
      expect(state.viewedIds).toEqual(new Set(['2'])); // Only Sasuke has viewed: true
    });

    it('handles fetch errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { fetchCharacters } = useTableStore.getState();
      await fetchCharacters();

      const state = useTableStore.getState();
      expect(state.error).toBe('Failed to fetch characters');
      expect(state.isLoading).toBe(false);
    });

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { fetchCharacters } = useTableStore.getState();
      await fetchCharacters();

      const state = useTableStore.getState();
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Search and Filters', () => {
    it('sets search query', () => {
      const { setSearchQuery } = useTableStore.getState();
      setSearchQuery('Naruto');

      expect(useTableStore.getState().searchQuery).toBe('Naruto');
    });

    it('toggles health filter on', () => {
      const { toggleHealthFilter } = useTableStore.getState();
      toggleHealthFilter('Healthy');

      expect(useTableStore.getState().healthFilters).toEqual(new Set(['Healthy']));
    });

    it('toggles health filter off', () => {
      useTableStore.setState({ healthFilters: new Set(['Healthy']) });

      const { toggleHealthFilter } = useTableStore.getState();
      toggleHealthFilter('Healthy');

      expect(useTableStore.getState().healthFilters).toEqual(new Set());
    });

    it('toggles multiple health filters', () => {
      const { toggleHealthFilter } = useTableStore.getState();

      toggleHealthFilter('Healthy');
      toggleHealthFilter('Injured');

      expect(useTableStore.getState().healthFilters).toEqual(new Set(['Healthy', 'Injured']));
    });

    it('clears health filters', () => {
      useTableStore.setState({
        healthFilters: new Set(['Healthy', 'Injured']),
      });

      const { clearHealthFilters } = useTableStore.getState();
      clearHealthFilters();

      const state = useTableStore.getState();
      expect(state.healthFilters).toEqual(new Set());
    });
  });

  describe('Sorting', () => {
    it('cycles through sort directions: null -> asc -> desc -> null', () => {
      const { toggleSort } = useTableStore.getState();

      // null -> asc
      toggleSort();
      expect(useTableStore.getState().sortDirection).toBe('asc');

      // asc -> desc
      toggleSort();
      expect(useTableStore.getState().sortDirection).toBe('desc');

      // desc -> null
      toggleSort();
      expect(useTableStore.getState().sortDirection).toBe(null);
    });
  });

  describe('Selection', () => {
    it('toggles selection on', () => {
      const { toggleSelection } = useTableStore.getState();
      toggleSelection('1');

      expect(useTableStore.getState().selectedIds).toEqual(new Set(['1']));
    });

    it('toggles selection off', () => {
      useTableStore.setState({ selectedIds: new Set(['1']) });

      const { toggleSelection } = useTableStore.getState();
      toggleSelection('1');

      expect(useTableStore.getState().selectedIds).toEqual(new Set());
    });

    it('selects all provided ids', () => {
      const { toggleSelectAll } = useTableStore.getState();
      toggleSelectAll(['1', '2', '3']);

      expect(useTableStore.getState().selectedIds).toEqual(new Set(['1', '2', '3']));
    });

    it('deselects all when all are already selected', () => {
      useTableStore.setState({ selectedIds: new Set(['1', '2', '3']) });

      const { toggleSelectAll } = useTableStore.getState();
      toggleSelectAll(['1', '2', '3']);

      expect(useTableStore.getState().selectedIds).toEqual(new Set());
    });

    it('selects all when only some are selected', () => {
      useTableStore.setState({ selectedIds: new Set(['1']) });

      const { toggleSelectAll } = useTableStore.getState();
      toggleSelectAll(['1', '2', '3']);

      expect(useTableStore.getState().selectedIds).toEqual(new Set(['1', '2', '3']));
    });

    it('clears all selections', () => {
      useTableStore.setState({ selectedIds: new Set(['1', '2', '3']) });

      const { clearSelection } = useTableStore.getState();
      clearSelection();

      expect(useTableStore.getState().selectedIds).toEqual(new Set());
    });
  });

  describe('Mark as Viewed', () => {
    beforeEach(() => {
      useTableStore.setState({
        characters: mockCharacters,
        selectedIds: new Set(['1', '3']),
      });
    });

    it('updates characters optimistically', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, updatedCount: 2 }),
      } as Response);

      const { markAsViewed } = useTableStore.getState();
      const promise = markAsViewed();

      // Check optimistic update
      const state = useTableStore.getState();
      const naruto = state.characters.find((c) => c.id === '1');
      const gaara = state.characters.find((c) => c.id === '3');

      expect(naruto?.viewed).toBe(true);
      expect(gaara?.viewed).toBe(true);

      await promise;
    });

    it('clears selection after marking as viewed', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { markAsViewed } = useTableStore.getState();
      await markAsViewed();

      expect(useTableStore.getState().selectedIds).toEqual(new Set());
    });

    it('sets and clears loading state', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(fetch).mockReturnValueOnce(promise as any);

      const { markAsViewed } = useTableStore.getState();
      const markPromise = markAsViewed();

      // Check loading state
      expect(useTableStore.getState().isUpdatingViewed).toBe(true);

      // Resolve
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      });

      await markPromise;

      expect(useTableStore.getState().isUpdatingViewed).toBe(false);
    });

    it('reverts on error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { markAsViewed } = useTableStore.getState();
      await markAsViewed();

      // Should revert the optimistic update
      const state = useTableStore.getState();
      const naruto = state.characters.find((c) => c.id === '1');
      const gaara = state.characters.find((c) => c.id === '3');

      expect(naruto?.viewed).toBe(false);
      expect(gaara?.viewed).toBe(false);
    });
  });

  describe('Mark as Unviewed', () => {
    beforeEach(() => {
      useTableStore.setState({
        characters: mockCharacters,
        selectedIds: new Set(['2']),
        viewedIds: new Set(['2']),
      });
    });

    it('updates characters optimistically', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, updatedCount: 1 }),
      } as Response);

      const { markAsUnviewed } = useTableStore.getState();
      const promise = markAsUnviewed();

      // Check optimistic update
      const state = useTableStore.getState();
      const sasuke = state.characters.find((c) => c.id === '2');

      expect(sasuke?.viewed).toBe(false);

      await promise;
    });

    it('clears selection after marking as unviewed', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { markAsUnviewed } = useTableStore.getState();
      await markAsUnviewed();

      expect(useTableStore.getState().selectedIds).toEqual(new Set());
    });

    it('reverts on error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const { markAsUnviewed } = useTableStore.getState();
      await markAsUnviewed();

      // Should revert the optimistic update
      const state = useTableStore.getState();
      const sasuke = state.characters.find((c) => c.id === '2');

      expect(sasuke?.viewed).toBe(true);
    });
  });
});
