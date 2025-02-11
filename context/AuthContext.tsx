import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { AuthTokensType } from "../types/auth"

interface AuthContextType {
  isLoggedIn: boolean | undefined;
  isLoading: boolean | undefined;
  accessToken: string | undefined;
  logout: () => void;
  saveTokens: (tokens: AuthTokensType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    undefined
  );
  const [refreshToken, setRefreshToken] = useState<
    string | undefined
  >(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;

  const saveTokens = (tokens: AuthTokensType) => {
    AsyncStorage.setItem("authTokens", JSON.stringify(tokens));
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
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
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to load authorization token", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthToken();
  }, []);

  const logout = async () => {
    try {
      AsyncStorage.removeItem("authTokens");
      setAccessToken(undefined);
      setRefreshToken(undefined);
      await axios.post(`${API_BASE_URL}/api/auth/logout`, { refresh_token: refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      saveTokens({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      AsyncStorage.removeItem("authTokens");
      setAccessToken(undefined);
      setRefreshToken(undefined);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, accessToken, saveTokens, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
