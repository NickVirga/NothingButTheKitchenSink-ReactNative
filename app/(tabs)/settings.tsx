import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import React from "react";
import { DynamicIcon } from "../../components";
import {
  ThemedView,
  ThemedText,
  ThemedButton,
  StaticIcon,
} from "../../components";
import {
  lightMode,
  darkMode,
  palette,
  arrowBack,
  close,
  circle,
  check,
  routine,
  checkCircle,
} from "../../constants/icons";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >

        {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16}}>
      <Text style={{ fontSize: 24, fontWeight: 500}}>{'Theme -->'}</Text>
      <DynamicIcon
        size={32}
        handlePressIcon={toggleTheme}
        stateZeroIcon={lightMode}
        stateOneIcon={darkMode}
        stateOneEnabled={theme.mode === "dark"}
        isTouchable={true}
      />
    </View> */}

        <ThemedText style={{ marginTop: 32, marginBottom: 16 }}>Theme</ThemedText>
        <View
          style={{ borderRadius: 8, backgroundColor: theme.backgroundSubtle }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderColor: theme.background,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <StaticIcon icon={lightMode} size={24} color={theme.icon} />
              <Text>Light</Text>
            </View>
            <StaticIcon
              icon={theme.mode === "light" ? checkCircle : circle}
              size={20}
              color={theme.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderColor: theme.background,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <StaticIcon icon={darkMode} size={24} color={theme.icon} />
              <Text>Dark</Text>
            </View>
            <StaticIcon
              icon={theme.mode === "dark" ? checkCircle : circle}
              size={20}
              color={theme.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <StaticIcon icon={routine} size={24} color={theme.icon} />
              <Text>System</Text>
            </View>
            <StaticIcon
              icon={theme.mode === "system" ? checkCircle : circle}
              size={20}
              color={theme.icon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  iconContainer: {
    flex: 0,
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 0,
    width: "90%",
    padding: 20,
    borderRadius: 8,
    gap: 16,
  },
  modalCloseIcon: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 15,
  },
  buttonRow: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 32,
  },
  cancelButton: {
    paddingHorizontal: 32,
  },
  logoutConfirmButton: {
    borderColor: "transparent",
    paddingHorizontal: 32,
  },
});
