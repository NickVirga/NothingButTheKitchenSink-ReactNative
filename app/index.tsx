import { StatusBar } from "expo-status-bar";
import { router, Redirect } from "expo-router";
import { ScrollView, Image, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton, ThemedText, ThemedView } from "../components";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { icons } from "../constants";


const App = () => {
  const { theme, toggleTheme } = useTheme();
  const authContext = useAuthContext()
  const isLoading = authContext?.isLoading ?? true;
  const isLoggedIn = authContext?.isLoggedIn ?? false;
  const accessToken = authContext?.accessToken

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }

  if (accessToken) return <Redirect href="/home" />;

  return (
    <SafeAreaView>
      {/* <Loader isLoading={loading} /> */}
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            zIndex: 10,
            elevation: 5,
          }}
        >
          <Image
            source={theme.mode === "dark" ? icons.darkMode : icons.lightMode}
            resizeMode="contain"
            style={{
              width: 32,
              height: 32,
            }}
          />
        </TouchableOpacity>
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
            customTextStyles={{ color: theme.text}}
          />
          <ThemedButton
            title="Sign up"
            handlePress={() => router.push("/register")}
            customContainerStyles={{}}
            customTextStyles={{ color: theme.text}}
          />
        </ThemedView>
      </ScrollView>
      <StatusBar
        backgroundColor={theme.background}
        style={theme.mode === "dark" ? "light" : "dark"}
      />
    </SafeAreaView>
  );
};

export default App;
