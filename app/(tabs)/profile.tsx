import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  ThemedView,
  ThemedText,
  ThemedButton,
  StaticIcon,
} from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { arrowBack, logout, close } from "../../constants/icons";

const Profile = () => {
  const authContext = useAuthContext();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
          style={[styles.logoutButton, { borderColor: theme.border }]}
        >
          <ThemedView style={styles.logoutContent}>
            <ThemedView
              style={[
                styles.iconContainer,
                { backgroundColor: theme.backgroundSubtle },
              ]}
            >
              <StaticIcon icon={logout} size={32} color={theme.icon} />
            </ThemedView>
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </ThemedView>
          <StaticIcon
            icon={arrowBack}
            size={24}
            color={theme.icon}
            imageStyle={{ transform: [{ scaleX: -1 }] }}
          />
        </TouchableOpacity>

        <Modal
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <StaticIcon
                    size={32}
                    icon={close}
                    color={theme.icon}
                    isTouchable
                    handlePressIcon={() => setModalVisible(false)}
                    containerStyle={styles.modalCloseIcon}
                  />
                  <ThemedText style={styles.modalTitle}>Log Out?</ThemedText>
                  <ThemedText style={styles.modalMessage}>
                    Are you sure you want to log out?
                  </ThemedText>
                  <ThemedView style={styles.buttonRow}>
                    <ThemedButton
                      title="Cancel"
                      handlePress={() => setModalVisible(false)}
                      customContainerStyles={styles.cancelButton}
                    />
                    <ThemedButton
                      title="Log Out"
                      handlePress={() => {
                        setModalVisible(false);
                        authContext?.logout(true);
                        router.replace("/");
                      }}
                      customContainerStyles={[
                        styles.logoutConfirmButton,
                        { backgroundColor: theme.backgroundNotable },
                      ]}
                      customTextStyles={{ color: theme.background }}
                    />
                  </ThemedView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;

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
