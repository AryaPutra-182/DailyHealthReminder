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
} from "react-native";
import { Eye, EyeOff, Mail, Lock, User, Activity } from "lucide-react-native";
import theme from "../../assets/theme";

const { width } = Dimensions.get("window");

// Screen RegisterScreen: Halaman registrasi pengguna baru (UI only, tanpa logika autentikasi)
export default function RegisterScreen({ navigation }) {
  // State untuk nilai input form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dekorasi background */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

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
          {/* Logo kecil */}
          <View style={styles.logoSmall}>
            <Activity color={theme.colors.secondary} size={28} strokeWidth={1.8} />
          </View>
          <Text style={styles.welcomeText}>Buat Akun Baru</Text>
          <Text style={styles.titleText}>Bergabung Sekarang</Text>
          <Text style={styles.subtitleText}>
            Mulai perjalanan hidup sehat bersama kami
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
          {/* Field Nama */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputWrapper}>
              <User color={theme.colors.textSecondary} size={18} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={setName}
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
                placeholder="Masukkan email kamu"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
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
                placeholder="Buat password kamu"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
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
                placeholder="Ulangi password kamu"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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

          {/* Tombol Register — navigasi kembali ke Login (tanpa logic validasi) */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>Daftar</Text>
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
  // Dekorasi background
  bgCircle1: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "rgba(0, 194, 168, 0.06)",
    top: -width * 0.15,
    left: -width * 0.2,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    bottom: width * 0.1,
    right: -width * 0.15,
  },
  // Header
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(0, 194, 168, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 194, 168, 0.25)",
    marginBottom: 16,
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
