import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { Search } from "lucide-react-native";
import theme from "../../assets/theme";

// Screen Discover: Memungkinkan pengguna mencari artikel atau konten kesehatan
export default function Discover() {
  return (
    <View style={styles.container}>
      {/* Bagian Header: Judul halaman dan deskripsi singkat */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Find your health assistant content</Text>
      </View>

      {/* Bar Pencarian: Input untuk mencari artikel atau kebiasaan */}
      <View style={styles.searchBar}>
        <Search color={theme.colors.textSecondary} size={20} />
        <TextInput 
          placeholder="Search for articles, habits..." 
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.searchInput}
        />
      </View>

      {/* Area Konten: Menggunakan ScrollView untuk menampilkan kategori atau hasil pencarian */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Placeholder untuk fitur kategori yang akan segera hadir */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>Coming soon</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold"
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontFamily: "Poppins-Regular"
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: "Poppins-Regular"
  },
  content: {
    flexGrow: 1,
  },
  placeholderCard: {
    height: 200,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: "Poppins-Medium"
  }
});
