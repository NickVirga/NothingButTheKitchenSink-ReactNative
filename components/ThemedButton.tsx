import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type ThemedButtonProps = {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  customContainerStyles?: StyleProp<ViewStyle>;
  customTextStyles?: StyleProp<TextStyle>;
  isLoading?: boolean;
  // lightColor?: string;
  // darkColor?: string;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  handlePress,
  customContainerStyles,
  customTextStyles,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[defaultStyles.container, customContainerStyles, isLoading ? { opacity: 0.5 } : {}]}
      disabled={isLoading}
    >
      {!isLoading && ( <Text style={[defaultStyles.text, customTextStyles]}>{title}</Text>)}

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color={theme.background}
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ThemedButton;
