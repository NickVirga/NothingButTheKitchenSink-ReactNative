import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { themes } from "../constants/themes"

const lightTheme = themes.light
const darkTheme = themes.dark

interface ThemeContextType {
  theme: typeof lightTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themePreference");
        if (savedTheme) {
          setTheme(savedTheme === "dark" ? darkTheme : lightTheme);
        } else {
          setTheme(Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error("Failed to load theme", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === lightTheme ? darkTheme : lightTheme;
      setTheme(newTheme);
      await AsyncStorage.setItem("themePreference", newTheme === darkTheme ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
