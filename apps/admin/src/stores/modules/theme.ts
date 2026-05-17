import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    },
  ),
);
