import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ClassifierPanel } from '@/components/classifier/ClassifierPanel';

export default function Index() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [aiReasoning, setAiReasoning] = useState(false);
  const [classifierEnabled, setClassifierEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Agent Level Configuration */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Agent Level Configuration</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Manage and customize important behaviors of your AI agent.</p>
          </div>

          <div className="divide-y divide-border">
            {/* AI Reasoning */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">AI Reasoning</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Turn on or off the agent's internal thought process, useful for better visibility and debugging.</p>
              </div>
              <Switch checked={aiReasoning} onCheckedChange={setAiReasoning} />
            </div>

            {/* Query Intent Classifier */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">Query Intent Classifier</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Turn on to get structured, intent-driven answers. Turn off to use flexible, conversational AI responses.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => setPanelOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Switch checked={classifierEnabled} onCheckedChange={setClassifierEnabled} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ClassifierPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
