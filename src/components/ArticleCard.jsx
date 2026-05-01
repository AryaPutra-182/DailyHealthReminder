import React, { useRef } from "react";
import { View, Text, TouchableWithoutFeedback, Image, StyleSheet, Animated } from "react-native";
import { Clock } from "lucide-react-native";
import theme from "../../assets/theme";

const ArticleCard = ({ title, image, category, readTime, onPress }) => {
  // Animated value untuk efek skala saat ditekan
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Mengecilkan kartu saat jari menyentuh
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
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
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.gridCard, { transform: [{ scale: scaleAnim }] }]}>
        <Image
          style={styles.gridImage}
          source={{ uri: image || "https://picsum.photos/400/200?blur=2" }}
        />
        <View style={styles.gridCardContent}>
          <Text style={styles.gridCategory}>{category}</Text>
          <Text style={styles.gridTitle} numberOfLines={2}>{title}</Text>
          
          <View style={styles.gridInfo}>
            <Clock size={12} color={theme.colors.textSecondary} />
            <Text style={styles.gridText}>{readTime}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  gridImage: {
    width: "100%",
    height: 120,
    backgroundColor: theme.colors.border, // Debug background color
  },
  gridCardContent: {
    padding: 14,
  },
  gridCategory: {
    color: theme.colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  gridTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 10,
    height: 40, // fix height so 1-line and 2-line text don't break layout
  },
  gridInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gridText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ArticleCard;
