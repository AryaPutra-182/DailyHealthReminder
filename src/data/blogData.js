import { CalendarClock, ListOrdered, CheckCircle, Flame } from "lucide-react-native";
import theme from "../../assets/theme";

// Featured article default (berita bola terbaru)
export const INITIAL_FEATURED_ARTICLE = {
  title: "Haaland Hat-trick Bawa City Raih Gelar Premier League",
  image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
  readTime: "4 min",
  badgeText: "TERBARU"
};

// Quick action cards di Home – akses cepat fitur bola
export const INITIAL_HABITS = [
  {
    id: 1,
    label: "Jadwal",
    Icon: CalendarClock,
    color: theme.colors.primary,
    bgColor: "rgba(255, 215, 0, 0.15)", // #FFD700
    screen: "Bola",
  },
  {
    id: 2,
    label: "Klasemen",
    Icon: ListOrdered,
    color: theme.colors.secondary,
    bgColor: "rgba(245, 166, 35, 0.15)", // #F5A623
    screen: "Bola",
  },
  {
    id: 3,
    label: "Hasil",
    Icon: CheckCircle,
    color: theme.colors.danger,
    bgColor: "rgba(255, 76, 76, 0.15)", // #FF4C4C
    screen: "Bola",
  },
  {
    id: 4,
    label: "Berita",
    Icon: Flame,
    color: "#4287f5",
    bgColor: "rgba(66, 135, 245, 0.15)", // #4287f5
    screen: "Discover",
  },
];

export const INITIAL_ARTICLES = [
  {
    id: 1,
    category: "PREMIER LEAGUE",
    title: "Haaland Cetak Rekor Gol Terbanyak Sepanjang Masa",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    readTime: "5 min"
  },
  {
    id: 2,
    category: "LA LIGA",
    title: "El Clasico Berakhir Dramatis 2-2 di Bernabeu",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    readTime: "4 min"
  },
  {
    id: 3,
    category: "TRANSFER",
    title: "Rumor Transfer Musim Panas: Pemain-pemain yang Diprediksi Pindah",
    image: "https://images.unsplash.com/photo-1551958219-acbc76ae29d5",
    readTime: "6 min"
  },
  {
    id: 4,
    category: "CHAMPIONS LEAGUE",
    title: "Preview Semifinal UCL: Prediksi dan Statistik",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    readTime: "7 min"
  },
  {
    id: 5,
    category: "SERIE A",
    title: "Inter Milan Dominan di Serie A: Gelar Ke-20 Sudah di Tangan",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    readTime: "5 min"
  },
  {
    id: 6,
    category: "ANALISIS",
    title: "Taktik Pep Guardiola: Mengapa City Selalu Konsisten",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    readTime: "8 min"
  },
];
