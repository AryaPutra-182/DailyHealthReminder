// ============================================================
// footballService.js – Service layer untuk football-data.org API
// Endpoint: standings, jadwal pertandingan, hasil pertandingan
// ============================================================

import { FOOTBALL_API_KEY, FOOTBALL_BASE_URL, COMPETITIONS } from "../config/footballConfig";
import {
  MATCH_SCHEDULE as FALLBACK_SCHEDULE,
  STANDINGS as FALLBACK_STANDINGS,
  MATCH_RESULTS as FALLBACK_RESULTS,
} from "../data/footballData";

// ---------- Helper ----------

const HEADERS = {
  "X-Auth-Token": FOOTBALL_API_KEY,
};

/**
 * Fetch generik dengan timeout & error handling
 */
async function apiFetch(path) {
  const url = `${FOOTBALL_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      headers: HEADERS,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Format tanggal ke string YYYY-MM-DD
 */
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Tambah hari ke Date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Konversi UTC datetime ke WIB (UTC+7) dan return string jam:menit
 */
function toWIBTime(utcDateStr) {
  if (!utcDateStr) return "--:--";
  const date = new Date(utcDateStr);
  date.setHours(date.getHours() + 7); // UTC → WIB
  const h = date.getUTCHours().toString().padStart(2, "0");
  const m = date.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Format tanggal ke "DD Mon YYYY" (misal: "16 Jun 2026")
 */
function formatDisplayDate(utcDateStr) {
  if (!utcDateStr) return "";
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  const d = new Date(utcDateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Mapping nama tim → emoji (sebatas tim terkenal)
 */
const TEAM_EMOJI = {
  "Manchester City FC": "🔵",
  "Arsenal FC": "🔴",
  "Liverpool FC": "🔴",
  "Chelsea FC": "🔵",
  "Tottenham Hotspur FC": "⚪",
  "Aston Villa FC": "🟣",
  "Newcastle United FC": "⚫",
  "Manchester United FC": "🔴",
  "West Ham United FC": "🔴",
  "Brighton & Hove Albion FC": "🔵",
  "Real Madrid CF": "⚪",
  "FC Barcelona": "🔵",
  "Club Atlético de Madrid": "🔴",
  "Athletic Club": "🔴",
  "Real Sociedad de Fútbol": "🔵",
  "Villarreal CF": "🟡",
  "Real Betis Balompié": "🟢",
  "Sevilla FC": "⚪",
  "FC Internazionale Milano": "🔵",
  "AC Milan": "⚫",
  "Juventus FC": "⚪",
  "SSC Napoli": "🔵",
  "AS Roma": "🔴",
  "SS Lazio": "🔵",
  "Atalanta BC": "⚫",
  "ACF Fiorentina": "🟣",
  "FC Bayern München": "🔴",
  "Borussia Dortmund": "🟡",
  "Paris Saint-Germain FC": "🔵",
};

function getTeamEmoji(teamName) {
  return TEAM_EMOJI[teamName] || "⚽";
}

/**
 * Mapping kompetisi → warna badge
 */
const LEAGUE_COLORS = {
  PL:  "#3D195B",
  PD:  "#EE3024",
  SA:  "#00ACED",
  BL1: "#D20515",
  CL:  "#0A1172",
};

// ============================================================
// 1. KLASEMEN (Standings)
// ============================================================

/**
 * Mengambil klasemen satu kompetisi dari football-data.org
 * Khusus "Piala Dunia" → menggunakan ESPN API (gratis, tanpa auth)
 * @param {string} leagueName - key dari COMPETITIONS ("Premier League", dll)
 * @returns {Promise<Array>} array baris klasemen yang sudah dinormalisasi
 */
export async function getStandings(leagueName) {
  // World Cup menggunakan ESPN API (football-data.org free tier: 403)
  if (leagueName === "Piala Dunia") {
    return getWorldCupStandings();
  }

  const code = COMPETITIONS[leagueName];
  if (!code) throw new Error(`Liga tidak dikenal: ${leagueName}`);

  try {
    const data = await apiFetch(`/competitions/${code}/standings`);

    // API mengembalikan array standings (kadang ada "TOTAL", "HOME", "AWAY")
    const total = data.standings?.find((s) => s.type === "TOTAL") || data.standings?.[0];
    if (!total?.table) throw new Error("Format standings tidak dikenali");

    return total.table.map((row) => ({
      pos:   row.position,
      team:  row.team.shortName || row.team.name,
      crest: row.team.crest || row.team.flag || null,   // logo club atau bendera timnas
      mp:    row.playedGames,
      w:     row.won,
      d:     row.draw,
      l:     row.lost,
      gf:    row.goalsFor,
      ga:    row.goalsAgainst,
      gd:    row.goalDifference,
      pts:   row.points,
      form:  (row.form || "")
               .split(",")
               .filter(Boolean)
               .slice(-5)
               .map((f) => f.trim()),
    }));
  } catch (err) {
    console.warn("[footballService] getStandings fallback:", err.message);
    // Fallback ke data dummy
    return FALLBACK_STANDINGS[leagueName] || [];
  }
}

/**
 * Mengambil klasemen Piala Dunia dari ESPN API
 * ESPN API → gratis, tanpa API key, mendukung WC 2026 live
 * Semua grup digabung dan diurutkan berdasarkan poin
 */
async function getWorldCupStandings() {
  const ESPN_URL =
    "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(ESPN_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`ESPN HTTP ${response.status}`);

    const data = await response.json();

    // ESPN mengembalikan data dalam "groups" (Group A, B, C, ...)
    const groups = data.groups || data.children || [];
    if (groups.length === 0) throw new Error("Tidak ada grup WC");

    const allTeams = [];

    groups.forEach((group) => {
      // Tiap grup bisa punya sub-structure yang berbeda
      const entries =
        group.standings?.entries ||
        group.children?.[0]?.standings?.entries ||
        [];

      entries.forEach((entry) => {
        const stats = entry.stats || [];
        const getStat = (name) =>
          stats.find((s) => s.name === name || s.shortDisplayName === name)
            ?.value ?? 0;

        const gf  = getStat("pointsFor")    || getStat("GF") || 0;
        const ga  = getStat("pointsAgainst")|| getStat("GA") || 0;
        const pts = getStat("points")       || getStat("PTS")|| 0;
        const mp  = getStat("gamesPlayed")  || getStat("GP") || 0;
        const w   = getStat("wins")         || getStat("W")  || 0;
        const d   = getStat("ties")         || getStat("T")  || getStat("D") || 0;
        const l   = getStat("losses")       || getStat("L")  || 0;

        // Logo tim dari ESPN
        const logos = entry.team?.logos || [];
        const crest =
          logos.find((lg) => lg.width <= 80)?.href ||
          logos[0]?.href ||
          entry.team?.logo ||
          null;

        allTeams.push({
          pos:   0,   // akan diisi setelah sorting
          team:  entry.team?.shortDisplayName || entry.team?.displayName || entry.team?.name || "?",
          crest,
          group: group.name || group.abbreviation || "",
          mp,
          w,
          d,
          l,
          gf,
          ga,
          gd: gf - ga,
          pts,
          form: [],
        });
      });
    });

    if (allTeams.length === 0) throw new Error("Data tim kosong");

    // Urutkan: Group → Pts → GD → GF
    allTeams.sort((a, b) => {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return b.pts - a.pts || b.gd - a.gd || b.gf - a.gf;
    });
    
    // Perbarui posisi (reset per grup)
    let currentGroup = "";
    let currentPos = 1;
    allTeams.forEach((t) => {
      if (t.group !== currentGroup) {
        currentGroup = t.group;
        currentPos = 1;
      }
      t.pos = currentPos++;
    });

    return allTeams;
  } catch (err) {
    clearTimeout(timeout);
    console.warn("[footballService] getWorldCupStandings fallback:", err.message);
    return FALLBACK_STANDINGS["Piala Dunia"] || [];
  }
}

/**
 * Mengambil jadwal/hasil Piala Dunia dari ESPN API (Gratis, No-Auth)
 */
async function getWorldCupMatches(dateFrom, dateTo) {
  const dFrom = formatDate(dateFrom).replace(/-/g, "");
  const dTo = formatDate(dateTo).replace(/-/g, "");
  const ESPN_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${dFrom}-${dTo}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(ESPN_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = await res.json();
    const events = data.events || [];

    return events.map((evt) => {
      const match = evt.competitions[0];
      const home = match.competitors.find((c) => c.homeAway === "home");
      const away = match.competitors.find((c) => c.homeAway === "away");

      const isFinished = evt.status.type.completed;
      const scoreHome = home?.score ? parseInt(home.score, 10) : 0;
      const scoreAway = away?.score ? parseInt(away.score, 10) : 0;

      return {
        id: evt.id,
        _utcDate: evt.date,
        date: formatDisplayDate(evt.date),
        league: "Piala Dunia",
        leagueShort: "WC",
        leagueColor: "#C0922F",
        homeTeam: home?.team?.shortDisplayName || home?.team?.name || "TBD",
        homeShort: home?.team?.abbreviation || "?",
        homeCrest: home?.team?.logo || `https://flagcdn.com/w40/${(home?.team?.abbreviation || "").toLowerCase()}.png`,
        homeScore: scoreHome,
        awayTeam: away?.team?.shortDisplayName || away?.team?.name || "TBD",
        awayShort: away?.team?.abbreviation || "?",
        awayCrest: away?.team?.logo || `https://flagcdn.com/w40/${(away?.team?.abbreviation || "").toLowerCase()}.png`,
        awayScore: scoreAway,
        time: toWIBTime(evt.date),
        venue: match.venue?.fullName || "-",
        status: isFinished ? "FT" : "upcoming",
        scorers: [], 
      };
    });
  } catch (err) {
    clearTimeout(timeout);
    return [];
  }
}


