import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BrainCircuit } from 'lucide-react';

export default function ReasoningPanel({ reasoning }: { reasoning: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-borderWhite/20 rounded-lg overflow-hidden bg-surfaceHighlight/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium text-sm text-primary">
          <BrainCircuit size={16} />
          AI Reasoning Engine
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={16} className="text-textSecondary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-textSecondary leading-relaxed border-t border-borderWhite/10 mt-2 pt-4">
              {reasoning}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
