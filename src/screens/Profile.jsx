import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { User, Settings, Bell, Shield, Info, LogOut, ChevronRight, Activity, Droplets, Clock } from "lucide-react-native";
import theme from "../../assets/theme";
import { PROFILE_DATA } from "../data/profile";

export default function Profile() {
  const user = PROFILE_DATA;

  const MenuOption = ({ Icon, title, subtitle }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.card }]}>
        <Icon color={theme.colors.primary} size={22} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight color={theme.colors.border} size={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.image }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Settings color={theme.colors.text} size={20} />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user.stats.steps}</Text>
          <Text style={styles.statLabel}>Steps</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statValue}>{user.stats.water}</Text>
          <Text style={styles.statLabel}>Water</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user.stats.sleep}</Text>
          <Text style={styles.statLabel}>Sleep</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuOption Icon={Bell} title="Notifications" subtitle="Reminders, health tips" />
        <MenuOption Icon={Shield} title="Privacy & Security" subtitle="Personal info management" />
        <MenuOption Icon={Settings} title="General Settings" />
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuOption Icon={Info} title="Help Center" />
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut color={theme.colors.danger} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: 20
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    fontFamily: "Poppins-Bold"
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold"
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular"
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 8,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    paddingVertical: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    fontFamily: "Poppins-Bold"
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontFamily: "Poppins-Regular"
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
    fontFamily: "Poppins-SemiBold"
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium"
  },
  menuSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular"
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 4,
  },
  logoutText: {
    fontSize: 16,
    color: theme.colors.danger,
    marginLeft: 12,
    fontWeight: "500",
    fontFamily: "Poppins-Medium"
  }
});
