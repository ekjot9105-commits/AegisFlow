import { Outlet, NavLink } from 'react-router-dom';
import { Bell, Moon, Sun, MonitorSmartphone, Settings, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useEffect, useState, useRef } from 'react';

export default function DashboardLayout() {
  const { isDarkMode, toggleTheme, reducedMotion } = useUIStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    if (reducedMotion) document.documentElement.classList.add('reduced-motion');
    else document.documentElement.classList.remove('reduced-motion');
  }, [isDarkMode, reducedMotion]);

  const navLinks = [
    { name: 'OPERATIONS', path: '/dashboard' },
    { name: 'FAN PORTAL', path: '/fan-portal' },
    { name: 'VOLUNTEER HUB', path: '/volunteers' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary overflow-hidden">
      {/* Top Branding Bar */}
      <div className="h-8 bg-surface/80 border-b border-white/5 flex items-center justify-between px-4 text-xs font-semibold text-textSecondary tracking-wider">
        <div className="flex-1"></div>
        <div className="flex-1 text-center font-bold tracking-widest text-primary/80">FIFA World Cup 2026 Smart Stadium Operations Platform</div>
        <div className="flex-1 flex justify-end items-center gap-4">
          <button className="flex items-center gap-1 hover:text-primary transition-colors"><MonitorSmartphone size={14} /> Device</button>
        </div>
      </div>

      {/* Main Header with Navigation Pills */}
      <header className="glass-panel border-b border-primary/20 z-20 flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-surfaceHighlight/30 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative">
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 relative shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div className="w-4 h-4 rounded-full bg-primary animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">AI</div>
          </div>
          <div>
            <div className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">AI Stadium Operations Copilot</div>
            <h1 className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-white via-primary to-info bg-clip-text text-transparent">AegisFlow</h1>
          </div>
        </div>

        {/* Live AI Status Widget */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-surface/50 border border-white/5 rounded-full shadow-inner animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-semibold text-textSecondary tracking-wide">AI Monitoring Stadium</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center bg-surface/50 p-1 rounded-full border border-white/5 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors focus:ring-2 focus:ring-primary outline-none"
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} className="text-textSecondary" /> : <Moon size={18} className="text-textSecondary" />}
            </button>
            <NavLink to="/settings" className="p-2 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors focus:ring-2 focus:ring-primary outline-none" aria-label="Settings">
              <Settings size={18} className="text-textSecondary" />
            </NavLink>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors relative focus:ring-2 focus:ring-primary outline-none"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
              >
                <Bell size={18} className="text-textSecondary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse" aria-hidden="true"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel bg-surface/90 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-white/10 flex justify-between items-center bg-surfaceHighlight/50">
                    <span className="font-bold text-sm">System Alerts</span>
                    <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    <div className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex gap-3 items-start">
                      <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-white">High density at Gate 4</div>
                        <div className="text-xs text-textSecondary mt-1">AI Copilot requires execution approval.</div>
                        <div className="text-[10px] text-textSecondary mt-2">Just now</div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-white/5 cursor-pointer flex gap-3 items-start">
                      <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-white">Weather Update</div>
                        <div className="text-xs text-textSecondary mt-1">Clear skies, 24°C. No impact on operations.</div>
                        <div className="text-[10px] text-textSecondary mt-2">15 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 relative z-10" role="main">
        {/* Dynamic Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-info/10 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />
        <div className="relative h-full w-full max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
