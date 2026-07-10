import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe, Users, BrainCircuit, MonitorSmartphone } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

export default function LandingPage() {
  const navigate = useNavigate();
  const predictionsCount = useCountUp(99, 2000);
  const dataPointsCount = useCountUp(1500000, 2500); // 1.5M

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
    return num + '%';
  };

  const roles = [
    {
      id: 'ops',
      title: 'Operations Centre',
      description: 'Command center for staff. Live telemetry, incident management, and AI Copilot approvals.',
      icon: <ShieldCheck size={32} />,
      color: 'from-primary/20 to-primary/5',
      textColor: 'text-primary',
      borderColor: 'border-primary/20 hover:border-primary/50',
      path: '/dashboard'
    },
    {
      id: 'fan',
      title: 'Fan Hub',
      description: 'Public portal for attendees. Multilingual AI concierge, smart wayfinding, and live alerts.',
      icon: <Globe size={32} />,
      color: 'from-info/20 to-info/5',
      textColor: 'text-info',
      borderColor: 'border-info/20 hover:border-info/50',
      path: '/fan-portal'
    },
    {
      id: 'volunteer',
      title: 'Volunteer Hub',
      description: 'Mobile-first dashboard for ground staff. Task assignments and location-based alerts.',
      icon: <Users size={32} />,
      color: 'from-accent/20 to-accent/5',
      textColor: 'text-accent',
      borderColor: 'border-accent/20 hover:border-accent/50',
      path: '/volunteers'
    },
    {
      id: 'organizer',
      title: 'Organizer Analytics',
      description: 'High-level metrics, post-match reporting, and historical AI performance review.',
      icon: <BrainCircuit size={32} />,
      color: 'from-warning/20 to-warning/5',
      textColor: 'text-warning',
      borderColor: 'border-warning/20 hover:border-warning/50',
      path: '/analytics'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40 flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live for FIFA World Cup 2026
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-textPrimary mb-6 leading-tight">
            The Future of <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">Stadium Intelligence</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed">
            AegisFlow is a GenAI-powered Operations Copilot designed to preemptively manage crowds, coordinate volunteers, and provide seamless multilingual support across all 16 host venues.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:bg-primary/90 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Enter Live Operations <ArrowRight size={18} />
            </button>
            <a 
              href="https://github.com/ekjot9105-commits/AegisFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-surfaceHighlight text-textPrimary font-bold rounded-lg border border-borderWhite/20 hover:bg-borderWhite/10 transition-all w-full sm:w-auto justify-center flex items-center gap-2"
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Role Selection / Portals */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20 bg-surfaceHighlight/20 border-t border-b border-borderWhite/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-textPrimary mb-4">Select Your Portal</h2>
            <p className="text-textSecondary max-w-xl mx-auto">Access customized modules tailored specifically to your role in the stadium ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(role.path)}
                className={`glass-card p-6 cursor-pointer group bg-gradient-to-br ${role.color} border ${role.borderColor} transition-all hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className={`w-14 h-14 rounded-xl bg-surface/80 border border-borderWhite/20 flex items-center justify-center mb-6 ${role.textColor} group-hover:scale-110 transition-transform shadow-inner`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-textPrimary mb-2">{role.title}</h3>
                <p className="text-sm text-textSecondary leading-relaxed mb-6 h-16">{role.description}</p>
                <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${role.textColor}`}>
                  Access Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics & Features */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-textPrimary mb-4">Powered by Advanced GenAI</h2>
                <p className="text-textSecondary leading-relaxed text-lg">
                  Traditional dashboards only show you what happened. AegisFlow's Copilot tells you what will happen, explains why, and provides a one-click execution strategy to mitigate it.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-borderWhite/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-primary w-5 h-5" />
                    <h4 className="font-bold text-textPrimary">Sub-Second Processing</h4>
                  </div>
                  <p className="text-sm text-textSecondary">Real-time SSE streams parse IoT telemetry instantly.</p>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-borderWhite/20">
                  <div className="flex items-center gap-3 mb-2">
                    <MonitorSmartphone className="text-info w-5 h-5" />
                    <h4 className="font-bold text-textPrimary">Responsive Design</h4>
                  </div>
                  <p className="text-sm text-textSecondary">Accessible on all devices, optimizing field ops.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card flex flex-col items-center justify-center p-8 text-center aspect-square border-primary/20 bg-primary/5"
              >
                <div className="text-4xl sm:text-5xl font-black text-primary mb-2 tabular-nums">
                  {formatNumber(predictionsCount)}
                </div>
                <div className="text-xs font-bold text-textSecondary uppercase tracking-widest">Prediction Accuracy</div>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card flex flex-col items-center justify-center p-8 text-center aspect-square border-info/20 bg-info/5 mt-10"
              >
                <div className="text-4xl sm:text-5xl font-black text-info mb-2 tabular-nums">
                  {formatNumber(dataPointsCount)}
                </div>
                <div className="text-xs font-bold text-textSecondary uppercase tracking-widest">Data Points / Sec</div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
