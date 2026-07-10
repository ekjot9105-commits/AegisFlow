import { useQuery } from '@tanstack/react-query';
import { fetchTimeline } from '../../services/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import SkeletonLoader from '../ui/SkeletonLoader';
import EmptyState from '../ui/EmptyState';
import { Train, Activity, BrainCircuit, CheckCircle, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function IncidentTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: fetchTimeline,
    refetchInterval: 8000
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Train size={16} />;
      case 'medical': return <Activity size={16} />;
      case 'prediction': return <BrainCircuit size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'announcement': return <Megaphone size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'delay': return 'bg-warning/20 text-warning';
      case 'medical': return 'bg-danger/20 text-danger';
      case 'prediction': return 'bg-accent/20 text-accent';
      case 'approved': return 'bg-primary/20 text-primary';
      case 'announcement': return 'bg-info/20 text-info';
      default: return 'bg-surfaceHighlight text-white';
    }
  };

  if (isLoading) {
    return <SkeletonLoader className="h-96 w-full" />;
  }

  return (
    <Card className="col-span-1 flex flex-col h-full min-h-[400px]">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>Event Timeline</CardTitle>
        {data && data.length > 0 && <Badge variant="info">Live</Badge>}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 pb-4">
        {(!data || data.length === 0) ? (
          <EmptyState 
            title="No Incidents Logged" 
            description="Stadium operations are running normally. AI continues monitoring all sectors for anomalies." 
          />
        ) : (
          <div 
            className="relative border-l border-white/10 ml-3 space-y-6 mt-4" 
            aria-live="polite" 
            aria-atomic="false"
          >
            {data.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 cursor-pointer group"
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              >
                <div className={`absolute -left-3.5 top-0.5 p-1.5 rounded-full ring-4 ring-background ${getIconColor(event.type)} transition-transform group-hover:scale-110`}>
                  {getIcon(event.type)}
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm leading-none group-hover:text-primary transition-colors">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-textSecondary tabular-nums">{event.timestamp}</span>
                    {expandedId === event.id ? <ChevronUp size={14} className="text-textSecondary" /> : <ChevronDown size={14} className="text-textSecondary" />}
                  </div>
                </div>
                <p className="text-sm text-textSecondary">{event.description}</p>
                
                <AnimatePresence>
                  {expandedId === event.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-textSecondary">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                          <span className="uppercase tracking-wider font-semibold">Event ID: {event.id}</span>
                          <span className="text-primary">{event.type.toUpperCase()}</span>
                        </div>
                        <p className="leading-relaxed">
                          This event was automatically classified and logged by AegisFlow Copilot. 
                          {event.type === 'prediction' && " Preventative measures were immediately recommended."}
                          {event.type === 'approved' && " The operator successfully validated the execution strategy."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
