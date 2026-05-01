import React, { useRef } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet, Animated } from "react-native";
import theme from "../../assets/theme";

const HabitCard = ({ Icon, label, color, bgColor, onPress }) => {
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
      <Animated.View style={[styles.habitCardScroll, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.habitIconContainer, { backgroundColor: bgColor }]}>
          <Icon size={24} color={color} />
        </View>
        <Text style={styles.habitText}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  habitCardScroll: {
    backgroundColor: theme.colors.card,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    width: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  habitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  habitText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HabitCard;
