"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Character, HealthStatus } from "@/types/character";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  CharacterHealthFilter,
  type CharacterHealthFilterProps,
} from "./character-health-filter";

export const createCharacterColumns = (
  onSelectChange: (id: string) => void,
  onSelectAllChange: (ids: string[]) => void,
  selectedIds: Set<string>,
  sortDirection: "asc" | "desc" | null,
  onSortToggle: () => void,
  visibleIds: string[],
  healthFilterProps?: CharacterHealthFilterProps,
): ColumnDef<Character>[] => [
  {
    id: "select",
    header: () => {
      const allSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
      const someSelected =
        visibleIds.some((id) => selectedIds.has(id)) && !allSelected;

      return (
        <Checkbox
          checked={allSelected}
          onCheckedChange={() => onSelectAllChange(visibleIds)}
          aria-label="Select all characters"
          className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={selectedIds.has(row.original.id)}
        onCheckedChange={() => onSelectChange(row.original.id)}
        aria-label={`Select ${row.original.name}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.getValue("name")}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("location")}</div>
    ),
    size: 150,
  },
  {
    accessorKey: "health",
    header: () => (
      <div className="flex items-center gap-2">
        Health
        {healthFilterProps && <CharacterHealthFilter {...healthFilterProps} />}
      </div>
    ),
    cell: ({ row }) => {
      const health = row.getValue("health") as HealthStatus;
      return (
        <Badge
          variant={
            health === "Healthy"
              ? "default"
              : health === "Injured"
                ? "secondary"
                : "destructive"
          }
          className="font-medium"
        >
          {health}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "power",
    header: () => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSortToggle}
          className="h-8 data-[state=open]:bg-accent"
          aria-label={`Sort by power ${sortDirection === "asc" ? "descending" : sortDirection === "desc" ? "clear sort" : "ascending"}`}
        >
          Power
          {sortDirection === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {row.getValue("power")}
      </div>
    ),
    size: 120,
  },
];
