import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import theme from "../../assets/theme";
import { getArticles, deleteArticle } from "../services/articleService";
import ArticleCard from "../components/ArticleCard";

// Screen Discover: Memungkinkan pengguna mencari artikel atau konten kesehatan
export default function Discover() {
  // State untuk query pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk data artikel dari API
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Hook navigasi
  const navigation = useNavigation();

  // Animated values untuk efek slide-in header dan fade-in konten
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // Fungsi fetch artikel dari MockAPI
  const fetchArticles = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setFetchError(null);

      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setFetchError("Gagal memuat artikel. Tarik ke bawah untuk mencoba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Menjalankan animasi masuk saat screen pertama kali di-render
  useEffect(() => {
    Animated.sequence([
      // Header dan search bar slide dari atas bersamaan
      Animated.parallel([
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Konten muncul setelah header selesai
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch ulang data setiap kali screen kembali aktif (contoh: setelah Edit)
  useFocusEffect(
    useCallback(() => {
      fetchArticles();
    }, [])
  );

  // Filter artikel berdasarkan query pencarian (judul atau kategori)
  // Jika kosong, tampilkan semua artikel dari API
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  });

  // Fungsi navigasi ke detail artikel
  const handleArticlePress = (article) => {
    navigation.navigate("BlogDetail", {
      title: article.title,
      image: article.image_url,
      category: article.category,
      readTime: article.read_time,
      description: article.description,
    });
  };

  // Fungsi navigasi ke form edit artikel
  const handleEdit = (article) => {
    navigation.navigate("EditArticle", { article });
  };

  // Fungsi hapus artikel dengan konfirmasi
  const handleDelete = (article) => {
    Alert.alert(
      "Hapus Artikel",
      `Yakin ingin menghapus "${article.title}"? Tindakan ini tidak bisa dibatalkan.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteArticle(article.id);
              // Hapus dari state lokal tanpa perlu fetch ulang
              setArticles((prev) => prev.filter((a) => a.id !== article.id));
            } catch (err) {
              Alert.alert("Gagal", "Artikel gagal dihapus. Coba lagi.");
            }
          },
        },
      ]
    );
  };

  // Tampilkan empty state saat ada query tapi tidak ada hasil
  const showNoResult =
    searchQuery.trim().length > 0 && filteredArticles.length === 0;

  return (
    <View style={styles.container}>
      {/* Bagian Header & Search: animasi slide-in dari atas */}
      <Animated.View
        style={{ opacity: headerFade, transform: [{ translateY: headerSlide }] }}
      >
        {/* Bagian Header: Judul halaman dan deskripsi singkat */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Temukan konten kesehatan favoritmu</Text>
        </View>

        {/* Bar Pencarian: Input untuk mencari artikel atau kebiasaan */}
        <View style={styles.searchBar}>
          <Search color={theme.colors.textSecondary} size={20} />
          <TextInput
            placeholder="Cari artikel, tips kesehatan..."
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {/* Tombol hapus query jika ada teks */}
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X color={theme.colors.textSecondary} size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Label jumlah hasil hanya saat ada query */}
        {searchQuery.trim().length > 0 && (
          <Text style={styles.resultCount}>
            {filteredArticles.length > 0
              ? `${filteredArticles.length} artikel ditemukan`
              : "Tidak ada hasil"}
          </Text>
        )}
      </Animated.View>

      {/* Area Konten: fade-in setelah header selesai animasi */}
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        {/* Loading state */}
        {loading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Memuat artikel...</Text>
          </View>
        )}

        {/* Error state */}
        {!loading && fetchError && (
          <View style={styles.centerState}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>Gagal Memuat</Text>
            <Text style={styles.errorText}>{fetchError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchArticles()}
            >
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Konten artikel */}
        {!loading && !fetchError && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchArticles(true)}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          >
            {/* Empty state saat ada query tapi tidak ada hasil */}
            {showNoResult && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>😕</Text>
                <Text style={styles.emptyTitle}>Tidak Ditemukan</Text>
                <Text style={styles.emptyText}>
                  Tidak ada artikel untuk "{searchQuery}"{"\n"}Coba kata kunci lain
                </Text>
              </View>
            )}

            {/* Empty state saat API kosong dan tidak ada search */}
            {!showNoResult && articles.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>Belum Ada Artikel</Text>
                <Text style={styles.emptyText}>
                  Tambahkan artikel pertamamu melalui form Tambah Artikel!
                </Text>
              </View>
            )}

            {/* Grid artikel */}
            {!showNoResult && articles.length > 0 && (
              <View style={styles.grid}>
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    image={article.image_url}
                    category={article.category}
                    readTime={article.read_time}
                    createdAt={article.created_at}
                    onPress={() => handleArticlePress(article)}
                    onEdit={() => handleEdit(article)}
                    onDelete={() => handleDelete(article)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontFamily: "Poppins-Regular",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
  resultCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    marginLeft: 2,
  },
  content: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 20,
  },
  // Grid hasil artikel
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  // Loading / Error center state
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 17,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
});
