'use client';

import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export interface CharacterTableActionsProps {
  selectedCount: number;
  onMarkAsViewed?: () => void;
  onMarkAsUnviewed?: () => void;
}

export function CharacterTableActions({
  selectedCount,
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
        disabled={!hasSelection}
        className="gap-2"
        aria-label="Mark selected characters as viewed"
      >
        <Eye className="h-4 w-4" />
        Mark as Viewed
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onMarkAsUnviewed}
        disabled={!hasSelection}
        className="gap-2"
        aria-label="Mark selected characters as unviewed"
      >
        <EyeOff className="h-4 w-4" />
        Mark as Unviewed
      </Button>
    </>
  );
}
