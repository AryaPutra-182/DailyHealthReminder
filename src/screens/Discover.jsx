import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";
import { INITIAL_ARTICLES } from "../data/blogData";
import ArticleCard from "../components/ArticleCard";

// Screen Discover: Memungkinkan pengguna mencari artikel atau konten kesehatan
export default function Discover() {
  // State untuk query pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // Hook navigasi
  const navigation = useNavigation();

  // Animated values untuk efek slide-in header dan fade-in konten
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

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

  // Filter artikel berdasarkan query pencarian (judul atau kategori)
  // Jika kosong, tampilkan semua artikel
  const filteredArticles = INITIAL_ARTICLES.filter((article) => {
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
      image: article.image,
      category: article.category,
      readTime: article.readTime,
    });
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
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

          {/* Grid artikel — tampil semua saat kosong, filter saat ada query */}
          {!showNoResult && (
            <View style={styles.grid}>
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  image={article.image}
                  category={article.category}
                  readTime={article.readTime}
                  onPress={() => handleArticlePress(article)}
                />
              ))}
            </View>
          )}
        </ScrollView>
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
});
