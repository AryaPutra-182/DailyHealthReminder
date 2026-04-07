import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home as HomeIcon, Search, Bookmark as BookmarkIcon, User } from "lucide-react-native";

import theme from "./assets/theme";
import Home from "./src/screens/Home";
import Discover from "./src/screens/Discover";
import Bookmark from "./src/screens/Bookmark";
import Profile from "./src/screens/Profile";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{
              tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
            }}
          />
          <Tab.Screen 
            name="Discover" 
            component={Discover} 
            options={{
              tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
            }}
          />
          <Tab.Screen 
            name="Bookmark" 
            component={Bookmark} 
            options={{
              tabBarIcon: ({ color, size }) => <BookmarkIcon color={color} size={size} />
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={Profile} 
            options={{
              tabBarIcon: ({ color, size }) => <User color={color} size={size} />
            }}
          />
        </Tab.Navigator>

      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 70,
    paddingBottom: 12,
    paddingTop: 10,
    elevation: 0,
    shadowColor: "transparent",
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    marginTop: -4
  }
});