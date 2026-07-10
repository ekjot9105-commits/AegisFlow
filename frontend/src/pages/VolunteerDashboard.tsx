import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { MapPin, Navigation, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([
    { id: 'T-101', title: 'Form crowd barricade', location: 'Gate 4 North', priority: 'critical', status: 'pending', time: '10 mins ago' },
    { id: 'T-102', title: 'Assist medical team', location: 'East Plaza', priority: 'high', status: 'in-progress', time: '5 mins ago' },
    { id: 'T-103', title: 'Distribute water', location: 'Sector B', priority: 'medium', status: 'completed', time: '1 hour ago' },
  ]);

  const handleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  const handleNav = (location: string) => {
    alert(`Navigating to ${location}... Route calculated.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Volunteer Dispatch</h2>
        <p className="text-textSecondary text-sm mt-1">Manage field assignments and live locations.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="p-4 glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{task.id}</span>
                    <Badge variant={task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'info'}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="font-medium">{task.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-textSecondary">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {task.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {task.time}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'default'}>
                    {task.status.toUpperCase()}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleNav(task.location)} aria-label={`Navigate to ${task.location}`}><Navigation size={14} className="mr-1" /> Nav</Button>
                    <Button variant="primary" size="sm" onClick={() => handleComplete(task.id)} disabled={task.status === 'completed'} aria-label={`Mark task ${task.id} complete`}>
                      <CheckCircle2 size={14} className="mr-1" /> Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Field Status</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Visual map of active volunteers */}
            <div className="w-full h-64 bg-surfaceHighlight/20 rounded-lg flex items-center justify-center border border-borderWhite/20 relative overflow-hidden" aria-label="Volunteer location map">
              {/* Stadium outline */}
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 absolute inset-0">
                <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-textPrimary" strokeWidth="0.5" fill="none" />
                <rect x="35" y="30" width="30" height="40" stroke="currentColor" className="text-textPrimary" strokeWidth="0.5" fill="none" rx="2" />
              </svg>
              
              {/* Volunteer Nodes */}
              {tasks.filter(t => t.status !== 'completed').map((task, idx) => {
                // Mock positions
                const top = idx === 0 ? '20%' : '60%';
                const left = idx === 0 ? '45%' : '70%';
                return (
                  <div key={task.id} className="absolute flex flex-col items-center group" style={{ top, left }}>
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-info border-2 border-surface"></span>
                    </span>
                    <span className="mt-1 text-[10px] bg-surface/90 px-1.5 py-0.5 rounded font-bold text-textPrimary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {task.id}: {task.location}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
