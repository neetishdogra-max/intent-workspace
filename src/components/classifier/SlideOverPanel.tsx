import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideOverPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

export function SlideOverPanel({ isOpen, onClose, onSave, children }: SlideOverPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[75vw] flex-col border-l border-border bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.05)]"
          >
            {/* Sticky Header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Query Intent Classifier
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage main prompt and intent buckets
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview Prompt
                </Button>
                <Button size="sm" onClick={onSave}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Save Changes
                </Button>
                <button
                  onClick={onClose}
                  className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
