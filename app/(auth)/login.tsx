import { useState } from "react";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  FormField,
  StaticIcon,
} from "../../components";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { arrowBack, mail, lock, error } from "../../constants/icons";
import { FormError, LoginForm } from "../../types/forms";
import { AxiosError, AxiosResponse } from "axios";
import { useAuthContext, apiClient } from "../../context/AuthContext";
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRequestError,
} from "../../types/auth";

const AuthLogin: React.FC = () => {
  const { theme } = useTheme();
  const authContext = useAuthContext();
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

      const response: AxiosResponse<AuthLoginResponse> = await apiClient.post(
        "/api/auth/login",
        requestBody
      );

      authContext?.saveTokens(response.data.authTokens);
      router.replace("/home");
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
    <SafeAreaProvider>
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
                  icon={arrowBack}
                  color={theme.iconSubtle}
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
                <ThemedView
                  style={{ flexDirection: "column", gap: 0, flex: 0 }}
                >
                  <FormField
                    placeholder="Email"
                    value={formData.email.value}
                    handleChangeText={(text) =>
                      handleInputChange("email", text)
                    }
                    labelIcon={mail}
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
                    labelIcon={lock}
                    secureTextEntry={true}
                    autoComplete={"current-password"}
                    textContentType={"password"}
                  />
                  <TouchableOpacity
                    style={{
                      flex: 0,
                      justifyContent: "flex-end",
                      flexDirection: "row",
                      position: "absolute",
                      bottom: 0,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      Keyboard.dismiss();
                      router.replace({
                        pathname: "/reset",
                        params: { email: formData.email.value },
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={{
                        color: theme.textNotable,
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
                        icon={error}
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
                      backgroundColor: theme.backgroundNotable,
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
                        borderBottomColor: theme.borderSubtle,
                        borderBottomWidth: 1,
                        borderStyle: "solid",
                        height: "50%",
                        flex: 1,
                      }}
                    />
                    <ThemedText
                      style={{
                        color: theme.textSubtle,
                        textAlign: "center",
                        lineHeight: 16,
                        fontSize: 17,
                      }}
                    >
                      or
                    </ThemedText>
                    <View
                      style={{
                        borderBottomColor: theme.borderSubtle,
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
                    customContainerStyles={{ borderColor: theme.borderSubtle }}
                    customTextStyles={{ color: theme.textSubtle }}
                  />
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AuthLogin;
