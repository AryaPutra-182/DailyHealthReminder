import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";

// Layar SettingsDetail: Menampilkan halaman pengaturan atau detail menu dari profil
export default function SettingsDetail({ route }) {
  // Mengambil fungsi navigasi dan judul halaman dari parameter
  const navigation = useNavigation();
  const { title } = route.params || { title: "Settings" };

  return (
    <View style={styles.container}>
      {/* Header Kustom dengan tombol kembali */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()} // Kembali ke layar sebelumnya
        >
          <ChevronLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} /> {/* Spacer agar judul tetap di tengah */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Kartu Placeholder untuk konten yang akan datang */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Konten {title}</Text>
          <Text style={styles.placeholderSubtitle}>
            Halaman ini sedang dalam pengembangan. Di sini Anda akan dapat mengelola preferensi {title.toLowerCase()} Anda.
          </Text>
        </View>

        {/* Daftar Opsi Pengaturan Contoh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umum</Text>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Pilihan 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Pilihan 2</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  content: {
    padding: 24,
  },
  placeholderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 32,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 12,
    fontFamily: "Poppins-Bold",
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Poppins-Regular",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
    fontFamily: "Poppins-SemiBold",
  },
  option: {
    backgroundColor: theme.colors.card,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium",
  },
});
