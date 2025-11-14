"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useTableStore } from "@/stores/table-store";
import type { Character } from "@/types/character";
import { useMemo, useEffect } from "react";
import { createCharacterColumns } from "./character-columns";
import { CharacterTableActions } from "./character-table-actions";

export function CharacterTableContainer() {
  const {
    characters,
    isLoading,
    error,
    searchQuery,
    healthFilters,
    sortDirection,
    selectedIds,
    fetchCharacters,
    setSearchQuery,
    toggleHealthFilter,
    toggleSort,
    toggleSelection,
    markAsViewed,
    markAsUnviewed,
  } = useTableStore();

  // Fetch data on mount
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Process data: filter and sort
  const processedData = useMemo(() => {
    let result = [...characters];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query),
      );
    }

    // Apply health filter
    if (healthFilters.size > 0) {
      result = result.filter((c) => healthFilters.has(c.health));
    }

    // Apply sorting
    if (sortDirection) {
      result.sort((a, b) => {
        return sortDirection === "asc" ? a.power - b.power : b.power - a.power;
      });
    }

    return result;
  }, [characters, searchQuery, healthFilters, sortDirection]);

  // Get visible IDs for select-all
  const visibleIds = useMemo(
    () => processedData.map((c) => c.id),
    [processedData],
  );

  // Selection handlers
  const handleToggleSelection = useMemo(
    () => (id: string) => {
      toggleSelection(id);
    },
    [toggleSelection],
  );

  const handleToggleSelectAll = useMemo(
    () => (ids: string[]) => {
      const allSelected = ids.every((id) => selectedIds.has(id));
      if (allSelected) {
        // Deselect all visible rows
        ids.forEach((id) => toggleSelection(id));
      } else {
        // Select all visible rows that aren't already selected
        ids.forEach((id) => {
          if (!selectedIds.has(id)) {
            toggleSelection(id);
          }
        });
      }
    },
    [selectedIds, toggleSelection],
  );

  // Create columns
  const columns = useMemo(
    () =>
      createCharacterColumns(
        handleToggleSelection,
        handleToggleSelectAll,
        selectedIds,
        sortDirection,
        toggleSort,
        visibleIds,
        {
          healthFilters,
          onToggleFilter: toggleHealthFilter,
          onClearFilters: () => {
            // Clear all health filters
            healthFilters.forEach((filter) => toggleHealthFilter(filter));
          },
        },
      ),
    [
      handleToggleSelection,
      handleToggleSelectAll,
      selectedIds,
      sortDirection,
      visibleIds,
      healthFilters,
      toggleHealthFilter,
      toggleSort,
    ],
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedIds.size}
      >
        <CharacterTableActions
          selectedCount={selectedIds.size}
          onMarkAsViewed={markAsViewed}
          onMarkAsUnviewed={markAsUnviewed}
        />
      </DataTableToolbar>

      <DataTable<Character>
        data={processedData}
        columns={columns}
        isLoading={isLoading}
        error={error}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
