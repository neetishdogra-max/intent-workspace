import { useState } from 'react';
import { X, Plus, Pencil, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { IntentBucket, BucketSection } from '@/types/classifier';
import { PromptEditorModal } from './PromptEditorModal';

interface Props {
  section: BucketSection;
  bucket: IntentBucket;
  onUpdate: (bucket: IntentBucket) => void;
}

export function BucketSectionContent({ section, bucket, onUpdate }: Props) {
  switch (section) {
    case 'definition':
      return <DefinitionSection bucket={bucket} onUpdate={onUpdate} />;
    case 'examples':
      return <ExamplesSection bucket={bucket} onUpdate={onUpdate} />;
    case 'signals':
      return <SignalsSection bucket={bucket} onUpdate={onUpdate} />;
    case 'rag':
      return <PromptSection label="RAG Response" sublabel="Prompt template for RAG-based responses." value={bucket.ragResponse} onChange={(v) => onUpdate({ ...bucket, ragResponse: v })} />;
    case 'followup':
      return <PromptSection label="Follow-up Questions" sublabel="Rules and templates for follow-up questions." value={bucket.followUpQuestions} onChange={(v) => onUpdate({ ...bucket, followUpQuestions: v })} />;
    default:
      return null;
  }
}

function DefinitionSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs font-medium text-foreground">Description</h4>
        <p className="text-[11px] text-muted-foreground mb-2">Describe when queries should be routed to this bucket.</p>
      </div>
      <Textarea
        value={bucket.description}
        onChange={(e) => onUpdate({ ...bucket, description: e.target.value })}
        rows={6}
        placeholder="Describe this intent bucket…"
        className="resize-none text-sm leading-relaxed"
      />
    </div>
  );
}

function ExamplesSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  const [newExample, setNewExample] = useState('');

  const addExample = () => {
    if (newExample.trim()) {
      onUpdate({ ...bucket, examples: [...bucket.examples, newExample.trim()] });
      setNewExample('');
    }
  };

  const removeExample = (index: number) => {
    onUpdate({ ...bucket, examples: bucket.examples.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-medium text-foreground">Example Queries</h4>
          <p className="text-[11px] text-muted-foreground">Queries that represent this intent.</p>
        </div>
        <div className="flex gap-1.5">
          <Input
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            placeholder="Type an example…"
            className="font-mono text-xs h-7 w-56"
            onKeyDown={(e) => e.key === 'Enter' && addExample()}
          />
          <Button variant="outline" size="sm" onClick={addExample} className="h-7 shrink-0 text-xs px-2.5">
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {bucket.examples.map((ex, i) => (
          <div key={i} className="group flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5">
            <span className="text-muted-foreground text-[10px] font-mono w-4 shrink-0">{i + 1}</span>
            <span className="flex-1 font-mono text-xs text-foreground">{ex}</span>
            <button onClick={() => removeExample(i)} className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {bucket.examples.length === 0 && (
          <p className="text-xs text-muted-foreground italic py-3">No examples added yet.</p>
        )}
      </div>
    </div>
  );
}

function SignalsSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  const [newSignal, setNewSignal] = useState('');

  const addSignal = () => {
    if (newSignal.trim() && !bucket.signals.includes(newSignal.trim())) {
      onUpdate({ ...bucket, signals: [...bucket.signals, newSignal.trim()] });
      setNewSignal('');
    }
  };

  const removeSignal = (index: number) => {
    onUpdate({ ...bucket, signals: bucket.signals.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-medium text-foreground">Signal Words / Keywords</h4>
          <p className="text-[11px] text-muted-foreground">Keywords that indicate this intent.</p>
        </div>
        <div className="flex gap-1.5">
          <Input
            value={newSignal}
            onChange={(e) => setNewSignal(e.target.value)}
            placeholder="Add keyword…"
            className="text-xs h-7 w-40"
            onKeyDown={(e) => e.key === 'Enter' && addSignal()}
          />
          <Button variant="outline" size="sm" onClick={addSignal} className="h-7 shrink-0 text-xs px-2.5">
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {bucket.signals.map((signal, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            {signal}
            <button onClick={() => removeSignal(i)} className="ml-0.5 text-muted-foreground hover:text-destructive">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {bucket.signals.length === 0 && (
          <p className="text-xs text-muted-foreground italic py-3">No signal words added yet.</p>
        )}
      </div>
    </div>
  );
}

function PromptSection({
  label,
  sublabel,
  value,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-medium text-foreground">{label}</h4>
          <p className="text-[11px] text-muted-foreground">{sublabel}</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5 text-muted-foreground" onClick={() => setPreviewOpen(!previewOpen)}>
            <Eye className="mr-1 h-3 w-3" />
            {previewOpen ? 'Hide' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" onClick={() => setModalOpen(true)}>
            <Pencil className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </div>
      </div>

      {previewOpen && value && (
        <div className="rounded-md border border-border/60 bg-muted/20 p-3">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">{value}</pre>
        </div>
      )}

      {!previewOpen && (
        <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground line-clamp-2 font-mono">{value || 'No content yet. Click Edit to add.'}</p>
        </div>
      )}

      <PromptEditorModal
        isOpen={modalOpen}
        title={`Edit ${label}`}
        value={value}
        onSave={(v) => { onChange(v); setModalOpen(false); }}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
