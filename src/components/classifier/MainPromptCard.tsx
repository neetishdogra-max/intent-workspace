import { useState } from 'react';
import { Eye, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
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

  const truncated = prompt.slice(0, 180) + (prompt.length > 180 ? '…' : '');

  return (
    <>
      <div className="mx-6 mt-5 rounded-lg border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Main Prompt</h3>
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">
              {truncated}
            </p>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="text-muted-foreground"
            >
              {isPreviewOpen ? (
                <ChevronUp className="mr-1 h-3.5 w-3.5" />
              ) : (
                <Eye className="mr-1 h-3.5 w-3.5" />
              )}
              {isPreviewOpen ? 'Collapse' : 'Preview'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="text-muted-foreground">
              <Pencil className="mr-1 h-3.5 w-3.5" />
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
              <div className="mt-4 rounded-md border border-border bg-code-bg p-4">
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
