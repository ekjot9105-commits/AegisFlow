import { Check, X, Edit3, Loader2, BrainCircuit } from 'lucide-react';
import type { CopilotRecommendation, CopilotAction } from '../../types';
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
            
            {/* AI Explainability Module */}
            <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit size={16} /> AI Explainability
              </h4>
              <div className="space-y-5">
                <EvidencePanel evidence={data.evidence} />
                <ReasoningPanel reasoning={data.reasoning} />
                <div>
                   <h5 className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider mb-2">Decision Chain</h5>
                   <div className="space-y-2 pl-2 border-l border-accent/30">
                     {data.reasoning_chain?.map((step: string, i: number) => (
                       <div key={i} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[9px] text-accent font-bold shrink-0 mt-0.5">{i+1}</div>
                          <p className="text-xs text-textSecondary">{step}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Recommended Actions</h4>
              <div className="space-y-3">
                {data.recommended_actions.map((action: CopilotAction, i: number) => (
                  <div key={i} className="bg-primary/10 p-4 rounded-lg border border-primary/30 shadow-inner">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-textPrimary">{action.action_id} - {action.assigned_role}</span>
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded capitalize">{action.priority}</span>
                    </div>
                    <p className="text-sm text-textPrimary leading-snug mb-2">{action.description}</p>
                    <p className="text-xs text-textSecondary"><span className="font-semibold">Impact:</span> {action.expected_impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.alternative_actions && data.alternative_actions.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Alternative Actions</h4>
                <div className="space-y-3 opacity-80">
                  {data.alternative_actions.map((action: CopilotAction, i: number) => (
                    <div key={i} className="bg-surface p-4 rounded-lg border border-borderWhite/20 border-dashed">
                       <p className="text-sm text-textPrimary leading-snug mb-2">{action.description}</p>
                       <p className="text-xs text-textSecondary"><span className="font-semibold">Impact:</span> {action.expected_impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Estimated Crowd Reduction</h4>
              <p className="text-sm text-info bg-info/10 p-3 rounded-lg border border-info/20 leading-relaxed font-medium">
                {data.estimated_crowd_reduction ? `${data.estimated_crowd_reduction}%` : "N/A"}
              </p>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-borderWhite/20 pt-8">
          <VolunteerTasks tasks={data.volunteer_tasks} />
          <AnnouncementPanel announcements={data.multilingual_announcement} />
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
