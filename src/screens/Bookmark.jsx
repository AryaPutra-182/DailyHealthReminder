import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Bookmark as BookmarkIcon } from "lucide-react-native";
import theme from "../../assets/theme";

export default function Bookmark() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>Saved articles for later</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyContainer}>
          <BookmarkIcon color={theme.colors.border} size={64} style={styles.icon} />
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptySubtitle}>Start saving your favorite articles to read them later!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold"
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontFamily: "Poppins-Regular"
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold"
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Poppins-Regular"
  }
});
