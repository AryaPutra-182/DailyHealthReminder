import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ListBlog from "../components/ListBlog";
import {
  INITIAL_FEATURED_ARTICLE,
  INITIAL_HABITS,
} from "../data/blogData";
import { PROFILE_DATA } from "../data/profile";
import { getArticles, deleteArticle } from "../services/articleService";
import theme from "../../assets/theme";

// Screen Home: Menampilkan halaman utama aplikasi kesehatan
export default function Home() {
  const navigation = useNavigation();
  // Inisialisasi state untuk data profil pengguna
  const [userData] = useState(PROFILE_DATA);

  // Inisialisasi state untuk artikel utama dan kebiasaan (data statis)
  const [featuredArticle] = useState(INITIAL_FEATURED_ARTICLE);
  const [habits] = useState(INITIAL_HABITS);

  // State untuk artikel dari API
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi fetch artikel dari MockAPI
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error("[Home] Gagal fetch artikel:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch ulang setiap kali screen Home aktif (termasuk kembali dari AddArticle)
  useFocusEffect(
    useCallback(() => {
      fetchArticles();
    }, [fetchArticles])
  );

  // Tampilkan loading spinner saat data belum siap
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Memuat artikel...</Text>
      </View>
    );
  }

  // Navigasi edit
  const handleEdit = (article) => {
    navigation.navigate("EditArticle", { article });
  };

  // Hapus artikel dengan Alert
  const handleDelete = (article) => {
    Alert.alert(
      "Hapus Artikel",
      `Yakin ingin menghapus "${article.title}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteArticle(article.id);
              setArticles((prev) => prev.filter((a) => a.id !== article.id));
            } catch (err) {
              Alert.alert("Gagal", "Artikel gagal dihapus.");
            }
          },
        },
      ]
    );
  };

  return (
    // Merender komponen ListBlog dengan data yang sudah diambil dari API
    <ListBlog
      userData={userData}
      featuredArticle={featuredArticle}
      habits={habits}
      articles={articles}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});
