import {
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  ImageStyle,
} from "react-native";
import React from "react";

type DynamicIconProps = {
  size: number;
  handlePressIcon?: () => void;
  stateZeroIcon: ImageSourcePropType;
  stateOneIcon?: ImageSourcePropType;
  stateOneEnabled?: boolean;
  stateZeroStyle?: ImageStyle;
  stateOneStyle?: ImageStyle;
  isTouchable?: any
};

const DynamicIcon: React.FC<DynamicIconProps> = ({
  size,
  handlePressIcon,
  stateZeroIcon,
  stateOneIcon,
  stateOneEnabled = false,
  stateZeroStyle,
  stateOneStyle,
  isTouchable,
}) => {
  return isTouchable ? (
    <TouchableOpacity onPress={handlePressIcon}>
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
