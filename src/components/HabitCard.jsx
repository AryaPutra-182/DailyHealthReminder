import React, { useRef } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated } from "react-native";
import theme from "../../assets/theme";

const HabitCard = ({ label, color, bgColor, onPress }) => {
  // Animated value untuk efek skala saat ditekan
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Mengecilkan kartu saat jari menyentuh
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
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
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.habitCardScroll, { transform: [{ scale: scaleAnim }], backgroundColor: bgColor }]}>
        <Text style={[styles.habitText, { color: color }]}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  habitCardScroll: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  habitText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
});

export default HabitCard;
