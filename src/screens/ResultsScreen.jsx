import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { RefreshCw } from "lucide-react-native";
import theme from "../../assets/theme";
import { getFinishedMatches } from "../services/footballService";

// Screen ResultsScreen: Menampilkan hasil pertandingan terbaru dari API
export default function ResultsScreen() {
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
    fetchResults();
  }, []);

  const fetchResults = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await getFinishedMatches();
      setResults(data);
    } catch (err) {
      setError("Gagal memuat hasil pertandingan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Kelompokkan hasil berdasarkan tanggal tampilan
  const groupedByDate = results.reduce((acc, match) => {
    const key = match.date || match.displayDate || "Tanggal Tidak Diketahui";
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate);

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hasil</Text>
        <Text style={styles.subtitle}>Pertandingan Terkini (7 hari terakhir)</Text>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Memuat hasil dari API...</Text>
        </View>
      )}

      {/* Error */}
      {!loading && error && (
        <View style={styles.centerState}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Gagal Memuat</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchResults()}>
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Konten hasil */}
      {!loading && !error && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchResults(true)}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {dates.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏁</Text>
              <Text style={styles.emptyTitle}>Belum Ada Hasil</Text>
              <Text style={styles.emptyText}>Tidak ada pertandingan selesai dalam 7 hari terakhir</Text>
            </View>
          ) : (
            dates.map((date) => (
              <View key={date}>
                {/* Label tanggal */}
                <View style={styles.dateRow}>
                  <View style={styles.dateLine} />
                  <Text style={styles.dateText}>{date}</Text>
                  <View style={styles.dateLine} />
                </View>

                {/* Kartu hasil per tanggal */}
                {groupedByDate[date].map((match, index) => (
                  <ResultCard key={match.id} match={match} index={index} />
                ))}
              </View>
            ))
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </Animated.View>
  );
}

// Komponen card hasil pertandingan
function ResultCard({ match, index }) {
  const slideAnim = useRef(new Animated.Value(18)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, index * 50);
  }, []);

  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const homeWon   = homeScore > awayScore;
  const awayWon   = awayScore > homeScore;
  const draw      = homeScore === awayScore;

  return (
    <Animated.View
      style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/* Header card: badge liga + status */}
      <View style={styles.cardHeader}>
        <View style={[styles.leagueBadge, { backgroundColor: (match.leagueColor || "#555") + "25" }]}>
          <View style={[styles.leagueDot, { backgroundColor: match.leagueColor || "#555" }]} />
          <Text style={[styles.leagueName, { color: match.leagueColor || theme.colors.textSecondary }]}>
            {match.league}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{match.status}</Text>
        </View>
      </View>

      {/* Skor */}
      <View style={styles.scoreRow}>
        {/* Tim Tuan Rumah */}
        <View style={styles.teamBlock}>
          {match.homeCrest ? (
            <Image source={{ uri: match.homeCrest }} style={styles.teamLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.teamEmoji}>{match.homeEmoji}</Text>
          )}
          <Text style={[styles.teamName, homeWon && styles.teamWinner]} numberOfLines={2}>
            {match.homeTeam}
          </Text>
        </View>

        {/* Skor di tengah */}
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreHome, homeWon && styles.scoreWinner, draw && styles.scoreDraw]}>
            {homeScore}
          </Text>
          <Text style={styles.scoreDivider}>-</Text>
          <Text style={[styles.scoreAway, awayWon && styles.scoreWinner, draw && styles.scoreDraw]}>
            {awayScore}
          </Text>
        </View>

        {/* Tim Tamu */}
        <View style={styles.teamBlock}>
          {match.awayCrest ? (
            <Image source={{ uri: match.awayCrest }} style={styles.teamLogo} resizeMode="contain" />
          ) : (
            <Text style={styles.teamEmoji}>{match.awayEmoji}</Text>
          )}
          <Text style={[styles.teamName, awayWon && styles.teamWinner]} numberOfLines={2}>
            {match.awayTeam}
          </Text>
        </View>
      </View>

      {/* Pencetak gol (jika ada dari data dummy / future API) */}
      {match.scorers && match.scorers.length > 0 && (
        <View style={styles.scorerRow}>
          <Text style={styles.scorerIcon}>⚽</Text>
          <Text style={styles.scorerText} numberOfLines={2}>
            {match.scorers.join("  ·  ")}
          </Text>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
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
  // Divider tanggal
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: 4,
  },
  // Card hasil
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  leagueBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  leagueDot: { width: 7, height: 7, borderRadius: 3.5 },
  leagueName: { fontSize: 11, fontFamily: "Poppins-SemiBold" },
  statusBadge: {
    backgroundColor: "rgba(46, 204, 113, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(46, 204, 113, 0.3)",
  },
  statusText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontFamily: "Poppins-Bold",
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  teamBlock: { flex: 1, alignItems: "center", gap: 6 },
  teamEmoji: { fontSize: 30 },
  teamLogo: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    lineHeight: 17,
  },
  teamWinner: {
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreHome: {
    fontSize: 26,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Bold",
  },
  scoreAway: {
    fontSize: 26,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Bold",
  },
  scoreWinner: { color: theme.colors.primary },
  scoreDraw:   { color: theme.colors.accent },
  scoreDivider: {
    fontSize: 22,
    color: theme.colors.border,
    fontFamily: "Poppins-Bold",
  },
  scorerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  scorerIcon: { fontSize: 12, marginTop: 1 },
  scorerText: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
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
