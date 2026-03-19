import { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import type { IntentBucket, BucketSection } from '@/types/classifier';
import { BUCKET_SECTIONS } from '@/types/classifier';
import { cn } from '@/lib/utils';
import { BucketSectionContent } from './BucketSectionContent';

interface BucketEditorProps {
  bucket: IntentBucket;
  onUpdate: (bucket: IntentBucket) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BucketEditor({ bucket, onUpdate, onDuplicate, onDelete }: BucketEditorProps) {
  const [activeSection, setActiveSection] = useState<BucketSection>('definition');

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Bucket Header */}
      <div className="shrink-0 border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">{bucket.name}</h3>
            <Badge
              variant={bucket.status === 'active' ? 'default' : 'secondary'}
              className={cn(
                'text-xs capitalize',
                bucket.status === 'active' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
                bucket.status === 'draft' && 'bg-amber-100 text-amber-700 hover:bg-amber-100'
              )}
            >
              {bucket.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onDuplicate}>
              <Copy className="mr-1 h-3.5 w-3.5" />
              Duplicate
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Confidence Threshold</label>
            <div className="flex items-center">
              <Input
                type="number"
                min={0}
                max={100}
                value={bucket.confidenceThreshold}
                onChange={(e) =>
                  onUpdate({ ...bucket, confidenceThreshold: Number(e.target.value) })
                }
                className="h-8 w-20 text-center text-sm font-mono"
              />
              <span className="ml-1 text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="shrink-0 border-b border-border bg-card px-6">
        <div className="flex gap-0.5 overflow-x-auto">
          {BUCKET_SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={cn(
                'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
                activeSection === section.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {section.label}
              {activeSection === section.key && (
                <motion.div
                  layoutId="bucket-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ duration: 0.15 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <BucketSectionContent
              section={activeSection}
              bucket={bucket}
              onUpdate={onUpdate}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
