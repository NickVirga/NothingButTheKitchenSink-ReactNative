import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance, Platform, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";


import { themes } from "../constants/themes";

const lightTheme = themes.light;
const darkTheme = themes.dark;

interface ThemeContextType {
  theme: typeof lightTheme;
  toggleTheme: () => void;
  customNavBarAndStatusBar: (topInset: number, bottomInset: number) => JSX.Element;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

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
          setTheme(
            Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
          );
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
      await AsyncStorage.setItem(
        "themePreference",
        newTheme === darkTheme ? "dark" : "light"
      );
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  const updateNavBar = () => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(theme.background);
    }
  };

  useEffect(() => {
    updateNavBar();
  }, [theme]);

  const customNavBarAndStatusBar = (topInset: number, bottomInset: number) => {
    return (
      <>
        <View
          style={[
            styles.statusBarBackground,
            { backgroundColor: theme.background, height: topInset },
          ]}
        >
          <StatusBar
            backgroundColor={theme.background}
            style={theme.mode === "dark" ? "light" : "dark"}
          />
        </View>
        {Platform.OS === "ios" && (
          <View
            style={{
              backgroundColor: theme.background,
              height: bottomInset,
            }}
          />
        )}
      </>
    );
  };

  const styles = StyleSheet.create({
    statusBarBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, customNavBarAndStatusBar }}>
      {children}
    </ThemeContext.Provider>
  );
};
