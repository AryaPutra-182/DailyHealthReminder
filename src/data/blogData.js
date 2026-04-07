import { Droplets, Activity, Flame, Clock } from "lucide-react-native";
import theme from "../../assets/theme";

export const INITIAL_FEATURED_ARTICLE = {

  title: "10 Minute Daily Exercise For Beginners",
  image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  readTime: "5 min",
  badgeText: "FEATURED"
};

export const INITIAL_HABITS = [
  { 
    id: 1, 
    label: "Water", 
    Icon: Droplets, 
    color: theme.colors.secondary, 
    bgColor: 'rgba(0, 194, 168, 0.15)' 
  },
  { 
    id: 2, 
    label: "Stretch", 
    Icon: Activity, 
    color: theme.colors.primary, 
    bgColor: 'rgba(76, 175, 80, 0.15)' 
  },
  { 
    id: 3, 
    label: "Workout", 
    Icon: Flame, 
    color: theme.colors.danger, 
    bgColor: 'rgba(255, 76, 76, 0.15)' 
  },
  { 
    id: 4, 
    label: "Sleep", 
    Icon: Clock, 
    color: "#4287f5", 
    bgColor: 'rgba(66, 135, 245, 0.15)' 
  },
  { 
    id: 5, 
    label: "Meditate", 
    Icon: Activity, 
    color: "#f5ad42", 
    bgColor: 'rgba(245, 173, 66, 0.15)' 
  }
];

export const INITIAL_ARTICLES = [
  {
    id: 1,
    category: "NUTRITION",
    title: "Healthy Food Guide For You",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    readTime: "5 min"
  },
  {
    id: 2,
    category: "DIET",
    title: "Boost Your Energy Levels",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    readTime: "6 min"
  },
  {
    id: 3,
    category: "FITNESS",
    title: "Home Workout Routine Basics",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    readTime: "7 min"
  },
  {
    id: 4,
    category: "HEALTH",
    title: "Secret To Better Sleep",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    readTime: "4 min"
  },
  {
    id: 5,
    category: "MINDSET",
    title: "Daily Meditation Practice",
    image: "https://images.unsplash.com/photo-1532099515082-9dbcc5e25a2a",
    readTime: "5 min"
  },
  {
    id: 6,
    category: "WELLNESS",
    title: "Stay Hydrated All Day",
    image: "https://images.unsplash.com/photo-1552674605-15c370425cc0",
    readTime: "3 min"
  },
  {
    id: 7,
    category: "RECOVERY",
    title: "Post-Workout Stretching",
    image: "https://images.unsplash.com/photo-1517618957861-125fc7333671",
    readTime: "6 min"
  },
  {
    id: 8,
    category: "NUTRITION",
    title: "Healthy Snack Ideas",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    readTime: "4 min"
  },
  {
    id: 9,
    category: "TIPS",
    title: "How to Stay Healthy Without Stress",
    image: null, // Testing fallback image
    readTime: "5 min"
  }
];
