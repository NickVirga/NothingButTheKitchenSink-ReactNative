
export interface AuthTokensType {
  accessToken: string;
  refreshToken: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  message: string;
  authTokens: AuthTokensType;
}

export interface AuthRequestError {
  message: string;
  errors?: Record<string, string[]>;
}
