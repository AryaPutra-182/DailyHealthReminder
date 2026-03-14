import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ListBlog from "./src/components/ListBlog";
import theme from "./assets/theme";

export default function App() {

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.container}>
        <ListBlog styles={styles} />
      </SafeAreaView>
    </SafeAreaProvider>
  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },

  listBlog: {
    marginTop: 20
  }

});