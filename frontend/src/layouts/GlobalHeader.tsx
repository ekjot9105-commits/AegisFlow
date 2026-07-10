import { NavLink, useLocation } from 'react-router-dom';
import { Bell, Moon, Sun, Settings, ShieldAlert } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useState, useRef, useEffect } from 'react';

export default function GlobalHeader() {
  const { isDarkMode, toggleTheme } = useUIStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine current active section for dynamic navigation pills
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/';
  const isFan = location.pathname.startsWith('/fan-portal');
  const isVolunteer = location.pathname.startsWith('/volunteers');

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-primary/20 bg-surfaceHighlight/50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0">
          
          {/* Logo & Branding */}
          <NavLink to="/" className="flex items-center gap-3 mb-4 sm:mb-0 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 relative shadow-[0_0_15px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-shadow">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute" />
              <div className="w-4 h-4 rounded-md bg-primary flex items-center justify-center text-white text-[8px] font-black">AI</div>
            </div>
            <div>
              <div className="text-[9px] text-primary uppercase tracking-[0.2em] font-bold leading-none mb-0.5">FIFA World Cup 2026</div>
              <h1 className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-white via-primary to-info bg-clip-text text-transparent leading-none">AegisFlow</h1>
            </div>
          </NavLink>

          {/* Center Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center bg-surface/50 p-1 rounded-full border border-white/5 shadow-inner">
            <NavLink to="/dashboard" className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isDashboard ? 'bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>Operations</NavLink>
            <NavLink to="/fan-portal" className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isFan ? 'bg-info text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>Fan Hub</NavLink>
            <NavLink to="/volunteers" className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isVolunteer ? 'bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'text-textSecondary hover:text-white hover:bg-white/5'}`}>Volunteers</NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Live AI Status Widget */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface/50 border border-white/5 rounded-full shadow-inner" aria-live="polite">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
              <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">AI Active</span>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block"></div>

            <button onClick={toggleTheme} className="p-1.5 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors focus:ring-2 focus:ring-primary outline-none" aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {isDarkMode ? <Sun size={16} className="text-textSecondary" /> : <Moon size={16} className="text-textSecondary" />}
            </button>

            <NavLink to="/settings" className="p-1.5 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors focus:ring-2 focus:ring-primary outline-none" aria-label="Settings">
              <Settings size={16} className="text-textSecondary" />
            </NavLink>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 rounded-full bg-surface/50 hover:bg-surfaceHighlight border border-white/5 transition-colors relative focus:ring-2 focus:ring-primary outline-none"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
              >
                <Bell size={16} className="text-textSecondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse" aria-hidden="true"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-panel bg-surface/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in origin-top-right">
                  <div className="p-3 border-b border-white/10 flex justify-between items-center bg-surfaceHighlight/80 backdrop-blur-md">
                    <span className="font-bold text-sm text-white">System Alerts</span>
                    <button className="text-xs text-primary hover:underline outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1">Mark all read</button>
                  </div>
                  <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    {/* Example Notification */}
                    <div className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex gap-3 items-start transition-colors focus-visible:bg-white/5 outline-none" tabIndex={0}>
                      <ShieldAlert className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-white leading-none mb-1">High density detected</div>
                        <div className="text-xs text-textSecondary leading-snug">AI Copilot requires execution approval for Gate 4.</div>
                        <div className="text-[10px] text-textSecondary/60 mt-2 font-mono">2 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Role Indicator */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">OP</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
