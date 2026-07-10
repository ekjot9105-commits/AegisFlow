import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EvidencePanel({ evidence }: { evidence: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-1">
        <Search size={14} /> Supporting Evidence
      </h4>
      <ul className="space-y-2">
        {evidence.map((item, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-sm bg-surfaceHighlight/30 p-2.5 rounded-md border border-borderWhite/10 flex items-start gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            <span className="text-textPrimary leading-snug">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
