import { ShieldHalf, MapPin } from 'lucide-react';
import type { VolunteerTask } from '../../types';

export default function VolunteerTasks({ tasks }: { tasks: VolunteerTask[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-1">
        <ShieldHalf size={14} /> Volunteer Dispatch
      </h4>
      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surfaceHighlight/30 rounded-md border border-borderWhite/10 gap-2">
            <span className="text-sm text-textPrimary font-medium">{task.task}</span>
            <div className="flex items-center gap-1 text-xs text-textSecondary bg-surface p-1 px-2 rounded-md border border-borderWhite/10">
              <MapPin size={12} />
              {task.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
