import { Image, ImageSourcePropType, ImageStyle, TouchableOpacity } from "react-native";
import React from "react";

type StaticIconProps = {
  size: number;
  icon?: ImageSourcePropType;
  color: string;
  style?: ImageStyle;
  handlePressIcon?: () => void;
  isTouchable: boolean;
};

const StaticIcon: React.FC<StaticIconProps> = ({
  size,
  icon,
  color,
  style,
  handlePressIcon,
  isTouchable,
}) => {
  return isTouchable ? (
    <TouchableOpacity onPress={handlePressIcon}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[{ width: size, height: size, tintColor: color, aspectRatio: 1 }, style]}
      />
    </TouchableOpacity>
  ) : (
    <Image
      source={icon}
      resizeMode="contain"
      style={[{ width: size, height: size, tintColor: color }, style]}
    />
  );
};

export default StaticIcon;
