import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuthContext } from "../../context/AuthContext";
import { ThemedButton } from "../../components";
import { router } from "expo-router";

const Profile = () => {
  const authContext = useAuthContext();

  return (
    <View>
      <Text>Profile</Text>
       <ThemedButton
                customContainerStyles={{
                  height: 100,
                  backgroundColor: "red",
                  marginTop: 100,
                }}
                title={"Log out"}
                handlePress={() => {
                  authContext?.logout(true);
                  router.replace("/");
                }}
              />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})