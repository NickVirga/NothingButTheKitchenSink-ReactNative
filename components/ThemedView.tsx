import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const ThemedView: React.FC<ThemedViewProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: theme.background }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});

export default ThemedView;
