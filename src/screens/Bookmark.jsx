import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { Bookmark as BookmarkIcon } from "lucide-react-native";
import theme from "../../assets/theme";

// Screen Bookmark: Menyimpan daftar artikel yang telah ditandai oleh pengguna
export default function Bookmark() {
  // Animated values untuk efek bounce pada ikon dan fade-in judul
  const bounceAnim = useRef(new Animated.Value(-40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  // Menjalankan animasi masuk saat screen pertama kali di-render
  useEffect(() => {
    Animated.sequence([
      // Ikon turun dari atas dengan efek spring
      Animated.spring(bounceAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 5,
        bounciness: 14,
      }),
      // Judul dan subtitle fade-in setelah ikon selesai
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Bagian Header: Judul dan deskripsi halaman bookmark */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>Saved articles for later</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tampilan Empty State: Ditampilkan saat belum ada artikel yang disimpan */}
        <View style={styles.emptyContainer}>
          {/* Ikon bounce dari atas */}
          <Animated.View style={[styles.icon, { transform: [{ translateY: bounceAnim }] }]}>
            <BookmarkIcon color={theme.colors.border} size={64} />
          </Animated.View>
          {/* Teks muncul setelah ikon selesai */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
            <Text style={styles.emptySubtitle}>Start saving your favorite articles to read them later!</Text>
          </Animated.View>
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
