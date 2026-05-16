import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
} from "react-native";
import { Clock, MoreVertical, Pencil, Trash2, CalendarDays, ImageOff } from "lucide-react-native";
import theme from "../../assets/theme";

// Fungsi helper untuk format tanggal ISO → "13 Mei 2026"
function formatDate(isoString) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * ArticleCard: Kartu artikel dalam grid
 * Props:
 *   - title, image, category, readTime, createdAt — data artikel
 *   - onPress     — navigasi ke detail
 *   - onEdit      — callback saat pilih Edit
 *   - onDelete    — callback saat pilih Hapus
 */
const ArticleCard = ({ title, image, category, readTime, createdAt, onPress, onEdit, onDelete }) => {
  // Animated value untuk efek skala saat ditekan
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // State untuk menampilkan menu aksi (Edit / Hapus)
  const [menuVisible, setMenuVisible] = useState(false);

  // Mengecilkan kartu saat jari menyentuh
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  // Mengembalikan ukuran dengan efek spring saat jari diangkat
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const formattedDate = formatDate(createdAt);

  return (
    <>
      {/* Modal menu aksi Edit / Hapus */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => {}} 
            style={styles.menuBox}
          >
            {/* Judul artikel di menu */}
            <Text style={styles.menuTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.menuDivider} />

            {/* Tombol Edit */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                if (onEdit) onEdit();
              }}
            >
              <View style={styles.menuIconEdit}>
                <Pencil size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Edit Artikel</Text>
            </TouchableOpacity>

            {/* Tombol Hapus */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                if (onDelete) onDelete();
              }}
            >
              <View style={styles.menuIconDelete}>
                <Trash2 size={16} color={theme.colors.danger} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.danger }]}>
                Hapus Artikel
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Kartu Artikel */}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.gridCard, { transform: [{ scale: scaleAnim }] }]}>
          {/* Gambar atau placeholder saat image null */}
          {image ? (
            <Image
              style={styles.gridImage}
              source={{ uri: image }}
            />
          ) : (
            <View style={styles.gridImagePlaceholder}>
              <ImageOff size={28} color={theme.colors.textSecondary} strokeWidth={1.5} />
            </View>
          )}

          {/* Tombol ⋮ di pojok kanan atas gambar */}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setMenuVisible(true)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <MoreVertical size={16} color="#fff" />
          </TouchableOpacity>

          {/* Konten kartu */}
          <View style={styles.gridCardContent}>
            {/* Badge kategori */}
            <Text style={styles.gridCategory}>{category}</Text>
            {/* Judul artikel */}
            <Text style={styles.gridTitle} numberOfLines={2}>{title}</Text>

            {/* Baris info: waktu baca + tanggal */}
            <View style={styles.gridInfo}>
              <Clock size={12} color={theme.colors.textSecondary} />
              <Text style={styles.gridText}>{readTime}</Text>
            </View>

            {/* Tanggal pembuatan — hanya tampil jika ada data */}
            {formattedDate && (
              <View style={styles.dateRow}>
                <CalendarDays size={11} color={theme.colors.textSecondary} />
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  gridImage: {
    width: "100%",
    height: 120,
    backgroundColor: theme.colors.border,
  },
  // Placeholder saat tidak ada gambar
  gridImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  // Tombol tiga titik di atas gambar
  moreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 5,
  },
  gridCardContent: {
    padding: 12,
  },
  gridCategory: {
    color: theme.colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 5,
    letterSpacing: 0.5,
    fontFamily: "Poppins-Bold",
  },
  gridTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 19,
    marginBottom: 8,
    minHeight: 38,
  },
  gridInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gridText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontFamily: "Poppins-Regular",
  },
  // Baris tanggal pembuatan
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    opacity: 0.8,
  },
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  menuBox: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 4,
  },
  menuTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 18,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuIconEdit: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDelete: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255, 76, 76, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium",
  },
});

export default ArticleCard;
