import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { MapPin, Clock, RefreshCw } from "lucide-react-native";
import theme from "../../assets/theme";
import { getScheduledMatches } from "../services/footballService";

const TABS = [
  { key: "today",    label: "Hari Ini" },
  { key: "tomorrow", label: "Besok" },
  { key: "thisweek", label: "Minggu Ini" },
];

function getDateRange(tabKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (tabKey === "today") {
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { from: today, to: end };
  }
  if (tabKey === "tomorrow") {
    const from = new Date(today);
    from.setDate(from.getDate() + 1);
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }
  // thisweek: 7 hari ke depan
  const to = new Date(today);
  to.setDate(to.getDate() + 7);
  return { from: today, to };
}

// Screen MatchScheduleScreen: Menampilkan jadwal pertandingan dari API
export default function MatchScheduleScreen() {
  const [activeTab, setActiveTab]   = useState("today");
  const [allMatches, setAllMatches] = useState({});   // { today: [], tomorrow: [], thisweek: [] }
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const tabFade = useRef(new Animated.Value(1)).current;

  const fetchSchedules = useCallback(async (tabKey, isRefresh = false) => {
    try {
      if (!isRefresh && allMatches[tabKey]) return; // use cache if exists
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const { from, to } = getDateRange(tabKey);
      const matches = await getScheduledMatches(from, to);

      setAllMatches((prev) => ({ ...prev, [tabKey]: matches }));
    } catch (err) {
      setError("Gagal memuat jadwal. Tarik ke bawah untuk mencoba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [allMatches]);

  const handleTabChange = (key) => {
    Animated.sequence([
      Animated.timing(tabFade, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(tabFade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setActiveTab(key);
    fetchSchedules(key);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
    fetchSchedules("today");
  }, []);


  const filtered = allMatches[activeTab] || [];

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Jadwal</Text>
        <Text style={styles.subtitle}>Pertandingan Sepak Bola</Text>
      </View>

      {/* Tab filter */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => handleTabChange(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Memuat jadwal dari API...</Text>
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View style={styles.centerState}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Gagal Memuat</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchSchedules(activeTab, true)}>
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Daftar pertandingan */}
      {!loading && !error && (
        <Animated.ScrollView
          style={[styles.scroll, { opacity: tabFade }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchSchedules(activeTab, true)}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>Tidak Ada Jadwal</Text>
              <Text style={styles.emptyText}>Belum ada pertandingan untuk periode ini</Text>
            </View>
          ) : (
            filtered.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))
          )}
          <View style={{ height: 30 }} />
        </Animated.ScrollView>
      )}
    </Animated.View>
  );
}

// Komponen card jadwal pertandingan
export function MatchCard({ match, index }) {
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }, index * 40);
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
      {/* Badge liga */}
      <View style={[styles.leagueBadge, { backgroundColor: match.leagueColor + "30" }]}>
        <View style={[styles.leagueDot, { backgroundColor: match.leagueColor }]} />
        <Text style={[styles.leagueName, { color: match.leagueColor }]}>{match.league}</Text>
      </View>

      {/* Match info */}
      <View style={styles.matchRow}>
        {/* Tim tuan rumah */}
        <View style={styles.teamBlock}>
          {match.homeCrest ? (
            <Image source={{ uri: match.homeCrest }} style={styles.teamLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.teamEmoji}>{match.homeEmoji}</Text>
          )}
          <Text style={styles.teamName} numberOfLines={2}>{match.homeTeam}</Text>
          <Text style={styles.teamShort}>{match.homeShort}</Text>
        </View>

        {/* Vs + waktu */}
        <View style={styles.vsBlock}>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.timeChip}>
            <Clock size={11} color={theme.colors.accent} />
            <Text style={styles.timeText}>{match.time} WIB</Text>
          </View>
        </View>

        {/* Tim tamu */}
        <View style={styles.teamBlock}>
          {match.awayCrest ? (
            <Image source={{ uri: match.awayCrest }} style={styles.teamLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.teamEmoji}>{match.awayEmoji}</Text>
          )}
          <Text style={styles.teamName} numberOfLines={2}>{match.awayTeam}</Text>
          <Text style={styles.teamShort}>{match.awayShort}</Text>
        </View>
      </View>

      {/* Venue */}
      {match.venue && match.venue !== "-" && (
        <View style={styles.venueRow}>
          <MapPin size={12} color={theme.colors.textSecondary} />
          <Text style={styles.venueText}>{match.venue}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 18,
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: "center",
  },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Medium",
  },
  tabTextActive: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 4 },

  // Loading / Error
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 14,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  errorEmoji: { fontSize: 44, marginBottom: 12 },
  errorTitle: {
    fontSize: 17,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },

  // Match card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leagueBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
    gap: 6,
  },
  leagueDot: { width: 7, height: 7, borderRadius: 3.5 },
  leagueName: { fontSize: 11, fontFamily: "Poppins-SemiBold" },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  teamBlock: { flex: 1, alignItems: "center", gap: 4 },
  teamEmoji: { fontSize: 32 },
  teamLogo: {
    width: 32,
    height: 32,
    marginBottom: 2,
  },
  teamName: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    lineHeight: 18,
  },
  teamShort: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  vsBlock: { alignItems: "center", gap: 8, paddingHorizontal: 10 },
  vsText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Bold",
    letterSpacing: 1,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(245, 166, 35, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(245, 166, 35, 0.25)",
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.accent,
    fontFamily: "Poppins-SemiBold",
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  venueText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    textAlign: "center",
  },
});
