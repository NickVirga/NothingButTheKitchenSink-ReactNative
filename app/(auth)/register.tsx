import { useState } from "react";
import { AxiosError } from "axios";
import {
  ThemedButton,
  ThemedText,
  ThemedView,
  FormField,
  StaticIcon,
} from "../../components";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import {
  arrowBack,
  mail,
  person,
  lock,
  key,
  error,
} from "../../constants/icons";
import {
  FormError,
  RegisterForm,
  AuthRequestResponse,
  AuthRequestError,
} from "../../types/forms";
import { apiClient } from "../../context/AuthContext";

export default function AuthRegister() {
  const { theme } = useTheme();

  const initialFormData: RegisterForm = {
    name: { value: "", hasError: false, errorMessage: "" },
    email: { value: "", hasError: false, errorMessage: "" },
    password: { value: "", hasError: false, errorMessage: "" },
    secretKey: { value: "", hasError: false, errorMessage: "" },
  };

  const [formData, setFormData] = useState<RegisterForm>(initialFormData);

  const [formError, setFormError] = useState<FormError>({
    hasError: false,
    message: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (name: keyof RegisterForm, value: string) => {
    let newFormErrorState = false;
    let newFormErrorMessage = "";

    if (name === "name") {
      const allowedCharactersNameRegex =
        /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]{1,40}( [A-Za-zÀ-ÖØ-öø-ÿ'’-]{1,40})* ?$/;
      if (value && !allowedCharactersNameRegex.test(value)) {
        newFormErrorState = true;
        newFormErrorMessage = "Invalid name format";
      }
    } else if (name === "email") {
      const allowedCharactersEmailRegex = /^[a-zA-Z0-9@._-]*$/;
      if (!allowedCharactersEmailRegex.test(value)) {
        newFormErrorState = true;
        newFormErrorMessage = "Invalid email format";
      }
    }

    setFormError({
      ...formError,
      hasError: false,
      message: "",
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: {
        value,
        hasError: newFormErrorState,
        errorMessage: newFormErrorMessage,
      },
    }));
  };

  const fieldsAreInvalid = () => {
    let newFormErrorState = false;
    let newFormErrorMessage = "";

    let newNameErrorState = false;
    let newNameErrorMessage = "";
    let newEmailErrorState = false;
    let newEmailErrorMessage = "";
    let newPasswordErrorState = false;
    let newPasswordErrorMessage = "";
    let newSecretErrorState = false;
    let newSecretErrorMessage = "";

    const allowedNameRegex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'’-]+)*$/;
    const allowedEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const allowedPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

    if (!allowedNameRegex.test(formData.name.value)) {
      newNameErrorState = true;
      newNameErrorMessage = "Invalid name format.";
    }
    if (!allowedEmailRegex.test(formData.email.value)) {
      newEmailErrorState = true;
      newEmailErrorMessage = "Invalid email format.";
    }
    if (!allowedPasswordRegex.test(formData.password.value)) {
      newPasswordErrorState = true;
      newPasswordErrorMessage = "Please choose a stronger password.";
    }
    if (!formData.secretKey.value) {
      newSecretErrorState = true;
      newSecretErrorMessage = "Invalid secret key format.";
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      name: {
        ...prevFormData.name,
        hasError: newNameErrorState,
        errorMessage: newNameErrorMessage,
      },
      email: {
        ...prevFormData.email,
        hasError: newEmailErrorState,
        errorMessage: newEmailErrorMessage,
      },
      password: {
        ...prevFormData.password,
        hasError: newPasswordErrorState,
        errorMessage: newPasswordErrorMessage,
      },
      secret_key: {
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

    return (
      newNameErrorState ||
      newEmailErrorState ||
      newPasswordErrorState ||
      newSecretErrorState
    );
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (fieldsAreInvalid()) {
      return;
    }

    try {
      setIsLoading(true);

      const requestBody = {
        name: formData.name.value,
        email: formData.email.value,
        password: formData.password.value,
        secret_key: formData.secretKey.value,
      };

      const response = await apiClient.post<AuthRequestResponse>(
        "/api/auth/register",
        requestBody
      );

      router.replace({
        pathname: "/login",
        params: { message: "Registration successful.\nPlease log in" },
      });
    } catch (err) {
      const error = err as AxiosError<AuthRequestError>;
      if (error.response) {
        setFormError({
          ...formError,
          hasError: true,
          message: error.response.data.message || "Registration failed",
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
                  color={theme.icon}
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
                  Create{"\n"}Account
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
                    placeholder="Name"
                    value={formData.name.value}
                    handleChangeText={(text) => handleInputChange("name", text)}
                    labelIcon={person}
                    fieldValidation={true}
                    autoComplete={"name"}
                    textContentType={"name"}
                    hasError={formData.name.hasError}
                    errorMessage={formData.name.errorMessage}
                  />
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
                    hasError={formData.email.hasError}
                    errorMessage={formData.email.errorMessage}
                  />
                  <FormField
                    placeholder="Password"
                    value={formData.password.value}
                    handleChangeText={(text) =>
                      handleInputChange("password", text)
                    }
                    labelIcon={lock}
                    secureTextEntry={true}
                    // autoComplete={"new-password"}
                    // textContentType={"password"}
                    hasError={formData.password.hasError}
                    errorMessage={formData.password.errorMessage}
                  />
                  <FormField
                    placeholder="Secret Key"
                    value={formData.secretKey.value}
                    handleChangeText={(text) =>
                      handleInputChange("secretKey", text)
                    }
                    labelIcon={key}
                    secureTextEntry={true}
                    // autoComplete={"new-password"}
                    textContentType={"none"}
                    hasError={formData.secretKey.hasError}
                    errorMessage={formData.secretKey.errorMessage}
                  />
                </ThemedView>
                <ThemedView
                  style={{
                    flex: 0,
                    position: "relative",
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
                    title="Sign up"
                    handlePress={() => handleRegister()}
                    isLoading={isLoading}
                    customContainerStyles={{
                      backgroundColor: theme.backgroundNotable,
                      borderColor: theme.backgroundNotable,
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
                    title="Log in"
                    handlePress={() => {
                      Keyboard.dismiss();
                      router.push("/login");
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
}
