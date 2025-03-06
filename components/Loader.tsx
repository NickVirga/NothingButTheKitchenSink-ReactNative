import { View, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Loader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View
    style={[styles.container, {backgroundColor: theme.background}]}
    >
      <ActivityIndicator
        animating={true}
        color={theme.text}
        size={Platform.OS === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})