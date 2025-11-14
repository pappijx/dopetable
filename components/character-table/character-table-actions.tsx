'use client';

import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export interface CharacterTableActionsProps {
  selectedCount: number;
  isLoading?: boolean;
  onMarkAsViewed?: () => void;
  onMarkAsUnviewed?: () => void;
}

export function CharacterTableActions({
  selectedCount,
  isLoading = false,
  onMarkAsViewed,
  onMarkAsUnviewed,
}: CharacterTableActionsProps) {
  const hasSelection = selectedCount > 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onMarkAsViewed}
        disabled={!hasSelection || isLoading}
        className="gap-2"
        aria-label="Mark selected characters as viewed"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        Mark as Viewed
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onMarkAsUnviewed}
        disabled={!hasSelection || isLoading}
        className="gap-2"
        aria-label="Mark selected characters as unviewed"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
        Mark as Unviewed
      </Button>
    </>
  );
}
