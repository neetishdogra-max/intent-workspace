import { useState } from 'react';
import { Plus, Copy, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import type { IntentBucket, BucketSection } from '@/types/classifier';
import { BUCKET_SECTIONS } from '@/types/classifier';
import { BucketSectionContent } from './BucketSectionContent';

interface BucketWorkspaceProps {
  buckets: IntentBucket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onUpdate: (bucket: IntentBucket) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveBucket: (id: string) => void;
}

export function BucketWorkspace({
  buckets,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onDuplicate,
  onDelete,
  onSaveBucket,
}: BucketWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<BucketSection>('definition');
  const selectedBucket = buckets.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Section Header + Capsules */}
      <div className="shrink-0 border-b border-border px-4 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Intent Buckets</h3>
          <Button variant="outline" size="sm" onClick={onAdd} className="h-6 text-[11px] px-2.5">
            <Plus className="mr-1 h-3 w-3" />
            Add Bucket
          </Button>
        </div>

        {/* Horizontal capsule tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {buckets.map((bucket) => (
            <button
              key={bucket.id}
              onClick={() => onSelect(bucket.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all whitespace-nowrap',
                bucket.id === selectedId
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-secondary-foreground hover:bg-accent'
              )}
            >
              {bucket.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bucket content area */}
      {selectedBucket ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Compact bucket header — single row */}
          <div className="shrink-0 border-b border-border px-4 py-1.5 flex items-center justify-between gap-3 bg-muted/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">{selectedBucket.name}</span>
              <Badge
                variant={selectedBucket.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  'text-[10px] capitalize h-[18px] px-1.5 leading-none',
                  selectedBucket.status === 'active' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                  selectedBucket.status === 'draft' && 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                )}
              >
                {selectedBucket.status}
              </Badge>
              <span className="text-[10px] text-muted-foreground ml-1">Threshold</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={selectedBucket.confidenceThreshold}
                onChange={(e) => onUpdate({ ...selectedBucket, confidenceThreshold: Number(e.target.value) })}
                className="h-5 w-12 text-center text-[11px] font-mono px-1"
              />
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground" onClick={() => onDuplicate(selectedBucket.id)}>
                <Copy className="mr-1 h-3 w-3" />
                Duplicate
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-destructive hover:text-destructive" onClick={() => onDelete(selectedBucket.id)}>
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
              <Button size="sm" className="h-6 px-2.5 text-[11px] ml-1" onClick={() => onSaveBucket(selectedBucket.id)}>
                <Save className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>

          {/* Resizable 2-panel layout */}
          <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} minSize={14} maxSize={32}>
                <div className="h-full overflow-y-auto py-1 border-r border-border bg-muted/10">
                  {BUCKET_SECTIONS.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors',
                        activeSection === section.key
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={80}>
                <div className="h-full overflow-y-auto p-4">
                  <BucketSectionContent
                    section={activeSection}
                    bucket={selectedBucket}
                    onUpdate={onUpdate}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-xs text-muted-foreground">
            Select a bucket to configure its definition, examples, signals, and prompts.
          </p>
        </div>
      )}
    </div>
  );
}
