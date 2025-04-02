import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance } from "axios";
import { AuthTokensType } from "../types/auth";


export interface AuthContextType {
  isLoading: boolean | undefined;
  accessToken: string | undefined;
  logout: (logoutAllDevices: boolean) => void;
  saveTokens: (tokens: AuthTokensType) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  }, timeout: 5000
});

// add Authorization header with access token to all requests if access token isn't null
apiClient.interceptors.request.use(async (config) => {
  const storedAuthTokens = await AsyncStorage.getItem("authTokens");
  if (storedAuthTokens) {
    const parsedAuthTokens: AuthTokensType = JSON.parse(storedAuthTokens);
    config.headers["Authorization"] = `Bearer ${parsedAuthTokens.accessToken}`;
  }
  return config;
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const saveTokens = (tokens: AuthTokensType) => {
    AsyncStorage.setItem("authTokens", JSON.stringify(tokens));
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    console.log("refresh tokens saveTokens:", tokens.refreshToken)
  };

  useEffect(() => {
    

    const loadAuthToken = async () => {
      setIsLoading(true);

      try {
        const storedAuthTokens: string | null = await AsyncStorage.getItem(
          "authTokens"
        );
        if (storedAuthTokens) {
          const parsedAuthTokens: AuthTokensType = JSON.parse(storedAuthTokens);
          setAccessToken(parsedAuthTokens.accessToken);
          setRefreshToken(parsedAuthTokens.refreshToken);
        }
      } catch (error) {
        console.error("Failed to load authorization token", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthToken();
  }, []);

  
  const logout = async (logoutAllDevices: boolean) => {
    try {
      AsyncStorage.removeItem("authTokens");
      setAccessToken(undefined);
      setRefreshToken(undefined);
      if (logoutAllDevices) {
        await apiClient.post('/api/auth/logout', {
          refresh_token: refreshToken,
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  


  const refreshAccessToken = async () => {
    console.log('refresh token', refreshToken)
    try {
      const response = await apiClient.post('/api/auth/refresh', {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token } = response.data;
      saveTokens({ accessToken: access_token, refreshToken: refresh_token });

    } catch (err) {
      logout(false)
      console.error("Failed to refresh access token:", err);
    }
  };

  useEffect(() => {
    const setupAxiosInterceptors = () => {
      apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
          console.error("error", error);
          console.log("interceptor refresh token", refreshToken)
          if (error.response?.status === 401) {
            try {
              await refreshAccessToken();
              
              const storedAuthTokens = await AsyncStorage.getItem("authTokens");
              if (accessToken && storedAuthTokens) {
                const parsedAuthTokens: AuthTokensType = JSON.parse(storedAuthTokens);
                error.config.headers["Authorization"] = `Bearer ${parsedAuthTokens.accessToken}`;
                return axios.request(error.config);
              }
            } catch (refreshError) {
              console.error("Failed to refresh access token:", refreshError);
              logout(false)
            }
          }

          return Promise.reject(error);
        }
      );
    };
    setupAxiosInterceptors();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoading, accessToken, saveTokens, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
