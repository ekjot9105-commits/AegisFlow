import { Megaphone } from 'lucide-react';
import type { Announcement } from '../../types';

export default function AnnouncementPanel({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider flex items-center gap-1">
        <Megaphone size={14} /> PA Announcements
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {announcements.map((announcement, idx) => (
          <div key={idx} className="bg-surfaceHighlight/30 p-3 rounded-md border border-borderWhite/10">
            <div className="text-xs font-medium text-info mb-1">{announcement.language}</div>
            <p className="text-sm text-textPrimary italic leading-relaxed">"{announcement.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
