import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { IntentBucket, BucketSection } from '@/types/classifier';

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
    case 'context':
      return <TextareaSection label="Additional Context" sublabel="Extra routing guidance, constraints, and notes for this bucket." value={bucket.additionalContext} onChange={(v) => onUpdate({ ...bucket, additionalContext: v })} />;
    case 'rag':
      return <TextareaSection label="RAG Response Prompt" sublabel="Define the prompt template used for RAG-based responses in this bucket." value={bucket.ragResponse} onChange={(v) => onUpdate({ ...bucket, ragResponse: v })} mono />;
    case 'followup':
      return <TextareaSection label="Follow-up Questions" sublabel="Define rules and templates for follow-up questions after resolving queries in this bucket." value={bucket.followUpQuestions} onChange={(v) => onUpdate({ ...bucket, followUpQuestions: v })} mono />;
    default:
      return null;
  }
}

function DefinitionSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Bucket Name</label>
          <Input
            value={bucket.name}
            onChange={(e) => onUpdate({ ...bucket, name: e.target.value })}
            className="max-w-md"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
          <Textarea
            value={bucket.description}
            onChange={(e) => onUpdate({ ...bucket, description: e.target.value })}
            rows={3}
            className="max-w-lg resize-none"
          />
        </div>
      </div>
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
    <div className="rounded-lg border border-border bg-card p-6">
      <h4 className="text-sm font-medium text-foreground">Example Queries</h4>
      <p className="mb-4 text-xs text-muted-foreground">Add queries that represent this intent bucket.</p>

      <div className="space-y-2">
        {bucket.examples.map((ex, i) => (
          <div key={i} className="group flex items-center gap-2 rounded-md border border-border bg-code-bg px-3 py-2">
            <span className="flex-1 font-mono text-sm text-foreground">{ex}</span>
            <button onClick={() => removeExample(i)} className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={newExample}
          onChange={(e) => setNewExample(e.target.value)}
          placeholder="Type an example query…"
          className="font-mono text-sm"
          onKeyDown={(e) => e.key === 'Enter' && addExample()}
        />
        <Button variant="outline" size="sm" onClick={addExample} className="shrink-0">
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
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
    <div className="rounded-lg border border-border bg-card p-6">
      <h4 className="text-sm font-medium text-foreground">Signal Words / Keywords</h4>
      <p className="mb-4 text-xs text-muted-foreground">Keywords that indicate this intent.</p>

      <div className="flex flex-wrap gap-2">
        {bucket.signals.map((signal, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-code-bg px-3 py-1 text-xs font-medium text-foreground"
          >
            {signal}
            <button onClick={() => removeSignal(i)} className="ml-0.5 text-muted-foreground hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={newSignal}
          onChange={(e) => setNewSignal(e.target.value)}
          placeholder="Add a signal word…"
          className="max-w-xs text-sm"
          onKeyDown={(e) => e.key === 'Enter' && addSignal()}
        />
        <Button variant="outline" size="sm" onClick={addSignal} className="shrink-0">
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
    </div>
  );
}

function TextareaSection({
  label,
  sublabel,
  value,
  onChange,
  mono,
}: {
  label: string;
  sublabel: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h4 className="text-sm font-medium text-foreground">{label}</h4>
      <p className="mb-4 text-xs text-muted-foreground">{sublabel}</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className={`resize-none leading-relaxed ${mono ? 'font-mono text-sm' : ''}`}
      />
    </div>
  );
}
