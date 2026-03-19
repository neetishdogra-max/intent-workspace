import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptEditorModalProps {
  isOpen: boolean;
  title: string;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export function PromptEditorModal({ isOpen, title, value, onSave, onClose }: PromptEditorModalProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (isOpen) setDraft(value);
  }, [isOpen, value]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex w-[90vw] max-w-4xl flex-col rounded-xl border border-border bg-card shadow-xl"
            style={{ maxHeight: '85vh' }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-3">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="h-[55vh] w-full resize-none rounded-lg border border-border bg-muted/20 p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-3">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={() => onSave(draft)}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
