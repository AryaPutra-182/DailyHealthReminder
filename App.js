import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ListBlog from "./src/components/ListBlog";
import theme from "./assets/theme";

import { 
  INITIAL_USER_DATA, 
  INITIAL_FEATURED_ARTICLE, 
  INITIAL_HABITS, 
  INITIAL_ARTICLES 
} from "./src/data/blogData";

export default function App() {
  const [userData] = useState(INITIAL_USER_DATA);
  const [featuredArticle] = useState(INITIAL_FEATURED_ARTICLE);
  const [habits] = useState(INITIAL_HABITS);
  const [articles] = useState(INITIAL_ARTICLES);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.container}>
        <ListBlog 
          userData={userData}
          featuredArticle={featuredArticle}
          habits={habits}
          articles={articles}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});