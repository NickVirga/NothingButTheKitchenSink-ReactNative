import { useState } from "react";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  FormField,
  StaticIcon,
} from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import { icons } from "../../constants";
import {
  FormError,
  LoginForm,
} from "../../types/forms";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthContext } from "../../context/AuthContext";
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRequestError
} from "../../types/auth";


export default function AuthLogin() {
  const { theme } = useTheme();
  const authContext = useAuthContext()
  const params = useLocalSearchParams();
  const titleText: string = String(params.message || "Welcome\nBack");

  const initialFormData: LoginForm = {
    email: { value: "nicktest@gmail.com", hasError: false, errorMessage: "" },
    password: {
      value: "Nicktest123!",
      hasError: false,
      errorMessage: "",
    },
  };

  const API_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<LoginForm>(initialFormData);

  const [formError, setFormError] = useState<FormError>({
    hasError: false,
    message: "",
  });

  const handleInputChange = (name: keyof LoginForm, value: string) => {
    setFormError({
      ...formError,
      hasError: false,
      message: "",
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name],
        value,
      },
    }));
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    try {
      setIsLoading(true);

      const requestBody: AuthLoginRequest = {
        email: formData.email.value,
        password: formData.password.value,
      };

      const response: AxiosResponse<AuthLoginResponse> = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        requestBody,
        { headers: { "Content-Type": "application/json" }, timeout: 5000 }
      );

      authContext?.saveTokens(response.data.authTokens)
      router.replace('/home');
    } catch (err) {
      const error = err as AxiosError<AuthRequestError>;
      if (error.response) {
        setFormError({
          ...formError,
          hasError: true,
          message: error.response.data.message || "Login failed.",
        });
      } else {
        setFormError({
          ...formError,
          hasError: true,
          message: "Network error, please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <ThemedView
            style={{
              padding: 32,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ThemedView>
              <StaticIcon
                size={32}
                icon={icons.arrowBack}
                color={theme.formSubtle}
                isTouchable={true}
                handlePressIcon={() => {
                  Keyboard.dismiss();
                  router.push("/");
                }}
              />
              <ThemedText
                type={"title"}
                style={{
                  marginTop: 100,
                }}
              >
                {titleText}
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                flex: 0,
              }}
            >
              <ThemedView style={{ flexDirection: "column", gap: 0, flex: 0 }}>
                <FormField
                  placeholder="Email"
                  value={formData.email.value}
                  handleChangeText={(text) => handleInputChange("email", text)}
                  labelIcon={icons.mail}
                  fieldValidation={true}
                  autoComplete={"email"}
                  textContentType={"emailAddress"}
                  keyboardType={"email-address"}
                />
                <FormField
                  placeholder="Password"
                  value={formData.password.value}
                  handleChangeText={(text) =>
                    handleInputChange("password", text)
                  }
                  labelIcon={icons.lock}
                  secureTextEntry={true}
                  autoComplete={"current-password"}
                  textContentType={"password"}
                />
                <TouchableOpacity
                style={{
                  flex: 0,
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  position: 'absolute',
                  bottom: 0,
                  alignSelf: 'flex-end'
                }}
                onPress={()=>{
                  Keyboard.dismiss()
                  router.replace({
                  pathname: "/reset",
                  params: { email: formData.email.value },
                });}}
                
                activeOpacity={0.7}
              >
                <ThemedText
                  style={{
                    color: theme.buttonNotable,
                    fontWeight: 500,
                  }} 
                >
                  Forgot password?
                </ThemedText>
              </TouchableOpacity>
              </ThemedView>
              
              <ThemedView
                style={{
                  flex: 0,
                }}
              >
                {formError.hasError && (
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 0,
                      gap: 6,
                      position: "absolute",
                      top: 5,
                    }}
                  >
                    <StaticIcon
                      size={20}
                      icon={icons.error}
                      color={theme.error}
                      isTouchable={false}
                    />
                    <ThemedText style={{ color: theme.error }}>
                      {formError.message}
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
              <ThemedView style={{ flex: 0, marginTop: 48 }}>
                <ThemedButton
                  title="Log in"
                  handlePress={() => handleLogin()}
                  isLoading={isLoading}
                  customContainerStyles={{
                    backgroundColor: theme.tint,
                    borderColor: "transparent",
                  }}
                  customTextStyles={{ color: theme.background }}
                />
                <ThemedView
                  style={{
                    marginVertical: 16,
                    flex: 0,
                    gap: 12,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      borderBottomColor: theme.decorative,
                      borderBottomWidth: 1,
                      borderStyle: "solid",
                      height: "50%",
                      flex: 1,
                    }}
                  />
                  <ThemedText
                    style={{
                      color: theme.formSubtle,
                      textAlign: "center",
                      lineHeight: 16,
                      fontSize: 17,
                    }}
                  >
                    or
                  </ThemedText>
                  <View
                    style={{
                      borderBottomColor: theme.decorative,
                      borderBottomWidth: 1,
                      borderStyle: "solid",
                      height: "50%",
                      flex: 1,
                    }}
                  />
                </ThemedView>

                <ThemedButton
                  title="Sign up"
                  handlePress={() => {
                    Keyboard.dismiss();
                    router.push("/register");
                  }}
                  customContainerStyles={{ borderColor: theme.buttonSubtle }}
                  customTextStyles={{ color: theme.buttonSubtle }}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar backgroundColor={theme.statusBar} style="dark" />
    </SafeAreaView>
  );
}
