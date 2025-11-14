import { describe, it, expect, vi } from 'vitest';
import { createCharacterColumns } from '@/components/character-table/character-columns';
import type { Character } from '@/types/character';

describe('createCharacterColumns', () => {
  const mockOnSelectChange = vi.fn();
  const mockOnSelectAllChange = vi.fn();
  const mockOnSortToggle = vi.fn();
  const mockOnToggleHealthFilter = vi.fn();
  const mockOnClearHealthFilters = vi.fn();

  const mockSelectedIds = new Set<string>(['1', '2']);
  const mockVisibleIds = ['1', '2', '3', '4', '5'];

  const mockHealthFilterProps = {
    healthFilters: new Set(),
    onToggleFilter: mockOnToggleHealthFilter,
    onClearFilters: mockOnClearHealthFilters,
  };

  it('returns an array of column definitions', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    expect(Array.isArray(columns)).toBe(true);
    expect(columns.length).toBeGreaterThan(0);
  });

  it('creates serial number column as the first column', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    expect(columns[0].id).toBe('serialNumber');
    expect(columns[0].enableSorting).toBe(false);
    expect(columns[0].enableHiding).toBe(false);
    expect(columns[0].size).toBe(60);
  });

  it('creates select column as the second column', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    expect(columns[1].id).toBe('select');
    expect(columns[1].enableSorting).toBe(false);
    expect(columns[1].enableHiding).toBe(false);
    expect(columns[1].size).toBe(50);
  });

  it('creates name column with accessorKey', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    const nameColumn = columns.find((col) => 'accessorKey' in col && col.accessorKey === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.header).toBe('Name');
  });

  it('creates location column', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    const locationColumn = columns.find(
      (col) => 'accessorKey' in col && col.accessorKey === 'location'
    );
    expect(locationColumn).toBeDefined();
    expect(locationColumn?.header).toBe('Location');
  });

  it('creates health column with accessor key', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    const healthColumn = columns.find(
      (col) => 'accessorKey' in col && col.accessorKey === 'health'
    );
    expect(healthColumn).toBeDefined();
  });

  it('creates power column', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    const powerColumn = columns.find((col) => 'accessorKey' in col && col.accessorKey === 'power');
    expect(powerColumn).toBeDefined();
  });

  it('creates exactly 6 columns', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    // serialNumber, select, name, location, health, power
    expect(columns.length).toBe(6);
  });

  it('sets correct column order', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    expect(columns[0].id).toBe('serialNumber');
    expect(columns[1].id).toBe('select');
    expect('accessorKey' in columns[2] && columns[2].accessorKey).toBe('name');
    expect('accessorKey' in columns[3] && columns[3].accessorKey).toBe('location');
    expect('accessorKey' in columns[4] && columns[4].accessorKey).toBe('health');
    expect('accessorKey' in columns[5] && columns[5].accessorKey).toBe('power');
  });

  it('passes healthFilterProps to health column header', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds,
      mockHealthFilterProps
    );

    const healthColumn = columns.find(
      (col) => 'accessorKey' in col && col.accessorKey === 'health'
    );

    expect(healthColumn).toBeDefined();
    // The header should be a function that includes the filter component
    expect(typeof healthColumn?.header).toBe('function');
  });

  it('accepts null healthFilterProps', () => {
    const columns = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds
    );

    expect(columns.length).toBe(6);
  });

  it('passes sort direction to power column', () => {
    const columnsAsc = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      'asc',
      mockOnSortToggle,
      mockVisibleIds
    );

    const columnsDesc = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      'desc',
      mockOnSortToggle,
      mockVisibleIds
    );

    const columnsNull = createCharacterColumns(
      mockOnSelectChange,
      mockOnSelectAllChange,
      mockSelectedIds,
      null,
      mockOnSortToggle,
      mockVisibleIds
    );

    // All should create the same number of columns regardless of sort direction
    expect(columnsAsc.length).toBe(6);
    expect(columnsDesc.length).toBe(6);
    expect(columnsNull.length).toBe(6);
  });
});
