import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainPromptModalProps {
  isOpen: boolean;
  prompt: string;
  onSave: (prompt: string) => void;
  onClose: () => void;
}

export function MainPromptModal({ isOpen, prompt, onSave, onClose }: MainPromptModalProps) {
  const [value, setValue] = useState(prompt);

  useEffect(() => {
    if (isOpen) setValue(prompt);
  }, [isOpen, prompt]);

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
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">Edit Main Prompt</h3>
              <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-[55vh] w-full resize-none rounded-lg border border-border bg-code-bg p-4 font-mono text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave(value)}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Prompt
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
