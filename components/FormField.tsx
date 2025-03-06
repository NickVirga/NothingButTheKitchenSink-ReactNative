import { useState } from "react";
import {
  TextInput,
  Platform,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import StaticIcon from "../components/StaticIcon";
import DynamicIcon from "./DynamicIcon";
import { visibility, visibilityOff, check, error } from "../constants/icons";
import { useTheme } from "../context/ThemeContext";
import { ImageSourcePropType } from "react-native";

type FormFieldProps = {
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  labelIcon?: ImageSourcePropType;
  fieldValidation?: boolean;
  secureTextEntry?: boolean;
  isValidated?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: any;
  autoComplete?: any;
  textContentType?: any;
  hasError?: boolean;
  errorMessage?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  value,
  placeholder,
  handleChangeText,
  labelIcon,
  fieldValidation = false,
  secureTextEntry = false,
  isValidated = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete = "off",
  textContentType = "none",
  hasError = false,
  errorMessage = "",
}: FormFieldProps) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const iconSize = Platform.OS === "android" ? 20 : 24;

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[
          styles.fieldContainer,
          isValidated
            ? { borderColor: theme.textNotable }
            : hasError
            ? { borderColor: theme.error }
            : { borderColor: theme.borderSubtle },
        ]}
      >
        {labelIcon && (
          <StaticIcon
            size={iconSize}
            icon={labelIcon}
            color={
              isValidated
                ? theme.textNotable
                : hasError
                ? theme.error
                : theme.iconSubtle
            }
            isTouchable={false}
          />
        )}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.textSubtle}
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          importantForAutofill="no"
          keyboardType={keyboardType}
          style={[
            styles.textInput,
            isValidated
              ? { color: theme.textNotable }
              : hasError
              ? { color: theme.error }
              : { color: theme.text },
          ]}
        />
        {fieldValidation && (
          <DynamicIcon
            size={iconSize}
            stateZeroIcon={{}}
            stateOneIcon={check}
            stateOneEnabled={isValidated}
            stateZeroStyle={{ tintColor: theme.border }}
            stateOneStyle={{ tintColor: theme.textNotable }}
          />
        )}
        {secureTextEntry && (
          <DynamicIcon
            size={iconSize}
            stateZeroIcon={visibilityOff}
            stateOneIcon={visibility}
            stateOneEnabled={showPassword}
            handlePressIcon={() => setShowPassword((prev) => !prev)}
            isTouchable
            stateZeroStyle={{ tintColor: theme.iconSubtle }}
            stateOneStyle={{ tintColor: theme.iconSubtle }}
          />
        )}
      </ThemedView>
      <ThemedView
        style={{
          flex: 0,
          height: 25,
        }}
      >
        {hasError && (
          <ThemedView
            style={{
              flex: 0,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <StaticIcon
              size={iconSize}
              icon={error}
              color={theme.error}
              isTouchable={false}
            />
            <ThemedText
              style={{ color: theme.error, flex: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {errorMessage}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "column",
    gap: 3,
  },
  fieldContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Platform.OS === "android" ? 6 : 12,
    width: "100%",
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: Platform.OS === "android" ? 20 : 18,
    paddingVertical: 14,
  },
});

export default FormField;
