import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";

// Komponen Header: Menampilkan salam pengguna, avatar, dan tombol tambah artikel
const Header = ({ title, subtitle, userImage }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Sisi kiri: Salam dan nama pengguna */}
      <View style={styles.leftSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Sisi kanan: Tombol + tambah artikel */}
      <View style={styles.rightSection}>
        {/* Tombol FAB tambah artikel */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddArticle")}
          activeOpacity={0.8}
        >
          <Plus color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  // Tombol tambah artikel
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  // Avatar
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.border,
    padding: 2,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    backgroundColor: theme.colors.border,
  },
});

export default Header;
