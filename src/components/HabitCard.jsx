import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../assets/theme";

const HabitCard = ({ Icon, label, color, bgColor, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.habitCardScroll} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.habitIconContainer, { backgroundColor: bgColor }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.habitText}>{label}</Text>
    </TouchableOpacity>
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