// ============================================================
// 2. JADWAL PERTANDINGAN (Scheduled Matches)
// ============================================================

/**
 * Mengambil pertandingan terjadwal untuk semua liga dalam rentang tanggal
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {Promise<Array>} array pertandingan yang sudah dinormalisasi
 */
export async function getScheduledMatches(dateFrom, dateTo) {
  const from = formatDate(dateFrom);
  const to = formatDate(dateTo);

  try {
    // Gabungkan kode kompetisi (kecuali WC karena tidak ada di free tier)
    const codes = Object.values(COMPETITIONS).filter(c => c !== "WC").join(",");
    
    // Fetch 1 request untuk semua liga sekaligus → Hindari 429 Too Many Requests
    const data = await apiFetch(`/matches?competitions=${codes}&status=SCHEDULED&dateFrom=${from}&dateTo=${to}`);
    const matches = data.matches || [];
    
    const allMatches = matches.map((m) => normalizeMatch(m, m.competition?.code));

    // Fetch dari ESPN khusus untuk Piala Dunia
    const wcMatches = await getWorldCupMatches(dateFrom, dateTo);
    allMatches.push(...wcMatches.filter((m) => m.status === "upcoming"));

    // Urutkan berdasarkan waktu
    allMatches.sort((a, b) => new Date(a._utcDate) - new Date(b._utcDate));
    return allMatches;
  } catch (err) {
    console.warn("[footballService] getScheduledMatches fallback:", err.message);
    return FALLBACK_SCHEDULE || [];
  }
}

