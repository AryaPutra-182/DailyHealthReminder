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
import { Eye, EyeOff, Mail, Lock, Activity } from "lucide-react-native";
import theme from "../../assets/theme";

const { width } = Dimensions.get("window");

// Screen LoginScreen: Halaman login pengguna (UI only, tanpa logika autentikasi)
export default function LoginScreen({ navigation }) {
  // State untuk nilai input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animated values untuk animasi masuk
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const formSlide = useRef(new Animated.Value(60)).current;
  const formFade = useRef(new Animated.Value(0)).current;

  // Jalankan animasi saat screen mount
  useEffect(() => {
    Animated.sequence([
      // Header fade + slide dari atas
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      // Form muncul setelah header
      Animated.parallel([
        Animated.timing(formFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 400,
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
            <Activity color={theme.colors.primary} size={28} strokeWidth={1.8} />
          </View>
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.titleText}>Daily Health Reminder</Text>
          <Text style={styles.subtitleText}>
            Masuk untuk melanjutkan perjalanan kesehatanmu
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
                placeholder="Masukkan password kamu"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              {/* Toggle tampilkan/sembunyikan password */}
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

          {/* Tombol Lupa Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          {/* Tombol Login — navigasi langsung ke Main (tanpa validasi) */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.replace("Main")}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Masuk</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Link ke Register */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    overflow: "hidden",
  },
  // Dekorasi background
  bgCircle1: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "rgba(76, 175, 80, 0.06)",
    top: -width * 0.15,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "rgba(0, 194, 168, 0.05)",
    bottom: width * 0.2,
    left: -width * 0.15,
  },
  // Header
  headerSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.25)",
    marginBottom: 20,
  },

  welcomeText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: "Poppins-Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 26,
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
    marginBottom: 16,
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
  // Lupa password
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: "Poppins-Medium",
  },
  // Tombol login
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  // Link register
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerPrompt: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  registerLink: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
});
