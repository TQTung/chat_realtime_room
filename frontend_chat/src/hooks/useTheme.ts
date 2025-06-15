import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("chat-realtime-theme") || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem("chat-realtime-theme", theme);
    set({ theme });
  },
}));
