import { useState } from "react";
import {
  TextInput,
  Platform,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import { ThemedView, ThemedText, StaticIcon, DynamicIcon } from "../components";
import { icons } from "../constants";
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
            ? { borderColor: theme.tint }
            : hasError
            ? { borderColor: theme.error }
            : { borderColor: theme.decorative },
        ]}
      >
        {labelIcon && (
          <StaticIcon
            size={iconSize}
            icon={labelIcon}
            color={
              isValidated
                ? theme.tint
                : hasError
                ? theme.error
                : theme.formSubtle
            }
            isTouchable={false}
          />
        )}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.formSubtle}
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
              ? { color: theme.tint }
              : hasError
              ? { color: theme.error }
              : { color: theme.text },
          ]}
        />
        {fieldValidation && (
          <DynamicIcon
            size={iconSize}
            stateZeroIcon={{}}
            stateOneIcon={icons.check}
            stateOneEnabled={isValidated}
            stateZeroStyle={{ tintColor: theme.border }}
            stateOneStyle={{ tintColor: theme.tint }}
          />
        )}
        {secureTextEntry && (
          <DynamicIcon
            size={iconSize}
            stateZeroIcon={icons.visibilityOff}
            stateOneIcon={icons.visibility}
            stateOneEnabled={showPassword}
            handlePressIcon={() => setShowPassword((prev) => !prev)}
            isTouchable
            stateZeroStyle={{ tintColor: theme.formSubtle }}
            stateOneStyle={{ tintColor: theme.formSubtle }}
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
              icon={icons.error}
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
