import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Activity } from "lucide-react-native";
import theme from "../../assets/theme";

const { width, height } = Dimensions.get("window");

// Screen SplashScreen: Ditampilkan setiap kali aplikasi dibuka
// Auto-navigasi ke LoginScreen setelah animasi selesai (~2.5 detik)
export default function SplashScreen({ navigation }) {
  // Animated values untuk efek logo dan teks
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Urutan animasi splash screen
    Animated.sequence([
      // 1. Background fade-in
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // 2. Logo muncul dengan scale + fade
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 6,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 3. Nama app slide up + fade
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // 4. Tagline muncul
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Delay sedikit sebelum navigasi agar pengguna sempat membaca
      setTimeout(() => {
        navigation.replace("Login");
      }, 600);
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: bgOpacity }]}>
      {/* Dekorasi lingkaran background */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Logo utama */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        {/* Icon logo — lingkaran hijau dengan ikon aktivitas */}
        <View style={styles.logoIcon}>
          <Activity color={theme.colors.primary} size={46} strokeWidth={1.8} />
        </View>
      </Animated.View>

      {/* Nama Aplikasi */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        Daily Health
      </Animated.Text>
      <Animated.Text
        style={[
          styles.appNameAccent,
          {
            opacity: textOpacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        Reminder
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Your daily wellness companion
      </Animated.Text>

      {/* Loading dots di bawah */}
      <Animated.View style={[styles.dotsContainer, { opacity: taglineOpacity }]}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  // Dekorasi lingkaran latar belakang
  circle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    top: -width * 0.2,
    right: -width * 0.2,
  },
  circle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(0, 194, 168, 0.05)",
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  // Container logo
  logoContainer: {
    marginBottom: 28,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },

  // Teks nama aplikasi
  appName: {
    fontSize: 36,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
    lineHeight: 42,
  },
  appNameAccent: {
    fontSize: 36,
    color: theme.colors.primary,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
    lineHeight: 42,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  // Loading dots
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 48,
    position: "absolute",
    bottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
});
