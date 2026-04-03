import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import theme from "../../assets/theme";

const Header = ({ title, subtitle, userImage }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: userImage || "https://picsum.photos/100/100" }} 
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.border,
    padding: 2,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    backgroundColor: theme.colors.border, // Debug background color
  },
});

export default Header;
