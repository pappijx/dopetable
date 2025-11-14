'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HEALTH_STATUSES, type HealthStatus } from '@/types/character';
import { Filter } from 'lucide-react';

export interface CharacterHealthFilterProps {
  healthFilters?: Set<HealthStatus>;
  onToggleFilter?: (health: HealthStatus) => void;
  onClearFilters?: () => void;
}

export function CharacterHealthFilter({
  healthFilters = new Set(),
  onToggleFilter,
  onClearFilters,
}: CharacterHealthFilterProps) {
  const hasActiveFilters = healthFilters.size > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 data-[state=open]:bg-accent"
          aria-label="Filter by health status"
        >
          <Filter className={`h-4 w-4 ${hasActiveFilters ? 'text-primary' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Filter by Health</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {HEALTH_STATUSES.map((health) => (
          <DropdownMenuCheckboxItem
            key={health}
            checked={healthFilters.has(health)}
            onCheckedChange={() => onToggleFilter?.(health)}
            onSelect={(e) => e.preventDefault()}
          >
            {health}
          </DropdownMenuCheckboxItem>
        ))}
        {hasActiveFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              onSelect={() => onClearFilters?.()}
              className="justify-center text-center"
            >
              Clear filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
