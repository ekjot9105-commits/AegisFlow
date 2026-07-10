import { Code2, Award, Terminal } from 'lucide-react';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-borderWhite/20 bg-surfaceHighlight/30 backdrop-blur-md mt-auto z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center border border-primary/50">
                <div className="w-3 h-3 rounded-[3px] bg-primary flex items-center justify-center text-white text-[6px] font-black">AI</div>
              </div>
              <span className="font-extrabold tracking-widest text-textPrimary text-lg">AegisFlow</span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed max-w-sm mb-4">
              An advanced, GenAI-powered Stadium Operations Copilot built for the scale and complexity of the FIFA World Cup 2026.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-textSecondary bg-surface/50 px-2 py-1 rounded border border-borderWhite/20">v2.0.0-rc</span>
              <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Systems Operational
              </span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li><a href="#" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:underline">Architecture</a></li>
              <li><a href="#" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:underline">Security & Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:underline">Accessibility Statement</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider mb-4">Competition</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <a href="https://github.com/ekjot9105-commits/AegisFlow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:text-textPrimary focus-visible:underline">
                  <Code2 size={14} /> GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:text-textPrimary focus-visible:underline">
                  <Award size={14} /> Google Prompt Wars
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:text-textPrimary focus-visible:underline">
                  <Terminal size={14} /> Hack2Skill
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-textPrimary transition-colors focus-visible:outline-none focus-visible:text-textPrimary focus-visible:underline">
                  <Code2 size={14} /> Google for Developers
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-8 pt-8 border-t border-borderWhite/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-textSecondary/60 text-center sm:text-left">
            &copy; 2026 AegisFlow Platform. Not officially affiliated with FIFA. Created for Google Prompt Wars.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-textSecondary/60">
            <a href="#" className="hover:text-textPrimary transition-colors">Terms</a>
            <a href="#" className="hover:text-textPrimary transition-colors">Privacy</a>
            <a href="#" className="hover:text-textPrimary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
