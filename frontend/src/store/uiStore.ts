import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  reducedMotion: boolean;
  language: string;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  setReducedMotion: (val: boolean) => void;
  setLanguage: (val: string) => void;
}

const getSystemTheme = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isDarkMode: getSystemTheme(),
      reducedMotion: false,
      language: 'en',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setReducedMotion: (val) => set({ reducedMotion: val }),
      setLanguage: (val) => set({ language: val }),
    }),
    {
      name: 'aegisflow-ui-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode, reducedMotion: state.reducedMotion, language: state.language }),
    }
  )
);
