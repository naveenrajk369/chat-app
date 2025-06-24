import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "aqua",
  fontStyle: localStorage.getItem("chat-font-style") || "font-sans",

  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },

  setFontStyle: (fontStyle) => {
    localStorage.setItem("chat-font-style", fontStyle);
    set({ fontStyle });
  },
}));
