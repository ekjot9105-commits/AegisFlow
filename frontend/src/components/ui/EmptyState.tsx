import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({ 
  icon = <CheckCircle className="w-12 h-12 text-primary/30" />, 
  title, 
  description 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full text-center text-textSecondary px-4 py-8 w-full"
    >
      <div className="mb-4">
        {icon}
      </div>
      <p className="text-sm font-bold text-white mb-2 tracking-wide uppercase">{title}</p>
      <p className="text-xs max-w-[250px] leading-relaxed text-textSecondary/80">{description}</p>
    </motion.div>
  );
}
