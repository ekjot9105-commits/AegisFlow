import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ShieldCheck, UserCheck, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecentActivityPanel() {
  const activities = [
    { id: 1, type: 'approval', text: 'Operator approved AI dispatch to Gate 4.', time: '2m ago', icon: <ShieldCheck size={14} className="text-primary" /> },
    { id: 2, type: 'volunteer', text: 'Unit Alpha-3 arrived at sector N2.', time: '5m ago', icon: <UserCheck size={14} className="text-info" /> },
    { id: 3, type: 'alert', text: 'Crowd density exceeded 95% at West Plaza.', time: '12m ago', icon: <AlertTriangle size={14} className="text-warning" /> },
    { id: 4, type: 'comm', text: 'Multilingual announcement broadcasted to Sector E.', time: '15m ago', icon: <MessageSquare size={14} className="text-accent" /> },
    { id: 5, type: 'approval', text: 'Operator modified AI routing path for VIP entry.', time: '22m ago', icon: <ShieldCheck size={14} className="text-primary" /> },
  ];

  return (
    <Card className="col-span-1 flex flex-col h-[300px]">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 pb-4">
        <div className="space-y-4 mt-2">
          {activities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-textPrimary/5 transition-colors cursor-default border border-transparent hover:border-borderWhite/10"
            >
              <div className="mt-0.5 p-1.5 rounded bg-surface border border-borderWhite/20 shadow-inner">
                {activity.icon}
              </div>
              <div>
                <p className="text-xs text-textPrimary leading-relaxed">{activity.text}</p>
                <p className="text-[10px] text-textSecondary font-mono mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
