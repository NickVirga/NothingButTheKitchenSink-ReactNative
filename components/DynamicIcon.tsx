import {
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ImageStyle, StyleProp, ViewStyle
} from "react-native";
import React from "react";

interface DynamicIconProps {
  size: number;
  handlePressIcon?: () => void;
  stateZeroIcon: ImageSourcePropType;
  stateOneIcon?: ImageSourcePropType;
  stateOneEnabled?: boolean;
  stateZeroStyle?: ImageStyle;
  stateOneStyle?: ImageStyle;
  containerStyle?: StyleProp<ViewStyle>;
  isTouchable?: boolean
};

const DynamicIcon: React.FC<DynamicIconProps> = ({
  size,
  handlePressIcon,
  stateZeroIcon,
  stateOneIcon,
  stateOneEnabled = false,
  stateZeroStyle,
  stateOneStyle,
  containerStyle,
  isTouchable = false,
}) => {
  return isTouchable ? (
    <TouchableOpacity onPress={handlePressIcon} style={containerStyle}>
      <Image
        source={stateOneEnabled ? stateOneIcon : stateZeroIcon}
        resizeMode="contain"
        style={[
          { width: size, height: size },
          stateOneEnabled ? stateOneStyle : stateZeroStyle,
        ]}
      />
    </TouchableOpacity>
  ) : (
    <Image
      source={stateOneEnabled ? stateOneIcon : stateZeroIcon}
      resizeMode="contain"
      style={[
        { width: size, height: size },
        stateOneEnabled ? stateOneStyle : stateZeroStyle,
      ]}
    />
  );
};

export default DynamicIcon;
