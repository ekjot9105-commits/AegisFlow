import { motion } from 'framer-motion';

export default function RiskBadge({ score }: { score: number }) {
  const getRiskProps = () => {
    if (score >= 80) return { label: 'CRITICAL', color: 'bg-danger/20 text-danger border-danger/50' };
    if (score >= 60) return { label: 'HIGH', color: 'bg-warning/20 text-warning border-warning/50' };
    if (score >= 40) return { label: 'MEDIUM', color: 'bg-primary/20 text-primary border-primary/50' };
    return { label: 'LOW', color: 'bg-surfaceHighlight/50 text-textSecondary border-borderWhite/20' };
  };

  const { label, color } = getRiskProps();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-3 py-1 rounded-md border font-bold text-xs tracking-widest uppercase ${color}`}
    >
      Risk Score: {score} - {label}
    </motion.div>
  );
}
