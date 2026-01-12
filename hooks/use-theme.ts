import React, { ReactNode } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { THEMES } from "@/constants/themes";

export const ThemeContext = React.createContext(THEMES.ocean);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);
  const currentTheme = THEMES[theme];

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