// ============================================================
// 3. HASIL PERTANDINGAN (Finished Matches)
// ============================================================

/**
 * Mengambil hasil pertandingan selesai (7 hari ke belakang)
 * @returns {Promise<Array>} array hasil pertandingan yang sudah dinormalisasi
 */
export async function getFinishedMatches() {
  const today = new Date();
  const from = formatDate(addDays(today, -7));
  const to = formatDate(today);

  try {
    const codes = Object.values(COMPETITIONS).filter(c => c !== "WC").join(",");
    
    // Fetch 1 request untuk semua liga sekaligus
    const data = await apiFetch(`/matches?competitions=${codes}&status=FINISHED&dateFrom=${from}&dateTo=${to}`);
    const matches = data.matches || [];

    const allMatches = matches.map((m) => normalizeFinishedMatch(m, m.competition?.code));

    // Fetch dari ESPN khusus untuk Piala Dunia (7 hari ke belakang)
    const wcMatches = await getWorldCupMatches(addDays(today, -7), today);
    allMatches.push(...wcMatches.filter((m) => m.status === "FT"));

    // Urutkan dari terbaru
    allMatches.sort((a, b) => new Date(b._utcDate) - new Date(a._utcDate));
    return allMatches;
  } catch (err) {
    console.warn("[footballService] getFinishedMatches fallback:", err.message);
    return FALLBACK_RESULTS;
  }
}

// ============================================================
// Normalisasi data dari API → format internal app
// ============================================================

function normalizeMatch(m, competitionCode) {
  const leagueName = Object.keys(COMPETITIONS).find(
    (k) => COMPETITIONS[k] === competitionCode
  ) || competitionCode;

  return {
    id:            m.id,
    _utcDate:      m.utcDate,
    date:          formatDate(new Date(m.utcDate)),           // YYYY-MM-DD
    displayDate:   formatDisplayDate(m.utcDate),
    league:        leagueName,
    leagueShort:   competitionCode,
    leagueColor:   LEAGUE_COLORS[competitionCode] || "#555",
    homeTeam:      m.homeTeam?.name || "TBD",
    homeShort:     m.homeTeam?.shortName || m.homeTeam?.tla || "?",
    homeEmoji:     getTeamEmoji(m.homeTeam?.name || ""),
    homeCrest:     m.homeTeam?.crest || m.homeTeam?.flag || null,
    awayTeam:      m.awayTeam?.name || "TBD",
    awayShort:     m.awayTeam?.shortName || m.awayTeam?.tla || "?",
    awayEmoji:     getTeamEmoji(m.awayTeam?.name || ""),
    awayCrest:     m.awayTeam?.crest || m.awayTeam?.flag || null,
    time:          toWIBTime(m.utcDate),
    venue:         m.homeTeam?.venue || "-",
    status:        "upcoming",
  };
}

function normalizeFinishedMatch(m, competitionCode) {
  const base = normalizeMatch(m, competitionCode);
  const home = m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? 0;
  const away = m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? 0;

  return {
    ...base,
    homeScore: home,
    awayScore: away,
    date:      formatDisplayDate(m.utcDate),
    status:    "FT",
    scorers:   [], // API free tier tidak menyediakan pencetak gol per pertandingan
  };
}
