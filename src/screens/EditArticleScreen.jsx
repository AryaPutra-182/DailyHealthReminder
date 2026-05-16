import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import theme from "../../assets/theme";
import { updateArticle } from "../services/articleService";

// Screen EditArticleScreen: Halaman untuk mengedit artikel yang sudah ada
export default function EditArticleScreen({ navigation, route }) {
  // Ambil data artikel yang akan diedit dari parameter navigasi
  const { article } = route.params || {};

  // Pre-fill state dengan data artikel yang ada
  const [title, setTitle] = useState(article?.title || "");
  const [category, setCategory] = useState(article?.category || "");
  const [readTime, setReadTime] = useState(article?.readTime || "");
  const [description, setDescription] = useState(article?.description || "");
  const [imageUrl, setImageUrl] = useState(article?.image || "");

  // State loading dan error saat request API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animated values untuk efek masuk
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Jalankan animasi masuk saat screen mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fungsi reset form ke data awal (sebelum diedit)
  const handleReset = () => {
    setTitle(article?.title || "");
    setCategory(article?.category || "");
    setReadTime(article?.readTime || "");
    setDescription(article?.description || "");
    setImageUrl(article?.image || "");
    setError(null);
  };

  // Fungsi simpan perubahan — mengirim HTTP PUT ke MockAPI
  const handleSave = async () => {
    if (!title.trim() || !category.trim()) {
      Alert.alert("Peringatan", "Judul dan kategori wajib diisi!");
      return;
    }

    // Payload update: pertahankan createdAt yang asli
    const payload = {
      title: title.trim(),
      category: category.trim(),
      readTime: readTime.trim() || "5 min",
      image: imageUrl.trim() || null,
      description: description.trim(),
      createdAt: article?.createdAt || new Date().toISOString(),
    };

    try {
      setLoading(true);
      setError(null);

      // Kirim PUT ke MockAPI dengan id artikel
      await updateArticle(article.id, payload);

      Alert.alert(
        "Berhasil! ✅",
        `Artikel "${payload.title}" berhasil diperbarui!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      setError("Gagal memperbarui artikel. Periksa koneksi dan coba lagi.");
      Alert.alert(
        "Gagal Update",
        "Terjadi kesalahan saat memperbarui data. Pastikan koneksi internet aktif."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <Animated.View
        style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft color={theme.colors.text} size={22} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Edit Artikel</Text>
          <Text style={styles.headerSubtitle}>Perbarui data artikel</Text>
        </View>
        {/* Tombol simpan di header */}
        <TouchableOpacity
          style={[styles.saveHeaderBtn, loading && styles.saveHeaderBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.saveHeaderText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Field Judul Artikel */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Judul Artikel</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Masukkan judul artikel..."
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Field Kategori */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Kategori</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Contoh: NUTRITION, FITNESS, HEALTH..."
              placeholderTextColor={theme.colors.textSecondary}
              value={category}
              onChangeText={(text) => setCategory(text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={30}
            />
          </View>

          {/* Field Estimasi Baca */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Estimasi Baca</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 5 min"
              placeholderTextColor={theme.colors.textSecondary}
              value={readTime}
              onChangeText={setReadTime}
              maxLength={10}
            />
          </View>

          {/* Field URL Gambar */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>URL Gambar</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor={theme.colors.textSecondary}
              value={imageUrl}
              onChangeText={setImageUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Field Deskripsi */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Deskripsi</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tulis deskripsi singkat artikel..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Pesan error jika request gagal */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Baris Tombol Aksi */}
          <View style={styles.actionRow}>
            {/* Tombol Reset ke data awal */}
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleReset}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>Reset</Text>
            </TouchableOpacity>

            {/* Tombol Simpan */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Perbarui Artikel</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 14,
  },
  headerTitleText: {
    fontSize: 17,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  saveHeaderBtn: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    minWidth: 68,
    alignItems: "center",
  },
  saveHeaderBtnDisabled: {
    opacity: 0.5,
  },
  saveHeaderText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // Input groups
  inputGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium",
  },
  required: {
    fontSize: 13,
    color: theme.colors.danger,
    fontFamily: "Poppins-Bold",
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 120,
    paddingTop: 13,
  },
  charCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    textAlign: "right",
    marginTop: 4,
  },
  // Error box
  errorBox: {
    backgroundColor: "rgba(255, 76, 76, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 76, 76, 0.3)",
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  // Baris tombol aksi
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.primary + "99",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.3,
  },
});
