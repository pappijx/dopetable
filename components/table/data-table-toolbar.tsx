'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Search } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

export interface DataTableToolbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCount?: number;
  children?: ReactNode;
}

export function DataTableToolbar({
  searchQuery = '',
  onSearchChange,
  selectedCount = 0,
  children,
}: DataTableToolbarProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update parent when debounced value changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange]);

  // Sync with external searchQuery changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
            aria-label="Search table"
          />
        </div>
        {selectedCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedCount} selected
          </span>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
