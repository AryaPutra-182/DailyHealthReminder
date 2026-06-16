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
  Dimensions,
  Image,
} from "react-native";
import { RefreshCw } from "lucide-react-native";
import theme from "../../assets/theme";
import { getStandings } from "../services/footballService";

const { width } = Dimensions.get("window");

// ── Liga yang didukung ─────────────────────────────────────
const LEAGUES = [
  { name: "Premier League", short: "EPL",    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#7B2FBE" },
  { name: "La Liga",        short: "LAL",    emoji: "🇪🇸",  color: "#EE3024" },
  { name: "Serie A",        short: "SA",     emoji: "🇮🇹",  color: "#00ACED" },
  { name: "Bundesliga",     short: "BUN",    emoji: "🇩🇪",  color: "#D20515" },
  { name: "Champions League", short: "UCL", emoji: "⭐",    color: "#0A1172" },
  { name: "Piala Dunia",    short: "WC",     emoji: "🏆",   color: "#C0922F" },
];

// 3 chip per baris → lebar tiap chip
const CHIP_GAP    = 10;
const SIDE_PAD    = 20;
const CHIP_WIDTH  = (width - SIDE_PAD * 2 - CHIP_GAP * 2) / 3;

// ── Warna form ─────────────────────────────────────────────
const FORM_CFG = {
  W: { bg: "#2ECC71", text: "#fff", label: "M" },
  D: { bg: "#F5A623", text: "#fff", label: "S" },
  L: { bg: "#FF4C4C", text: "#fff", label: "K" },
};

// Warna zona
function zoneColor(pos, total) {
  if (pos <= 4)                    return "#2ECC71";
  if (pos <= 6)                    return "#F5A623";
  if (pos >= total - 2 && total > 8) return "#FF4C4C";
  return theme.colors.border;
}

// Warna avatar unik per nama tim (hash sederhana)
function getTeamColor(name) {
  const palette = ["#E74C3C","#3498DB","#2ECC71","#9B59B6","#F39C12","#1ABC9C","#E67E22","#2980B9","#C0922F","#16A085"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

// Ambil 2 huruf inisial nama tim
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}


// ── Screen ────────────────────────────────────────────────
export default function StandingsScreen() {
  const [active, setActive]         = useState("Premier League");
  const [cache, setCache]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(null);

  const wrapFade  = useRef(new Animated.Value(0)).current;
  const wrapSlide = useRef(new Animated.Value(20)).current;
  const bodyFade  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(wrapFade,  { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(wrapSlide, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
    doFetch("Premier League");
  }, []);

  const doFetch = useCallback(async (league, isRefresh = false) => {
    if (!isRefresh && cache[league]) {
      setActive(league);
      flashBody();
      return;
    }
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await getStandings(league);
      setCache(prev => ({ ...prev, [league]: data }));
      setActive(league);
    } catch {
      setError("Gagal memuat data. Tarik untuk mencoba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cache]);

  const flashBody = () => {
    Animated.sequence([
      Animated.timing(bodyFade, { toValue: 0, duration: 80,  useNativeDriver: true }),
      Animated.timing(bodyFade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = (league) => { flashBody(); doFetch(league); };

  const data       = cache[active] || [];
  const activeInfo = LEAGUES.find(l => l.name === active) || LEAGUES[0];

  return (
    <Animated.View style={[s.root, { opacity: wrapFade, transform: [{ translateY: wrapSlide }] }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.title}>Klasemen</Text>
        <Text style={s.subtitle}>Tabel Klasemen Liga</Text>
      </View>

      {/* ── Grid Liga – 3 kolom simetris ── */}
      <View style={s.grid}>
        {LEAGUES.map((lg) => {
          const isOn = active === lg.name;
          return (
            <TouchableOpacity
              key={lg.name}
              onPress={() => handleSelect(lg.name)}
              activeOpacity={0.7}
              style={[
                s.chip,
                isOn && { backgroundColor: lg.color + "20", borderColor: lg.color },
              ]}
            >
              <Text style={s.chipEmoji}>{lg.emoji}</Text>
              <Text
                style={[s.chipLabel, isOn && { color: lg.color, fontFamily: "Poppins-SemiBold" }]}
                numberOfLines={1}
              >
                {lg.short}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Loading ── */}
      {loading && (
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loadingTxt}>Memuat klasemen...</Text>
        </View>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <View style={s.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
          <Text style={s.errTitle}>Gagal Memuat</Text>
          <Text style={s.errMsg}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => doFetch(active, true)}>
            <RefreshCw size={14} color="#fff" />
            <Text style={s.retryTxt}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Tabel ── */}
      {!loading && !error && (
        <Animated.ScrollView
          style={{ flex: 1, opacity: bodyFade }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.tableWrap}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => doFetch(active, true)}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* Nama liga aktif */}
          <View style={[s.leagueBar, { borderLeftColor: activeInfo.color }]}>
            <Text style={s.leagueBarEmoji}>{activeInfo.emoji}</Text>
            <Text style={[s.leagueBarName, { color: activeInfo.color }]}>{activeInfo.name}</Text>
          </View>

          {/* Header kolom */}
          <View style={s.colHeader}>
            <Text style={[s.ch, s.chPos]}>#</Text>
            <Text style={[s.ch, s.chTeam]}>Tim</Text>
            <Text style={s.ch}>M</Text>
            <Text style={s.ch}>W</Text>
            <Text style={s.ch}>D</Text>
            <Text style={s.ch}>L</Text>
            <Text style={s.ch}>GD</Text>
            <Text style={[s.ch, { color: activeInfo.color }]}>Pts</Text>
          </View>

          {/* Baris tim */}
          {data.map((row, i) => {
            const isNewGroup = i === 0 || data[i - 1].group !== row.group;
            return (
              <React.Fragment key={`${active}-${row.pos}-${row.team}`}>
                {row.group && isNewGroup && (
                  <View style={s.groupHeader}>
                    <Text style={s.groupHeaderText}>{row.group}</Text>
                  </View>
                )}
                <TeamRow
                  row={row}
                  index={i}
                  total={row.group ? 4 : data.length}
                  leagueColor={activeInfo.color}
                />
              </React.Fragment>
            );
          })}

          {data.length === 0 && (
            <Text style={{ textAlign: "center", color: theme.colors.textSecondary, marginTop: 40, fontFamily: "Poppins-Regular" }}>
              Tidak ada data
            </Text>
          )}

          {/* Legenda */}
          <View style={s.legend}>
            <LegRow color="#2ECC71" label="Zona Promosi / UCL" />
            <LegRow color="#F5A623" label="Zona Europa League" />
            <LegRow color="#FF4C4C" label="Zona Degradasi" />
          </View>

          <View style={{ height: 28 }} />
        </Animated.ScrollView>
      )}
    </Animated.View>
  );
}

// ── Baris tim ──────────────────────────────────────────────
function TeamRow({ row, index, total, leagueColor }) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start();
    }, index * 30);
  }, []);

  const zc    = zoneColor(row.pos, total);
  const isRel = row.pos >= total - 2 && total > 8;
  const teamColor = getTeamColor(row.team);

  return (
    <Animated.View style={[s.row, { opacity: fade, transform: [{ translateY: slide }] }]}>
      {/* stripe kiri zona */}
      <View style={[s.stripe, { backgroundColor: zc }]} />

      {/* Pos */}
      <Text style={[s.pos, { color: zc === theme.colors.border ? theme.colors.textSecondary : zc }]}>
        {row.pos}
      </Text>

      {/* Logo/Bendera atau fallback inisial */}
      <View style={[s.logoBox, { backgroundColor: teamColor + "20" }]}>
        {row.crest && !imgError ? (
          <Image
            source={{ uri: row.crest }}
            style={s.logoImg}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={[s.logoInitials, { color: teamColor }]}>{getInitials(row.team)}</Text>
        )}
      </View>

      {/* Nama + grup (WC) */}
      <View style={s.teamNameWrap}>
        <Text style={[s.teamName, isRel && { color: "#FF4C4C" }]} numberOfLines={1}>
          {row.team}
        </Text>
        {row.group ? (
          <Text style={s.groupLabel}>{row.group}</Text>
        ) : null}
      </View>

      {/* Stats */}
      <Text style={s.stat}>{row.mp}</Text>
      <Text style={s.stat}>{row.w}</Text>
      <Text style={s.stat}>{row.d}</Text>
      <Text style={s.stat}>{row.l}</Text>
      <Text style={[s.stat, { color: row.gd > 0 ? "#2ECC71" : row.gd < 0 ? "#FF4C4C" : theme.colors.textSecondary }]}>
        {row.gd > 0 ? `+${row.gd}` : row.gd}
      </Text>

      {/* Poin */}
      <Text style={[s.pts, { color: leagueColor }]}>{row.pts}</Text>
    </Animated.View>
  );
}


// ── Legenda item ───────────────────────────────────────────
function LegRow({ color, label }) {
  return (
    <View style={s.legRow}>
      <View style={[s.legDot, { backgroundColor: color }]} />
      <Text style={s.legTxt}>{label}</Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 14 },
  title:  { fontSize: 28, color: theme.colors.text, fontFamily: "Poppins-Bold" },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, fontFamily: "Poppins-Regular", marginTop: 2 },

  // ── Grid 3-kolom ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SIDE_PAD,
    gap: CHIP_GAP,
    marginBottom: 16,
  },
  chip: {
    width: CHIP_WIDTH,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  chipEmoji: { fontSize: 18 },
  chipLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Medium",
  },

  // ── State ──
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingTxt: { marginTop: 14, color: theme.colors.textSecondary, fontFamily: "Poppins-Regular", fontSize: 14 },
  errTitle: { fontSize: 17, color: theme.colors.text, fontFamily: "Poppins-SemiBold", marginBottom: 6 },
  errMsg: { color: theme.colors.textSecondary, fontSize: 13, fontFamily: "Poppins-Regular", textAlign: "center", marginBottom: 18, paddingHorizontal: 32 },
  retryBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryTxt: { color: "#fff", fontFamily: "Poppins-SemiBold", fontSize: 14 },

  // ── Tabel ──
  tableWrap: { paddingHorizontal: 16 },

  leagueBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginBottom: 12,
  },
  leagueBarEmoji: { fontSize: 18 },
  leagueBarName: { fontSize: 15, fontFamily: "Poppins-Bold" },

  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ch: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-SemiBold",
    width: 26,
    textAlign: "center",
  },
  chPos:  { width: 22 },
  chTeam: { flex: 1, textAlign: "left", paddingLeft: 46 },

  // ── Row ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    marginBottom: 4,
    paddingVertical: 9,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  stripe: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  pos: {
    width: 28,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    paddingLeft: 6,
  },
  // Logo/Bendera
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    overflow: "hidden",
  },
  logoImg: {
    width: 26,
    height: 18,
    borderRadius: 3,
  },
  logoInitials: {
    fontSize: 9,
    fontFamily: "Poppins-Bold",
  },
  teamNameWrap: {
    flex: 1,
    justifyContent: "center",
  },
  teamName: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: "Poppins-Medium",
  },
  groupLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
    marginTop: 1,
  },
  groupHeader: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  groupHeaderText: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: "Poppins-Bold",
  },
  stat: {
    width: 26,
    textAlign: "center",
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: "Poppins-Regular",
  },
  pts: {
    width: 26,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },

  // ── Legenda ──
  legend: {
    marginTop: 14,
    padding: 14,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  legRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  legDot: { width: 12, height: 3, borderRadius: 2 },
  legTxt: { fontSize: 12, color: theme.colors.textSecondary, fontFamily: "Poppins-Regular" },
});
