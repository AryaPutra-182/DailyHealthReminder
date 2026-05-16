import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home as HomeIcon, Search, Bookmark as BookmarkIcon, User } from "lucide-react-native";

import theme from "../../assets/theme";

// Import semua screen
import Home from "../screens/Home";
import Discover from "../screens/Discover";
import Bookmark from "../screens/Bookmark";
import Profile from "../screens/Profile";
import BlogDetail from "../screens/BlogDetail";
import SettingsDetail from "../screens/SettingsDetail";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddArticleScreen from "../screens/AddArticleScreen";
import EditArticleScreen from "../screens/EditArticleScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * Komponen MainTab: Mengelola navigasi tab bar di bagian bawah aplikasi
 */
function MainTab() {
  return (
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
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          tabBarIcon: ({ color, size }) => <BookmarkIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Komponen Router: Navigator Stack utama aplikasi
 * Urutan: Splash → Login → Register → Main (Tabs) → Screen detail
 */
const Router = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {/* Screen awal: Splash Screen muncul setiap kali app dibuka */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Screen autentikasi */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Screen utama dengan bottom tab navigation */}
      <Stack.Screen name="Main" component={MainTab} />

      {/* Screen detail */}
      <Stack.Screen name="BlogDetail" component={BlogDetail} />
      <Stack.Screen name="SettingsDetail" component={SettingsDetail} />
      <Stack.Screen name="AddArticle" component={AddArticleScreen} />
      <Stack.Screen name="EditArticle" component={EditArticleScreen} />
    </Stack.Navigator>
  );
};

export default Router;

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
    marginTop: -4,
  },
});
