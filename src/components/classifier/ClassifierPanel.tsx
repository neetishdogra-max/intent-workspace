import { useState } from 'react';
import { toast } from 'sonner';
import { SlideOverPanel } from './SlideOverPanel';
import { MainPromptCard } from './MainPromptCard';
import { BucketList } from './BucketList';
import { BucketEditor } from './BucketEditor';
import { DeleteBucketDialog } from './DeleteBucketDialog';
import type { IntentBucket } from '@/types/classifier';
import { SAMPLE_BUCKETS, SAMPLE_MAIN_PROMPT } from '@/types/classifier';

interface ClassifierPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClassifierPanel({ isOpen, onClose }: ClassifierPanelProps) {
  const [mainPrompt, setMainPrompt] = useState(SAMPLE_MAIN_PROMPT);
  const [buckets, setBuckets] = useState<IntentBucket[]>(SAMPLE_BUCKETS);
  const [selectedId, setSelectedId] = useState<string | null>(SAMPLE_BUCKETS[0]?.id ?? null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const selectedBucket = buckets.find((b) => b.id === selectedId) ?? null;
  const deleteBucket = buckets.find((b) => b.id === deleteTarget);

  const handleAdd = () => {
    const newBucket: IntentBucket = {
      id: Date.now().toString(),
      name: 'New Bucket',
      description: 'Describe this intent bucket.',
      confidenceThreshold: 75,
      status: 'draft',
      examples: [],
      signals: [],
      additionalContext: '',
      ragResponse: '',
      followUpQuestions: '',
    };
    setBuckets((prev) => [...prev, newBucket]);
    setSelectedId(newBucket.id);
    toast.success('Bucket created');
  };

  const handleDuplicate = (id: string) => {
    const source = buckets.find((b) => b.id === id);
    if (!source) return;
    const dup: IntentBucket = { ...source, id: Date.now().toString(), name: `${source.name} (Copy)`, status: 'draft' };
    setBuckets((prev) => [...prev, dup]);
    setSelectedId(dup.id);
    toast.success('Bucket duplicated');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setBuckets((prev) => prev.filter((b) => b.id !== deleteTarget));
    if (selectedId === deleteTarget) setSelectedId(buckets.find((b) => b.id !== deleteTarget)?.id ?? null);
    setDeleteTarget(null);
    toast.success('Bucket deleted');
  };

  const handleUpdate = (updated: IntentBucket) => {
    setBuckets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleRename = (id: string) => {
    setSelectedId(id);
    // Focus on definition tab — the name field is there
    toast.info('Edit the name in the Definition section');
  };

  const handleSave = () => {
    toast.success('Changes saved successfully');
  };

  return (
    <>
      <SlideOverPanel isOpen={isOpen} onClose={onClose} onSave={handleSave}>
        <MainPromptCard prompt={mainPrompt} onUpdate={setMainPrompt} />

        {/* Bucket Workspace */}
        <div className="mx-6 mt-5 mb-6 flex flex-1 overflow-hidden rounded-lg border border-border bg-card" style={{ height: 'calc(100vh - 220px)' }}>
          <BucketList
            buckets={buckets}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAdd}
            onRename={handleRename}
            onDuplicate={handleDuplicate}
            onDelete={setDeleteTarget}
          />

          {selectedBucket ? (
            <BucketEditor
              bucket={selectedBucket}
              onUpdate={handleUpdate}
              onDuplicate={() => handleDuplicate(selectedBucket.id)}
              onDelete={() => setDeleteTarget(selectedBucket.id)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="text-sm text-muted-foreground">
                Select a bucket to configure its definition, examples, signals, and prompts.
              </p>
            </div>
          )}
        </div>
      </SlideOverPanel>

      <DeleteBucketDialog
        isOpen={!!deleteTarget}
        bucketName={deleteBucket?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
