import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ImageSourcePropType,
  Image,
  ImageStyle
} from "react-native";

import { useTheme } from "../context/ThemeContext";

type ThemedButtonProps = {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  customContainerStyles?: StyleProp<ViewStyle>;
  customTextStyles?: StyleProp<TextStyle>;
  customIconStyles?: StyleProp<ImageStyle>;
  isLoading?: boolean;
  icon?: ImageSourcePropType;
};

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  handlePress,
  customContainerStyles,
  customTextStyles,
  customIconStyles,
  isLoading = false,
  icon,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {borderColor: theme.border},
        defaultStyles.container,
        customContainerStyles,
        isLoading ? { opacity: 0.5 } : {},
      ]}
      disabled={isLoading}
    >
      {icon && (
        <Image
          source={icon}
          resizeMode="contain"
          style={[defaultStyles.icon, {tintColor: theme.icon}, customIconStyles]}
        ></Image>
      )}
      {!isLoading && (
        <Text style={[defaultStyles.text, customTextStyles]}>{title}</Text>
      )}

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color={theme.background}
          size="small"
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    width: 24,
    height: 24,
    aspectRatio: 1,
  },
});

export default ThemedButton;
