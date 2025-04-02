import React from 'react';
import { Text, type TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'errorMessage';
  style?: TextStyle | TextStyle[];
};

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  type = 'default',
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text },
        styles[type],
        type === 'link' && { color: theme.textNotable },
        type === 'errorMessage' && { color: theme.error },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 36,
    lineHeight: 41,
  },
  subtitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 24,
    lineHeight: 30,
  },
  link: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  errorMessage: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 20,
  }
});

export default ThemedText;
