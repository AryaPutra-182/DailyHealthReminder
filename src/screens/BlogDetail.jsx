import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { ChevronLeft, Clock, Share2, Bookmark, User } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";

// Layar BlogDetail: Menampilkan konten artikel secara lengkap
export default function BlogDetail({ route }) {
  // Mengambil fungsi navigasi dan parameter data artikel yang dikirim saat navigasi
  const navigation = useNavigation();
  const { title, image, category, readTime, content } = route.params || {};

  // Konten cadangan jika data konten tidak tersedia
  const articleContent = content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gambar Header & Tombol Kembali */}
      <View style={styles.headerImageContainer}>
        <Image
          source={{ uri: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        
        {/* Bar Navigasi Atas yang Melayang di atas gambar */}
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} // Kembali ke layar sebelumnya
          >
            <ChevronLeft color={theme.colors.text} size={24} />
          </TouchableOpacity>
          
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Bookmark color={theme.colors.text} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 color={theme.colors.text} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Badge Kategori Artikel */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title and Info */}
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <User size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.authorName}>Daily Health Team</Text>
          </View>
          
          <View style={styles.dot} />
          
          <View style={styles.readTimeRow}>
            <Clock size={14} color={theme.colors.textSecondary} />
            <Text style={styles.readTimeText}>{readTime}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Article Body */}
        <Text style={styles.articleBody}>
          {articleContent}
        </Text>
        
        <Text style={styles.articleBody}>
          Maintaining a healthy lifestyle is essential for overall well-being. This guide provides practical tips to help you stay on track with your fitness goals and nutrition.
        </Text>

        <View style={{ height: 50 }} />
      </ScrollView>
      
      {/* Bottom Sticky Action (Optional) */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Save for later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerImageContainer: {
    height: 350,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topNav: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  topActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 30,
    left: 24,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    lineHeight: 34,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 12,
  },
  readTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readTimeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: "100%",
    marginBottom: 24,
  },
  articleBody: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  mainButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
});
