import { useState } from 'react';
import { Plus, MoreVertical, Copy, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IntentBucket } from '@/types/classifier';
import { cn } from '@/lib/utils';

interface BucketListProps {
  buckets: IntentBucket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BucketList({
  buckets,
  selectedId,
  onSelect,
  onAdd,
  onRename,
  onDuplicate,
  onDelete,
}: BucketListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-r border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h4 className="text-sm font-semibold text-foreground">Intent Buckets</h4>
        <Button variant="outline" size="sm" onClick={onAdd} className="h-7 text-xs">
          <Plus className="mr-1 h-3 w-3" />
          Add Bucket
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {buckets.map((bucket) => {
          const isActive = bucket.id === selectedId;
          const isHovered = bucket.id === hoveredId;

          return (
            <div
              key={bucket.id}
              className={cn(
                'group relative flex cursor-pointer items-center px-4 py-3 transition-colors',
                isActive
                  ? 'border-r-2 border-primary bg-primary/5 text-primary'
                  : 'text-foreground hover:bg-accent'
              )}
              onClick={() => onSelect(bucket.id)}
              onMouseEnter={() => setHoveredId(bucket.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm', isActive ? 'font-semibold' : 'font-medium')}>
                  {bucket.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {bucket.description.slice(0, 60)}…
                </p>
              </div>
              {(isHovered || isActive) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => onRename(bucket.id)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(bucket.id)}>
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(bucket.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
