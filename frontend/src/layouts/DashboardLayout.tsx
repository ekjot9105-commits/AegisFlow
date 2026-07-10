import { Outlet, NavLink } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function DashboardLayout() {
  const navLinks = [
    { name: 'Live Dashboard', path: '/dashboard' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'AI Logs', path: '/ai-activity' },
    { name: 'System', path: '/logs' },
  ];

  return (
    <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
      
      {/* Top Breadcrumb and Ops Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Breadcrumbs />
          <h2 className="text-2xl font-bold text-white tracking-wide">Operations Command Centre</h2>
        </div>
        
        {/* Local Ops Sub-Navigation */}
        <nav className="flex items-center gap-1 bg-surface/50 p-1 rounded-lg border border-white/5 shadow-inner overflow-x-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Dashboard Content Area */}
      <div className="flex-1 animate-fade-in relative">
        <Outlet />
      </div>
    </div>
  );
}
