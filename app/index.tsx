import { router, Redirect } from "expo-router";
import { ScrollView } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  EdgeInsets,
} from "react-native-safe-area-context";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  DynamicIcon,
  Loader,
} from "../components";
import { useAuthContext, AuthContextType } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { darkMode, lightMode } from "../constants/icons";

const App: React.FC = () => {
  const { theme, toggleTheme, customNavBarAndStatusBar } = useTheme();
  const authContext: AuthContextType = useAuthContext();
  const isLoading: boolean = authContext?.isLoading ?? true;
  const accessToken: string | undefined = authContext?.accessToken;
  const insets: EdgeInsets = useSafeAreaInsets();

  if (isLoading) {
    return <Loader />;
  }

  if (accessToken) return <Redirect href="/home" />;

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <DynamicIcon
            size={32}
            handlePressIcon={toggleTheme}
            stateZeroIcon={lightMode}
            stateOneIcon={darkMode}
            stateZeroStyle={{tintColor: theme.icon}}
            stateOneStyle={{tintColor: theme.icon}}
            stateOneEnabled={theme.mode === "dark"}
            containerStyle={{
              position: "absolute",
              right: 20,
              top: 20,
              zIndex: 10,
              elevation: 5,
            }}
            isTouchable={true}
          />
          <ThemedView
            style={{
              padding: 20,
            }}
          >
            <ThemedView>
              <ThemedView style={{ justifyContent: "flex-end" }}>
                <ThemedText
                  type={"title"}
                  style={{
                    marginBottom: 10,
                  }}
                >
                  Nothing{"\n"}But{"\n"}The{"\n"}Kitchen{"\n"}Sink
                </ThemedText>
              </ThemedView>
              <ThemedText type={"default"} style={{ marginBottom: 40 }}>
                Get on track to a clean and organized kitchen in less than 10
                minutes
              </ThemedText>
            </ThemedView>
            <ThemedButton
              title="Log In"
              handlePress={() => router.push("/login")}
              customContainerStyles={{
                marginBottom: 10,
              }}
              customTextStyles={{ color: theme.text }}
            />
            <ThemedButton
              title="Sign up"
              handlePress={() => router.push("/register")}
              customContainerStyles={{}}
              customTextStyles={{ color: theme.text }}
            />
          </ThemedView>
        </ScrollView>
        {customNavBarAndStatusBar(insets.top, insets.bottom)}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
