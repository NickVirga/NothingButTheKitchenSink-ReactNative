import { Image, ImageSourcePropType, ImageStyle, TouchableOpacity, StyleProp, ViewStyle} from "react-native";
import React from "react";

type StaticIconProps = {
  size: number;
  icon: ImageSourcePropType;
  color: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: ImageStyle;
  handlePressIcon?: () => void;
  isTouchable?: boolean;
};

const StaticIcon: React.FC<StaticIconProps> = ({
  size,
  icon,
  color,
  containerStyle,
  imageStyle,
  handlePressIcon,
  isTouchable = false,
}) => {
  return isTouchable ? (
    <TouchableOpacity onPress={handlePressIcon} style={containerStyle} disabled={!isTouchable}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[{ width: size, height: size, tintColor: color, aspectRatio: 1 }, imageStyle]}
      />
    </TouchableOpacity>
  ) : (
    <Image
      source={icon}
      resizeMode="contain"
      style={[{ width: size, height: size, tintColor: color, aspectRatio: 1 }, imageStyle]}
    />
  );
};

export default StaticIcon;
