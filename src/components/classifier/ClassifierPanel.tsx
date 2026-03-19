import { useState } from 'react';
import { toast } from 'sonner';
import { SlideOverPanel } from './SlideOverPanel';
import { MainPromptCard } from './MainPromptCard';
import { BucketWorkspace } from './BucketWorkspace';
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

  const handleSaveBucket = (id: string) => {
    const bucket = buckets.find((b) => b.id === id);
    if (bucket) {
      handleUpdate({ ...bucket, status: 'active' });
      toast.success(`"${bucket.name}" saved`);
    }
  };

  return (
    <>
      <SlideOverPanel isOpen={isOpen} onClose={onClose}>
        <MainPromptCard prompt={mainPrompt} onUpdate={setMainPrompt} />

        <BucketWorkspace
          buckets={buckets}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDuplicate={handleDuplicate}
          onDelete={setDeleteTarget}
          onSaveBucket={handleSaveBucket}
        />
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
