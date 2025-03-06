import { View, Text, Image, ImageSourcePropType, StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import {
  useSafeAreaInsets,
  EdgeInsets,
} from "react-native-safe-area-context";
import { home, person, edit, gear } from '../../constants/icons'

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
  const { customNavBarAndStatusBar, theme } = useTheme();
  const insets: EdgeInsets = useSafeAreaInsets();

  return (
    <View style={{flex: 1}}>
      <Tabs screenOptions={{
          tabBarActiveTintColor: theme.tabIconActive,
          tabBarInactiveTintColor: theme.tabIconDefault,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopWidth: 0,
          },}}>
        <Tabs.Screen
          name="home"
          options={{ 
            title: "Home",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={home}
                color={color}
                name="Home"
                focused={focused}
                />
            ) }} 
        />
        
        <Tabs.Screen
          name="tab2"
          options={{ 
            title: "Edit",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={edit}
                color={color}
                name="Edit"
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
                icon={person}
                color={color}
                name="Profile"
                focused={focused}
                />
            ) }} 
        />
        <Tabs.Screen
          name="settings"
          options={{ 
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabIcon
                icon={gear}
                color={color}
                name="Settings"
                focused={focused}
                />
            ) }} 
        />
      </Tabs>
      {customNavBarAndStatusBar(insets.top, 0)}
    </View>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  icon: {
    height: 32,
    width: 32,
  },
  tabText: {
    fontSize: 8,
    fontWeight: 400,
  },
  tabView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, //naive way to move position of icon lower (couldn't get flex to work) 
    width: 100, //naive way to give text/icon enough horiz width (couldn't get flex to work)
  }
})