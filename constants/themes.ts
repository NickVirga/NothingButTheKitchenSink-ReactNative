const tintColorLight = "#007AFF";
const tintColorDark = "#0A84FF";
const subtleDecorativeLight = '#C8C8C8'
const subtleDecorativeDark = '#C8C8C8'

export const themes = {
  light: {
    mode: "light",
    text: "#1C1C1E",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#585D62",
    tabIconDefault: "#A1A1A1",
    tabIconSelected: tintColorLight,
    statusBar: "#F2F2F7",
    card: "#F8F9FA",
    border: "#D1D1D6",
    decorative: subtleDecorativeLight,
    formSubtle: '#969696',
    buttonSubtle: '#969696',
    buttonNotable: tintColorLight,
    error: "#FF0000"
  },
  dark: {
    mode: "dark",
    text: "#F2F2F7",
    background: "#1C1C1E",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#5A5A5E",
    tabIconSelected: tintColorDark,
    statusBar: "#000000",
    card: "#2C2C2E",
    border: "#3A3A3C",
    decorative: subtleDecorativeDark,
    formSubtle: subtleDecorativeDark,
    buttonSubtle: subtleDecorativeDark,
    buttonNotable: tintColorDark,
    error: "#FF0000"
  },
};
