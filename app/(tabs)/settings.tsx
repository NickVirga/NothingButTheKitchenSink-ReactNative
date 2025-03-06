import { View, Text } from "react-native";
import React from "react";
import { DynamicIcon } from "../../components";
import { lightMode, darkMode } from "../../constants/icons";
import { useTheme } from "../../context/ThemeContext";

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16}}>
      <Text style={{ fontSize: 24, fontWeight: 500}}>{'Theme -->'}</Text>
      <DynamicIcon
        size={32}
        handlePressIcon={toggleTheme}
        stateZeroIcon={lightMode}
        stateOneIcon={darkMode}
        stateOneEnabled={theme.mode === "dark"}
        isTouchable={true}
      />
    </View>
  );
};

export default Settings;
