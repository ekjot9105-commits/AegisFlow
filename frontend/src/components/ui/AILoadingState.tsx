import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AILoadingState({ message = "AI Operations Copilot" }: { message?: string }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    "Connecting to AI Operations Backend...",
    "Analyzing live stadium telemetry...",
    "Evaluating historical incident data...",
    "Synthesizing recommendations...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card" aria-busy="true" aria-live="polite">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-6 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
      <div className="space-y-4 text-center w-full max-w-sm">
        <p className="text-sm font-bold text-white uppercase tracking-widest">{message}</p>
        <div className="h-6 relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-textSecondary font-mono absolute"
            >
              {steps[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
