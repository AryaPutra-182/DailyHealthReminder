import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { Bookmark as BookmarkIcon, Clock, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";

// Data sementara untuk artikel yang tersimpan di bookmark
const BOOKMARKED_ARTICLES = [
  {
    id: 1,
    category: "FITNESS",
    title: "10 Minute Daily Exercise For Beginners",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    readTime: "5 min",
  },
  {
    id: 2,
    category: "NUTRITION",
    title: "Healthy Food Guide For You",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    readTime: "5 min",
  },
  {
    id: 3,
    category: "HEALTH",
    title: "Secret To Better Sleep",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    readTime: "4 min",
  },
  {
    id: 4,
    category: "MINDSET",
    title: "Daily Meditation Practice",
    image: "https://images.unsplash.com/photo-1532099515082-9dbcc5e25a2a",
    readTime: "5 min",
  },
  {
    id: 5,
    category: "WELLNESS",
    title: "Stay Hydrated All Day",
    image: "https://images.unsplash.com/photo-1552674605-15c370425cc0",
    readTime: "3 min",
  },
];

// Screen Bookmark: Menyimpan daftar artikel yang telah ditandai oleh pengguna
export default function Bookmark() {
  const navigation = useNavigation();

  // Animated values untuk efek fade-in dan slide-up
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Menjalankan animasi masuk saat screen pertama kali di-render
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fungsi navigasi ke detail artikel
  const handleArticlePress = (article) => {
    navigation.navigate("BlogDetail", {
      title: article.title,
      image: article.image,
      category: article.category,
      readTime: article.readTime,
    });
  };

  return (
    <View style={styles.container}>
      {/* Bagian Header: Judul dan deskripsi halaman bookmark */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View>
          <Text style={styles.title}>Bookmarks</Text>
          <Text style={styles.subtitle}>
            {BOOKMARKED_ARTICLES.length} artikel tersimpan
          </Text>
        </View>
        {/* Badge jumlah bookmark */}
        <View style={styles.badge}>
          <BookmarkIcon color={theme.colors.primary} size={16} />
          <Text style={styles.badgeText}>{BOOKMARKED_ARTICLES.length}</Text>
        </View>
      </Animated.View>

      {/* Daftar artikel yang di-bookmark */}
      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {BOOKMARKED_ARTICLES.map((article, index) => (
          <BookmarkItem
            key={article.id}
            article={article}
            index={index}
            onPress={() => handleArticlePress(article)}
          />
        ))}

        <View style={{ height: 30 }} />
      </Animated.ScrollView>
    </View>
  );
}

// Komponen item bookmark individual dengan animasi staggered
function BookmarkItem({ article, index, onPress }) {
  // Setiap item muncul dengan delay berbeda sesuai urutan (staggered)
  const itemFade = useRef(new Animated.Value(0)).current;
  const itemSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemFade, {
        toValue: 1,
        duration: 350,
        delay: index * 80, // Staggered delay: item ke-0 langsung, ke-1 delay 80ms, dst
        useNativeDriver: true,
      }),
      Animated.timing(itemSlide, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.itemWrapper,
        { opacity: itemFade, transform: [{ translateY: itemSlide }] },
      ]}
    >
      <TouchableOpacity
        style={styles.bookmarkCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Thumbnail gambar artikel */}
        <Image
          source={{
            uri: article.image || "https://picsum.photos/200/200?blur=2",
          }}
          style={styles.thumbnail}
        />

        {/* Konten teks artikel */}
        <View style={styles.cardContent}>
          {/* Badge kategori */}
          <Text style={styles.category}>{article.category}</Text>
          {/* Judul artikel */}
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          {/* Info waktu baca */}
          <View style={styles.infoRow}>
            <Clock size={12} color={theme.colors.textSecondary} />
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
        </View>

        {/* Tombol hapus bookmark (UI placeholder) */}
        <TouchableOpacity
          style={styles.removeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => {}} // TODO: logic hapus bookmark
        >
          <X size={14} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontFamily: "Poppins-Regular",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.25)",
  },
  badgeText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  // Scroll content
  content: {
    paddingBottom: 20,
    gap: 12,
  },
  // Wrapper item
  itemWrapper: {
    marginBottom: 0,
  },
  // Card bookmark horizontal
  bookmarkCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    paddingRight: 12,
  },
  thumbnail: {
    width: 90,
    height: 90,
    backgroundColor: theme.colors.border,
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  category: {
    fontSize: 10,
    color: theme.colors.secondary,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  readTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  // Tombol hapus
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexShrink: 0,
  },
});
