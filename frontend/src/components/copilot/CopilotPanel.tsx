import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchRecommendations, executeRecommendation } from '../../services/copilot';
import RecommendationCard from './RecommendationCard';
import AILoadingState from '../ui/AILoadingState';
import EmptyState from '../ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff, MessageSquare, Activity } from 'lucide-react';
import { useToast } from '../../hooks/ToastContext';
import OperatorChat from './OperatorChat';

export default function CopilotPanel() {
  const [executionStatus, setExecutionStatus] = useState<'pending' | 'executing' | 'completed' | 'rejected'>('pending');
  const [activeTab, setActiveTab] = useState<'incidents' | 'chat'>('incidents');
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
    <div className="w-full h-full flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="flex bg-surfaceHighlight/50 p-1 rounded-lg border border-borderWhite/10 w-fit">
        <button 
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'incidents' ? 'bg-primary text-bg-base shadow' : 'text-textSecondary hover:text-textPrimary'}`}
        >
          <Activity size={16} /> Active Incidents
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'chat' ? 'bg-accent text-bg-base shadow' : 'text-textSecondary hover:text-textPrimary'}`}
        >
          <MessageSquare size={16} /> Operator Copilot
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'incidents' ? (
            <motion.div 
              key="incidents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full"
              aria-live="polite"
              aria-atomic="true"
            >
              <RecommendationCard 
                data={data}
                status={executionStatus}
                onApprove={() => mutation.mutate('approve')}
                onReject={() => mutation.mutate('reject')}
                onModify={() => mutation.mutate('modify')}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full h-full"
            >
              <OperatorChat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
