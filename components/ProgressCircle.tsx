import { View, StyleSheet } from "react-native";
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from "../context/ThemeContext";

interface Segment {
    percentage: number;
    color: string;
  }
  
  interface ProgressCircleProps {
    segments: Segment[];
    size: number; //circle diameter
    strokeWidth: number;
  }

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    segments,
    size,
    strokeWidth,
}) => {
    const { theme } = useTheme();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
  
    let cumulativePercentage = 0;

  return (
    <View
    style={[styles.container, {backgroundColor: theme.background}]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.backgroundSubtle}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {segments.map((segment, index) => {
          const offset = (1 - cumulativePercentage / 100) * circumference;
          const visibleLength = (segment.percentage / 100) * circumference; 
          cumulativePercentage += segment.percentage;

          return (
            <Circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${visibleLength} ${circumference - visibleLength}`} // visible length; invisible length
              strokeDashoffset={offset} // offset length from starting position
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default ProgressCircle;

const styles = StyleSheet.create({
    container: {
        // flex: 0,
        // justifyContent: 'center',
        // alignItems: 'center',
    }
})