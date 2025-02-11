import { useState } from "react";
import axios, { AxiosError } from "axios";
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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import { icons } from "../../constants";
import {
  FormError,
  ResetPasswordForm,
  AuthRequestResponse,
  AuthRequestError,
} from "../../types/forms";

export default function AuthReset() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const initialEmailValue: string = String(params.email || "");

  const initialFormData: ResetPasswordForm = {
    email: { value: initialEmailValue, hasError: false, errorMessage: "" },
    newPassword: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    secretKey: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
  };

  const API_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<ResetPasswordForm>(initialFormData);

  const [formError, setFormError] = useState<FormError>({
    hasError: false,
    message: "",
  });

  const handleInputChange = (name: keyof ResetPasswordForm, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        ...prevFormData[name],
        value,
      },
    }));
  };

  const fieldsAreInvalid = () => {
    let newFormErrorState = false;
    let newFormErrorMessage = "";

    let newPasswordErrorState = false;
    let newPasswordErrorMessage = "";
    let newSecretErrorState = false;
    let newSecretErrorMessage = "";

    const allowedPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!allowedPasswordRegex.test(formData.newPassword.value)) {
      newPasswordErrorState = true;
      newPasswordErrorMessage = "Please choose a stronger password.";
    }
    if (!formData.secretKey.value) {
      newSecretErrorState = true;
      newSecretErrorMessage = "Invalid secret key format.";
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      email: {
        ...prevFormData.email,
      },
      newPassword: {
        ...prevFormData.newPassword,
        hasError: newPasswordErrorState,
        errorMessage: newPasswordErrorMessage,
      },
      secretKey: {
        ...prevFormData.secretKey,
        hasError: newSecretErrorState,
        errorMessage: newSecretErrorMessage,
      },
    }));

    setFormError({
      ...formError,
      hasError: newFormErrorState,
      message: newFormErrorMessage,
    });

    return newPasswordErrorState || newSecretErrorState;
  };

  const handleReset = async () => {
    Keyboard.dismiss();

    if (fieldsAreInvalid()) {
      return;
    }

    try {
      setIsLoading(true);

      const requestBody = {
        email: formData.email.value,
        password: formData.newPassword.value,
        secret_key: formData.secretKey.value,
      };

      await axios.post<AuthRequestResponse>(
        `${API_BASE_URL}/api/auth/reset`,
        requestBody,
        { headers: { "Content-Type": "application/json" }, timeout: 5000 }
      );

      router.replace({
        pathname: "/login",
        params: { message: "Password reset successful.\nPlease log in" },
      });
    } catch (err) {
      const error = err as AxiosError<AuthRequestError>;
      if (error.response) {
        setFormError({
          ...formError,
          hasError: true,
          message: error.response.data.message || "Password reset failed.",
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
                  router.push("/login");
                }}
              />
              <ThemedText
                type={"title"}
                style={{
                  marginTop: 100,
                }}
              >
                Reset{"\n"}Password
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
                  placeholder="New Password"
                  value={formData.newPassword.value}
                  handleChangeText={(text) =>
                    handleInputChange("newPassword", text)
                  }
                  labelIcon={icons.lock}
                  secureTextEntry={true}
                  autoComplete={"new-password"}
                  textContentType={"password"}
                  hasError={formData.newPassword.hasError}
                  errorMessage={formData.newPassword.errorMessage}
                />
                <FormField
                  placeholder="Secret Key"
                  value={formData.secretKey.value}
                  handleChangeText={(text) =>
                    handleInputChange("secretKey", text)
                  }
                  labelIcon={icons.key}
                  secureTextEntry={true}
                  textContentType={"none"}
                  hasError={formData.secretKey.hasError}
                  errorMessage={formData.secretKey.errorMessage}
                />
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
                  title="Reset Password"
                  handlePress={() => handleReset()}
                  isLoading={isLoading}
                  customContainerStyles={{
                    backgroundColor: theme.tint,
                    borderColor: "transparent",
                  }}
                  customTextStyles={{ color: theme.background }}
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
