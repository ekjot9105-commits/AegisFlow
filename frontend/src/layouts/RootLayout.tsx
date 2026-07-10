import { Outlet } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useEffect } from 'react';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';

export default function RootLayout() {
  const { isDarkMode, reducedMotion } = useUIStore();

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    if (reducedMotion) document.documentElement.classList.add('reduced-motion');
    else document.documentElement.classList.remove('reduced-motion');
  }, [isDarkMode, reducedMotion]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary overflow-hidden font-sans selection:bg-primary/30 selection:text-white">
      <GlobalHeader />
      
      <main className="flex-1 w-full flex flex-col relative z-10 isolate" role="main">
        {/* Dynamic Background Glows (Global) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" aria-hidden="true" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-info/10 rounded-full blur-[150px] pointer-events-none -z-10" aria-hidden="true" />
        
        <Outlet />
      </main>

      <GlobalFooter />
    </div>
  );
}
