import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
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
  const glowAnim = useRef(new Animated.Value(0)).current;

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

    // Loop glow animation untuk ikon trophy
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  return (
    <Animated.View style={[styles.container, { opacity: bgOpacity }]}>
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1518605368461-1ee125225f27" }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.75)" }]} />

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
        Football
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
        Times
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Your ultimate football companion ⚽
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
  // Teks nama aplikasi
  appName: {
    fontSize: 38,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1.5,
    lineHeight: 44,
  },
  appNameAccent: {
    fontSize: 38,
    color: theme.colors.primary,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1.5,
    lineHeight: 44,
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
