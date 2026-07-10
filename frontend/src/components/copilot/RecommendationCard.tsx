import { Check, X, Edit3, Loader2 } from 'lucide-react';
import type { CopilotRecommendation } from '../../types';
import RiskBadge from './RiskBadge';
import ConfidenceMeter from './ConfidenceMeter';
import ReasoningPanel from './ReasoningPanel';
import EvidencePanel from './EvidencePanel';
import AnnouncementPanel from './AnnouncementPanel';
import VolunteerTasks from './VolunteerTasks';
import Button from '../ui/Button';

interface Props {
  data: CopilotRecommendation;
  status: string;
  onApprove: () => void;
  onReject: () => void;
  onModify: () => void;
}

export default function RecommendationCard({ data, status, onApprove, onReject, onModify }: Props) {
  const isExecuting = status === 'executing';
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected';

  return (
    <div className="glass-card flex flex-col h-full border border-primary/40 shadow-[0_0_30px_rgba(34,197,94,0.15)] bg-gradient-to-br from-surface to-surfaceHighlight/30 overflow-hidden relative group">
      {/* Dynamic Animated Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-0" />
      
      {/* Header section */}
      <div className="relative z-10 p-6 border-b border-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold tracking-tight text-textPrimary">{data.incident_id}</h2>
            <RiskBadge score={data.risk_score} />
          </div>
          <p className="text-sm text-textSecondary max-w-2xl">{data.situation_summary}</p>
        </div>
        <ConfidenceMeter confidence={data.confidence} />
      </div>

      <div className="relative z-10 p-6 flex-1 overflow-y-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Root Cause</h4>
              <p className="text-sm text-textPrimary bg-danger/10 text-danger/90 p-3 rounded-lg border border-danger/20 leading-relaxed">
                {data.root_cause}
              </p>
            </div>
            
            <EvidencePanel evidence={data.evidence} />
            <ReasoningPanel reasoning={data.reasoning} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Recommended Actions</h4>
              <ul className="list-decimal list-inside space-y-2 bg-primary/10 p-4 rounded-lg border border-primary/30 text-sm shadow-inner">
                {data.recommended_actions.map((action: string, i: number) => (
                  <li key={i} className="text-textPrimary leading-snug">{action}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Expected Impact</h4>
              <p className="text-sm text-accent bg-accent/10 p-3 rounded-lg border border-accent/20 leading-relaxed mb-4">
                {data.expected_impact}
              </p>
              
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Estimated Congestion Reduction</h4>
              <p className="text-sm text-info bg-info/10 p-3 rounded-lg border border-info/20 leading-relaxed font-medium">
                {data.estimated_congestion_reduction || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-borderWhite/20 pt-8">
          <VolunteerTasks tasks={data.volunteer_tasks} />
          <AnnouncementPanel announcements={data.announcements} />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="relative z-10 p-6 border-t border-primary/20 bg-surface/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {isExecuting && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
          {isCompleted && <Check className="w-5 h-5 text-accent" />}
          {isRejected && <X className="w-5 h-5 text-danger" />}
          <span className="text-sm font-medium text-textSecondary capitalize">
            Execution Status: <span className={isCompleted ? 'text-accent font-bold' : isRejected ? 'text-danger font-bold line-through' : 'text-textPrimary'}>{status}</span>
          </span>
        </div>
        
        <div className="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={onModify} disabled={isExecuting || isCompleted || isRejected} className="flex-1 sm:flex-none">
            <Edit3 size={16} className="mr-2" /> Modify
          </Button>
          <Button variant="danger" onClick={onReject} disabled={isExecuting || isCompleted || isRejected} className="flex-1 sm:flex-none">
            <X size={16} className="mr-2" /> {isRejected ? 'Rejected' : 'Reject'}
          </Button>
          <Button variant="primary" onClick={onApprove} disabled={isExecuting || isCompleted || isRejected} isLoading={isExecuting} className="flex-1 sm:flex-none">
            {!isExecuting && <Check size={16} className="mr-2" />} 
            {isCompleted ? 'Executed' : 'Approve Execution'}
          </Button>
        </div>
      </div>
    </div>
  );
}
