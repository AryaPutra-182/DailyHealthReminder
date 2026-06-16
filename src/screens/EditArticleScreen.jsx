import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { ArrowLeft, ImagePlus, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import theme from "../../assets/theme";
import { updateArticle, uploadArticleImage } from "../services/articleService";

// Screen EditArticleScreen: Halaman untuk mengedit artikel yang sudah ada
export default function EditArticleScreen({ navigation, route }) {
  // Ambil data artikel yang akan diedit dari parameter navigasi
  const { article } = route.params || {};

  // Pre-fill state dengan data artikel yang ada
  const [title, setTitle] = useState(article?.title || "");
  const [category, setCategory] = useState(article?.category || "");
  const [readTime, setReadTime] = useState(article?.read_time || "");
  const [description, setDescription] = useState(article?.description || "");

  // State gambar:
  // - imageUri: URI lokal baru (dari galeri), null jika belum ganti gambar
  // - imageBase64: String base64 gambar baru
  // - existingImageUrl: URL gambar lama dari Supabase (untuk ditampilkan sebagai preview)
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [existingImageUrl] = useState(article?.image_url || null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // State loading dan error saat request API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi membuka galeri untuk memilih gambar baru
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi membutuhkan izin untuk mengakses galeri foto.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
      setRemoveExistingImage(false);
      setError(null);
    }
  };

  // Fungsi reset form ke data awal (sebelum diedit)
  const handleReset = () => {
    setTitle(article?.title || "");
    setCategory(article?.category || "");
    setReadTime(article?.read_time || "");
    setDescription(article?.description || "");
    setImageUri(null);
    setImageBase64(null);
    setRemoveExistingImage(false);
    setError(null);
  };

  // Helper: tentukan gambar mana yang ditampilkan di preview
  const getPreviewImage = () => {
    if (imageUri) return imageUri; // gambar baru dari galeri
    if (!removeExistingImage && existingImageUrl) return existingImageUrl; // gambar lama
    return null;
  };

  // Fungsi simpan perubahan — upload gambar baru (jika ada), lalu UPDATE ke Supabase
  const handleSave = async () => {
    if (!title.trim() || !category.trim()) {
      Alert.alert("Peringatan", "Judul dan kategori wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Tentukan image_url final:
      // 1. Upload gambar baru jika ada
      let finalImageUrl = existingImageUrl;
      if (imageUri && imageBase64) {
        setUploadingImage(true);
        finalImageUrl = await uploadArticleImage(imageUri, imageBase64);
        setUploadingImage(false);
      } else if (removeExistingImage) {
        finalImageUrl = null;
      }

      // Payload snake_case sesuai skema tabel Supabase
      const payload = {
        title: title.trim(),
        category: category.trim(),
        read_time: readTime.trim() || "5 min",
        image_url: finalImageUrl,
        description: description.trim(),
      };

      // Kirim UPDATE ke Supabase dengan id artikel
      await updateArticle(article.id, payload);

      Alert.alert(
        "Berhasil! ✅",
        `Artikel "${payload.title}" berhasil diperbarui!`,
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      setUploadingImage(false);
      setError(`Gagal: ${err.message}`);
      Alert.alert("Gagal Menyimpan", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLoadingLabel = () => {
    if (uploadingImage) return "Mengupload gambar...";
    if (loading) return "Menyimpan...";
    return null;
  };

  const previewImage = getPreviewImage();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
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
          style={[
            styles.saveHeaderBtn,
            loading && styles.saveHeaderBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={styles.saveHeaderText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {/* === PICKER GAMBAR === */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Gambar Artikel</Text>
            </View>

            {previewImage ? (
              // Tampilkan preview gambar (lama atau baru)
              <View style={styles.imagePreviewWrapper}>
                <Image
                  source={{ uri: previewImage }}
                  style={styles.imagePreview}
                />
                {/* Tombol hapus / ganti gambar */}
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => {
                    if (imageUri) {
                      // Batalkan gambar baru, kembali ke gambar lama
                      setImageUri(null);
                      setImageBase64(null);
                    } else {
                      // Tandai gambar lama untuk dihapus
                      setRemoveExistingImage(true);
                    }
                  }}
                >
                  <X color="#fff" size={16} />
                </TouchableOpacity>
                {/* Tombol ganti gambar (tap area bawah preview) */}
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={handlePickImage}
                >
                  <Text style={styles.changeImageText}>Ganti Gambar</Text>
                </TouchableOpacity>
                {/* Overlay saat upload */}
                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.uploadingText}>Mengupload...</Text>
                  </View>
                )}
              </View>
            ) : (
              // Tombol pilih gambar dari galeri
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handlePickImage}
                activeOpacity={0.75}
              >
                <ImagePlus
                  color={theme.colors.primary}
                  size={32}
                  strokeWidth={1.5}
                />
                <Text style={styles.imagePickerTitle}>Pilih Gambar</Text>
                <Text style={styles.imagePickerSubtitle}>
                  Ketuk untuk memilih dari galeri
                </Text>
              </TouchableOpacity>
            )}
          </View>

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

          {/* Info loading */}
          {loading && (
            <View style={styles.loadingInfo}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingInfoText}>{getLoadingLabel()}</Text>
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
        </View>
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
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
    minWidth: 68,
    alignItems: "center",
  },
  saveHeaderBtnDisabled: { opacity: 0.5 },
  saveHeaderText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  // Input groups
  inputGroup: { marginBottom: 18 },
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
  // Image picker
  imagePicker: {
    height: 150,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.3)",
    borderStyle: "dashed",
    backgroundColor: "rgba(255, 215, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePickerTitle: {
    fontSize: 15,
    color: theme.colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  imagePickerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  // Image preview
  imagePreviewWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    height: 180,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  changeImageBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    alignItems: "center",
  },
  changeImageText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadingText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  // Loading info
  loadingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  loadingInfoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
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
