import { useState } from 'react';
import { Eye, Pencil, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MainPromptModal } from './MainPromptModal';

interface MainPromptCardProps {
  prompt: string;
  onUpdate: (prompt: string) => void;
}

export function MainPromptCard({ prompt, onUpdate }: MainPromptCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const truncated = prompt.slice(0, 140) + (prompt.length > 140 ? '…' : '');

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main Prompt</h3>
            <p className="mt-1 font-mono text-xs leading-relaxed text-foreground/70 truncate">
              {truncated}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="h-7 px-2 text-xs text-muted-foreground"
            >
              {isPreviewOpen ? <ChevronUp className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
              {isPreviewOpen ? 'Collapse' : 'Preview'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="h-7 px-2 text-xs text-muted-foreground">
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-md border border-border bg-muted/50 p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80">
                  {prompt}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MainPromptModal
        isOpen={isEditOpen}
        prompt={prompt}
        onSave={(p) => {
          onUpdate(p);
          setIsEditOpen(false);
        }}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
