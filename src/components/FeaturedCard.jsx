import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import theme from "../../assets/theme";

const FeaturedCard = ({ title, image, readTime, badgeText = "FEATURED", onPress }) => {
  return (
    <View style={styles.featureCardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <ImageBackground
          style={styles.featureImage}
          imageStyle={{ borderRadius: 24 }}
          source={{ uri: image || "https://picsum.photos/600/300?blur=1" }}
        >
          <View style={styles.featureOverlay}>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>{badgeText}</Text>
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <View style={styles.featureMeta}>
              <Clock size={14} color="#E0E0E0" />
              <Text style={styles.featureMetaText}>{readTime} read</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  featureCardContainer: {
    paddingHorizontal: 24,
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  featureImage: {
    height: 220,
    width: "100%",
    backgroundColor: theme.colors.border, // Debug background color
  },
  featureOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.45)", 
  },
  featureBadge: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  featureBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 28,
  },
  featureMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureMetaText: {
    color: "#E0E0E0",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default FeaturedCard;
