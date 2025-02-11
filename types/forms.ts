export interface FieldData {
  value: string;
  hasError: boolean;
  errorMessage: string;
}
export type FormFields<T extends string> = Record<T, FieldData>;

export type RegisterFormFields = "name" | "email" | "password" | "secretKey";
export type LoginFormFields = "email" | "password";
export type ResetPasswordFields = "email" | "newPassword" | "secretKey";

export type RegisterForm = FormFields<RegisterFormFields>;
export type LoginForm = FormFields<LoginFormFields>;
export type ResetPasswordForm = FormFields<ResetPasswordFields>;

export interface FormError {
  hasError: boolean;
  message: string;
}

export interface AuthRequestResponse {
  message: string;
  token?: string;
}

export interface AuthRequestError {
  message: string;
  errors?: Record<string, string[]>;
}
