import { Text, type TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext'

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  style?: TextStyle | TextStyle[];
};

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 41,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 41,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});

export default ThemedText