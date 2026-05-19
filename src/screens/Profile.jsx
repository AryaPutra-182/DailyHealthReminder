import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  Settings,
  Bell,
  Shield,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import theme from "../../assets/theme";
import { getCurrentUser, logoutUser } from "../services/authService";

export default function Profile() {
  const navigation = useNavigation();

  // State untuk data user dari Supabase Auth
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Animated values untuk staggered fade-in
  const animValues = useRef([
    new Animated.Value(0), // headerTitle
    new Animated.Value(0), // profileCard
    new Animated.Value(0), // section Preferences
    new Animated.Value(0), // section Support
  ]).current;

  // Ambil data user saat screen mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("[Profile] fetchUser error:", err.message);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Jalankan staggered animation setelah data user dimuat
  useEffect(() => {
    if (!loadingUser) {
      Animated.stagger(
        120,
        animValues.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [loadingUser]);

  // Helper: konversi animated value ke style translateY + opacity
  const getAnimStyle = (anim) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  // Fungsi logout dengan konfirmasi
  const handleLogout = () => {
    Alert.alert(
      "Keluar",
      "Yakin ingin keluar dari akun kamu?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logoutUser();
              // Kembali ke Splash atau Login setelah logout
              navigation.replace("Login");
            } catch (err) {
              Alert.alert("Gagal", "Terjadi kesalahan saat logout. Coba lagi.");
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Komponen pembantu untuk merender opsi menu
  const MenuOption = ({ Icon, title, subtitle }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate("SettingsDetail", { title })}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
        <Icon color={theme.colors.primary} size={22} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight color={theme.colors.border} size={20} />
    </TouchableOpacity>
  );

  // Loading state saat mengambil data user
  if (loadingUser) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Ambil nama dan email dari Supabase user metadata
  const displayName = user?.user_metadata?.full_name || "Pengguna";
  const displayEmail = user?.email || "-";
  // Buat avatar placeholder dari inisial nama
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Title */}
      <Animated.View style={[styles.header, getAnimStyle(animValues[0])]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </Animated.View>

      {/* Card Info Pengguna */}
      <Animated.View style={[styles.profileCard, getAnimStyle(animValues[1])]}>
        {/* Avatar: lingkaran dengan inisial nama */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarLetter}>{avatarLetter}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
          {/* Badge Supabase user */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Terverifikasi</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Settings color={theme.colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Section Preferences */}
      <Animated.View style={[styles.section, getAnimStyle(animValues[2])]}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuOption Icon={Bell} title="Notifications" subtitle="Reminders, health tips" />
        <MenuOption Icon={Shield} title="Privacy & Security" subtitle="Personal info management" />
        <MenuOption Icon={Settings} title="General Settings" />
      </Animated.View>

      {/* Section Support */}
      <Animated.View style={[styles.section, getAnimStyle(animValues[3])]}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuOption Icon={Info} title="Help Center" />
        {/* Tombol Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color={theme.colors.danger} size="small" />
          ) : (
            <LogOut color={theme.colors.danger} size={20} />
          )}
          <Text style={styles.logoutText}>
            {loggingOut ? "Keluar..." : "Log Out"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Avatar placeholder berbasis inisial
  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(76, 175, 80, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 28,
    color: theme.colors.primary,
    fontFamily: "Poppins-Bold",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontFamily: "Poppins-Medium",
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 8,
    borderRadius: 12,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium",
  },
  menuSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 4,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: theme.colors.danger,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },
});
