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
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Eye, EyeOff, Mail, Lock, User, Trophy } from "lucide-react-native";
import theme from "../../assets/theme";
import { registerUser } from "../services/authService";

const { width } = Dimensions.get("window");

// Screen RegisterScreen: Halaman registrasi pengguna baru menggunakan Supabase Auth
export default function RegisterScreen({ navigation }) {
  // State untuk nilai input form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animated values untuk animasi masuk
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const formSlide = useRef(new Animated.Value(60)).current;
  const formFade = useRef(new Animated.Value(0)).current;

  // Jalankan animasi saat screen mount
  useEffect(() => {
    Animated.sequence([
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
      ]),
      Animated.parallel([
        Animated.timing(formFade, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Reset error saat input berubah
  const clearError = () => setError(null);

  // Fungsi registrasi menggunakan Supabase Auth
  const handleRegister = async () => {
    // Validasi input
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Semua field wajib diisi!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await registerUser(email.trim(), password, name.trim());
      // Berhasil daftar → kembali ke Login dengan notif
      navigation.navigate("Login");
      // Tampilkan pesan sukses dengan alert bawaan (bisa diganti toast)
    } catch (err) {
      setError(
        err.message.includes("already registered")
          ? "Email ini sudah terdaftar. Silakan login."
          : err.message
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
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1518605368461-1ee125225f27" }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.75)" }]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Header Section */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Buat Akun Baru</Text>
          <Text style={styles.titleText}>Football Times</Text>
          <Text style={styles.subtitleText}>
            Dapatkan update dunia sepak bola terkini
          </Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.formCard,
            {
              opacity: formFade,
              transform: [{ translateY: formSlide }],
            },
          ]}
        >
          {/* Pesan Error */}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Field Nama */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputWrapper}>
              <User color={theme.colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Nama lengkap"
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={(t) => { setName(t); clearError(); }}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Field Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail color={theme.colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={(t) => { setEmail(t); clearError(); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Field Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock color={theme.colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Buat password"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={(t) => { setPassword(t); clearError(); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showPassword ? (
                  <EyeOff color={theme.colors.textSecondary} size={18} />
                ) : (
                  <Eye color={theme.colors.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Field Konfirmasi Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={styles.inputWrapper}>
              <Lock color={theme.colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); clearError(); }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {showConfirmPassword ? (
                  <EyeOff color={theme.colors.textSecondary} size={18} />
                ) : (
                  <Eye color={theme.colors.textSecondary} size={18} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Tombol Register */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          {/* Link ke Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    overflow: "hidden",
  },
  // Header
  headerSection: {
    alignItems: "center",
    marginBottom: 36,
  },

  welcomeText: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontFamily: "Poppins-Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 24,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  // Form card
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Error box
  errorBox: {
    backgroundColor: "rgba(255, 76, 76, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 76, 76, 0.3)",
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  // Tombol register
  registerButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: theme.colors.secondary + "99",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
  // Link login
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginPrompt: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  loginLink: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
});
