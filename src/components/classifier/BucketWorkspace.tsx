import { useState } from 'react';
import { Plus, Copy, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

  const handleTemperatureChange = (value: string) => {
    if (!selectedBucket) return;
    if (value === '' || value === '.') {
      onUpdate({ ...selectedBucket, temperature: value as any });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num <= 2) {
      onUpdate({ ...selectedBucket, temperature: num });
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col min-h-[400px]" style={{ height: 'calc(100vh - 200px)', maxHeight: '700px' }}>
      {/* Section Header + Capsules */}
      <div className="shrink-0 border-b border-border px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Intent Buckets</h3>
          <Button variant="outline" size="sm" onClick={onAdd} className="h-6 text-[11px] px-2.5">
            <Plus className="mr-1 h-3 w-3" />
            Add Bucket
          </Button>
        </div>

        {/* Wrapping capsule tabs */}
        <div className="flex flex-wrap gap-1.5">
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
          {/* Compact bucket header */}
          <div className="shrink-0 border-b border-border px-3 sm:px-4 py-1.5 bg-muted/20">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <Input
                value={selectedBucket.name}
                onChange={(e) => onUpdate({ ...selectedBucket, name: e.target.value })}
                className="h-6 text-sm font-semibold border-border/50 bg-transparent px-1.5 w-32 sm:w-40 focus-visible:ring-1"
              />
              <Badge
                variant={selectedBucket.status === 'active' ? 'default' : 'secondary'}
                className={cn(
                  'text-[10px] capitalize h-[18px] px-1.5 leading-none shrink-0',
                  selectedBucket.status === 'active' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                  selectedBucket.status === 'draft' && 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                )}
              >
                {selectedBucket.status}
              </Badge>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-muted-foreground">Confidence</span>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={1}
                  value={selectedBucket.confidenceThreshold}
                  onChange={(e) => onUpdate({ ...selectedBucket, confidenceThreshold: Number(e.target.value) })}
                  className="h-5 w-10 text-center text-[11px] font-mono px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-muted-foreground">/10</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-muted-foreground">Temp</span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={selectedBucket.temperature}
                  onChange={(e) => handleTemperatureChange(e.target.value)}
                  className="h-5 w-12 text-center text-[11px] font-mono px-1"
                />
              </div>

              <div className="flex items-center gap-0.5 shrink-0 ml-auto">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground" onClick={() => onDuplicate(selectedBucket.id)}>
                  <Copy className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Duplicate</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-destructive hover:text-destructive" onClick={() => onDelete(selectedBucket.id)}>
                  <Trash2 className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
                <Button size="sm" className="h-6 px-2.5 text-[11px] ml-1" onClick={() => onSaveBucket(selectedBucket.id)}>
                  <Save className="mr-1 h-3 w-3" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Section nav + content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar nav */}
            <div className="shrink-0 w-28 sm:w-36 overflow-y-auto py-1 border-r border-border bg-muted/10">
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <BucketSectionContent
                section={activeSection}
                bucket={selectedBucket}
                onUpdate={onUpdate}
              />
            </div>
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
