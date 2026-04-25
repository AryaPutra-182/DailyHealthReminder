import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import theme from "./assets/theme";
import Router from "./src/navigation/router";

/**
 * Komponen Utama App: Titik masuk aplikasi
 * Mengatur Root Stack yang dibungkus oleh SafeAreaProvider dan NavigationContainer
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Mengatur status bar di bagian atas layar agar sesuai dengan tema */}
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

