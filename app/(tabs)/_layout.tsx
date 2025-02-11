import { View, Text, Image, ImageSourcePropType, StyleSheet, Dimensions  } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import React from "react";
import { Tabs, Redirect } from "expo-router";

import { icons } from '../../constants'

interface TabIconProps {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused}) => {
  return (
    <View style={styles.tabView}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={styles.icon}
      />
      <Text style={[styles.tabText, {color: color}]}>{name}</Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <View style={{flex: 1}}>
      <Tabs screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },}}>
        <Tabs.Screen
          name="home"
          options={{ 
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
                />
            ) }} 
        />
        
        <Tabs.Screen
          name="tab2"
          options={{ 
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
                />
            ) }} 
        />
        <Tabs.Screen
          name="tab3"
          options={{ 
            title: "Create",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
                />
            ) }} 
        />
        <Tabs.Screen
          name="profile"
          options={{ 
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
                />
            ) }} 
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 400,
  },
  tabView: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20, //naive way to move position of icon lower (couldn't get flex to work) 
    width: 100, //naive way to give text/icon enough horiz width (couldn't get flex to work)
  }
})