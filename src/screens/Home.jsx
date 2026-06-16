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
import { getCurrentUser } from "../services/authService";
import { getScheduledMatches } from "../services/footballService";
import theme from "../../assets/theme";

// Screen Home: Menampilkan halaman utama aplikasi kesehatan
export default function Home() {
  const navigation = useNavigation();
  // Inisialisasi state untuk data profil pengguna
  const [userData, setUserData] = useState(PROFILE_DATA);

  // Ambil nama user yang login dari Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
          setUserData((prev) => ({
            ...prev,
            name: fullName,
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil profil user:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Inisialisasi state untuk artikel utama dan kebiasaan
  const [featuredArticle, setFeaturedArticle] = useState(INITIAL_FEATURED_ARTICLE);
  const [habits] = useState(INITIAL_HABITS);

  // State untuk artikel dari API
  const [articles, setArticles] = useState([]);
  const [todayMatches, setTodayMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi fetch artikel dari MockAPI
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
      
      // Gunakan artikel terbaru sebagai Featured Article (jika ada data)
      if (data && data.length > 0) {
        const latestArticle = data[0];
        setFeaturedArticle({
          id: latestArticle.id,
          title: latestArticle.title,
          image: latestArticle.image_url,
          image_url: latestArticle.image_url, // Dibutuhkan oleh navigasi ListBlog
          category: latestArticle.category,
          readTime: latestArticle.read_time,
          read_time: latestArticle.read_time, // Dibutuhkan oleh navigasi ListBlog
          description: latestArticle.description,
          badgeText: "TERBARU", // Ubah text badge menjadi TERBARU
        });
      } else {
        // Jika tidak ada artikel, kembalikan ke nilai awal
        setFeaturedArticle(INITIAL_FEATURED_ARTICLE);
      }
    } catch (err) {
      console.error("[Home] Gagal fetch artikel:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi fetch match hari ini
  const fetchMatches = useCallback(async () => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      const data = await getScheduledMatches(todayStart, todayEnd);
      // Batasi max 3 pertandingan untuk ditampilkan di Home
      setTodayMatches(data.slice(0, 3));
    } catch (err) {
      console.error("[Home] Gagal fetch match:", err);
    }
  }, []);

  // Fetch ulang setiap kali screen Home aktif (termasuk kembali dari AddArticle)
  useFocusEffect(
    useCallback(() => {
      fetchArticles();
      fetchMatches();
    }, [fetchArticles, fetchMatches])
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
      todayMatches={todayMatches}
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
