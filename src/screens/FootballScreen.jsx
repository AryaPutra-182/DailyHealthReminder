import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Calendar, Trophy, Flag } from "lucide-react-native";
import theme from "../../assets/theme";
import MatchScheduleScreen from "./MatchScheduleScreen";
import StandingsScreen from "./StandingsScreen";
import ResultsScreen from "./ResultsScreen";

const TABS = [
  { key: "schedule", label: "Jadwal", Icon: Calendar },
  { key: "standings", label: "Klasemen", Icon: Trophy },
  { key: "results", label: "Hasil", Icon: Flag },
];

// Screen FootballScreen: Wrapper dengan top tab untuk Jadwal, Klasemen, Hasil
export default function FootballScreen() {
  const [activeTab, setActiveTab] = useState("schedule");
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const tabIndexMap = { schedule: 0, standings: 1, results: 2 };

  const handleTabChange = (key) => {
    const toIndex = tabIndexMap[key];
    Animated.spring(indicatorAnim, {
      toValue: toIndex,
      tension: 120,
      friction: 10,
      useNativeDriver: false,
    }).start();
    setActiveTab(key);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "schedule":
        return <MatchScheduleScreen />;
      case "standings":
        return <StandingsScreen />;
      case "results":
        return <ResultsScreen />;
      default:
        return <MatchScheduleScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Tab Bar */}
      <View style={styles.topTabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.topTab}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <tab.Icon
                size={18}
                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <Text style={[styles.topTabText, isActive && styles.topTabTextActive]}>
                {tab.label}
              </Text>
              {/* Indikator aktif */}
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Konten layar aktif */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Top tab bar
  topTabBar: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 8,
  },
  topTab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    gap: 4,
    position: "relative",
  },
  topTabText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  topTabTextActive: {
    color: theme.colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  screenContainer: {
    flex: 1,
  },
});
