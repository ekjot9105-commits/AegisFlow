import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchRecommendations, executeRecommendation } from '../../services/copilot';
import RecommendationCard from './RecommendationCard';
import AILoadingState from '../ui/AILoadingState';
import EmptyState from '../ui/EmptyState';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { useToast } from '../../hooks/ToastContext';

export default function CopilotPanel() {
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'executing' | 'completed' | 'rejected'>('pending');
  const { addToast } = useToast();

  const { data, isLoading, isError, error, refetch, isPaused } = useQuery({
    queryKey: ['copilotRecommendations'],
    queryFn: fetchRecommendations,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: (action: 'approve' | 'reject' | 'modify') => executeRecommendation(data?.incident_id || '', action),
    onMutate: () => setExecutionStatus('executing'),
    onSuccess: (res) => {
      if (res.action === 'approve') {
        setExecutionStatus('completed');
        addToast('Recommendation Approved', 'success');
        setTimeout(() => addToast('Volunteers Dispatched', 'info'), 800);
        setTimeout(() => addToast('Announcement Generated', 'success'), 1500);
      }
      if (res.action === 'reject') {
        setExecutionStatus('rejected');
        addToast('Execution Rejected', 'error');
      }
      if (res.action === 'modify') {
        setExecutionStatus('pending');
        addToast('Opening Modification Panel', 'info');
      }
    },
    onError: () => setExecutionStatus('pending')
  });

  // Offline state (handled by React Query isPaused when no network)
  if (isPaused) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card">
        <WifiOff className="w-12 h-12 text-textSecondary mb-4" />
        <h3 className="text-lg font-semibold text-textPrimary">System Offline</h3>
        <p className="text-sm text-textSecondary mt-2">Check your connection to resume AI operations.</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <AILoadingState message="Initializing Copilot Core..." />;
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card border border-danger/30" role="alert">
        <AlertTriangle className="w-12 h-12 text-danger mb-4" />
        <h3 className="text-lg font-semibold text-textPrimary">Analysis Failed</h3>
        <p className="text-sm text-textSecondary mt-2 mb-6">{(error as Error).message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-textPrimary/10 hover:bg-textPrimary/20 rounded text-sm text-textPrimary flex items-center transition-colors">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Analysis
        </button>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="glass-card flex items-center justify-center min-h-[400px]">
        <EmptyState 
          icon={<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative"><span className="w-full h-full rounded-full absolute bg-primary/5 animate-ping"></span><span className="text-2xl">✨</span></div>}
          title="No Active Incidents"
          description="Stadium operations are running normally. AI continues monitoring all sectors."
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full"
    >
      <RecommendationCard 
        data={data}
        status={executionStatus}
        onApprove={() => mutation.mutate('approve')}
        onReject={() => mutation.mutate('reject')}
        onModify={() => mutation.mutate('modify')}
      />
    </motion.div>
  );
}
