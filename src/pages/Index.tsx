import { useState } from 'react';
import { Pencil, Settings, Zap, Shield, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClassifierPanel } from '@/components/classifier/ClassifierPanel';

const classifiers = [
  {
    id: 'query-intent',
    name: 'Query Intent Classifier',
    description: 'Routes incoming queries to the correct intent bucket based on semantic analysis.',
    status: 'active' as const,
    lastModified: 'Mar 15, 2026',
    buckets: 4,
    icon: Zap,
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analyzer',
    description: 'Classifies message sentiment for prioritization and escalation.',
    status: 'active' as const,
    lastModified: 'Mar 12, 2026',
    buckets: 3,
    icon: BarChart3,
  },
  {
    id: 'compliance',
    name: 'Compliance Filter',
    description: 'Detects and flags messages that may require regulatory review.',
    status: 'draft' as const,
    lastModified: 'Mar 8, 2026',
    buckets: 2,
    icon: Shield,
  },
  {
    id: 'language',
    name: 'Language Detector',
    description: 'Identifies the primary language of incoming messages for routing.',
    status: 'active' as const,
    lastModified: 'Mar 5, 2026',
    buckets: 6,
    icon: FileText,
  },
];

export default function Index() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-base font-semibold text-foreground">AI Routing Configuration</h1>
          </div>
          <Button variant="outline" size="sm">Documentation</Button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Classifiers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure how the model identifies, classifies, and routes incoming queries.
          </p>
        </div>

        <div className="space-y-3">
          {classifiers.map((c) => (
            <div
              key={c.id}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        c.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs'
                      }
                    >
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{c.buckets} buckets</p>
                  <p className="text-xs text-muted-foreground">Modified {c.lastModified}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => c.id === 'query-intent' && setPanelOpen(true)}
                  className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ClassifierPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
