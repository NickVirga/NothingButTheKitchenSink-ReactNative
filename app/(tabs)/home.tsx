import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { ThemedButton, ThemedText, ThemedView } from "../../components";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRequestError,
} from "../../types/auth";

const Home = () => {
  const authContext = useAuthContext();
  const API_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_API_URL;
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getUserData = async () => {

      try {

        const response: AxiosResponse<AuthLoginResponse> = await axios.get(
          `${API_BASE_URL}/api/`,
          { headers: { "Content-Type": "application/json" }, timeout: 5000 }
        );

        setIsLoading(false)
      } catch (err) {
        const error = err as AxiosError<AuthRequestError>;
        if (error.response) {
          // setFormError({
          //   ...formError,
          //   hasError: true,
          //   message: error.response.data.message || "Login failed.",
          // });
        } else {
          // setFormError({
          //   ...formError,
          //   hasError: true,
          //   message: "Network error, please try again.",
          // });
        }
      } finally {
        // setIsLoading(false);
      }
    };
    // getUserData()
  }, []);

  return (
    <SafeAreaView>
      <Text>Nick Virga</Text>
    </SafeAreaView>
  );
};

export default Home;
