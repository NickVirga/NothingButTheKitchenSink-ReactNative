import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import {
  useSafeAreaInsets,
  EdgeInsets,
} from "react-native-safe-area-context";

const AuthLayout = () => {
  const { customNavBarAndStatusBar } = useTheme();
  const insets: EdgeInsets = useSafeAreaInsets();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reset"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {customNavBarAndStatusBar(insets.top, insets.bottom)}
    </>
  );
};

export default AuthLayout;
