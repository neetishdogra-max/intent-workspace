import { useState, KeyboardEvent } from 'react';
import { X, Eye, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
      return <PromptSection label="RAG Response" value={bucket.ragResponse} onChange={(v) => onUpdate({ ...bucket, ragResponse: v })} />;
    case 'followup':
      return <PromptSection label="Follow-up Questions" value={bucket.followUpQuestions} onChange={(v) => onUpdate({ ...bucket, followUpQuestions: v })} />;
    default:
      return null;
  }
}

function DefinitionSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  return (
    <div className="space-y-2">
      <div>
        <h4 className="text-xs font-medium text-foreground">Description</h4>
        <p className="text-[11px] text-muted-foreground mb-2">Describe when queries should be routed to this bucket.</p>
      </div>
      <Textarea
        value={bucket.description}
        onChange={(e) => onUpdate({ ...bucket, description: e.target.value })}
        rows={8}
        placeholder="Describe this intent bucket…"
        className="resize-none text-sm leading-relaxed"
      />
    </div>
  );
}

function ExamplesSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addExample = () => {
    const v = inputValue.trim();
    if (v) {
      onUpdate({ ...bucket, examples: [...bucket.examples, v] });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExample();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
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
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-6 text-[11px] px-2.5"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>

      {isAdding && (
        <Input
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addExample();
            setIsAdding(false);
            setInputValue('');
          }}
          placeholder="Type an example query and press Enter…"
          className="font-mono text-xs h-8"
        />
      )}

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
      </div>
    </div>
  );
}

function SignalsSection({ bucket, onUpdate }: { bucket: IntentBucket; onUpdate: (b: IntentBucket) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addSignal = () => {
    const v = inputValue.trim();
    if (v && !bucket.signals.includes(v)) {
      onUpdate({ ...bucket, signals: [...bucket.signals, v] });
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSignal();
    }
    if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
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
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-6 text-[11px] px-2.5"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>

      {isAdding && (
        <Input
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addSignal();
            setIsAdding(false);
            setInputValue('');
          }}
          placeholder="Type a keyword and press Enter…"
          className="text-xs h-8"
        />
      )}

      <div className="flex flex-wrap gap-1.5">
        {bucket.signals.map((signal, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            {signal}
            <button onClick={() => removeSignal(i)} className="ml-0.5 text-muted-foreground hover:text-destructive">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PromptSection({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-medium text-foreground">{label}</h4>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Open in editor"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder={`Enter ${label.toLowerCase()}…`}
        className="resize-none font-mono text-xs leading-relaxed"
      />

      <PromptEditorModal
        isOpen={modalOpen}
        title="Edit"
        value={value}
        onSave={(v) => { onChange(v); setModalOpen(false); }}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
