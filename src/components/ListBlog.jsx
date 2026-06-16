import React, { useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import theme from "../../assets/theme";
import Header from "./Header";
import SectionHeader from "./SectionHeader";
import HabitCard from "./HabitCard";
import FeaturedCard from "./FeaturedCard";
import ArticleCard from "./ArticleCard";
import { MatchCard } from "../screens/MatchScheduleScreen";

// Komponen ListBlog: Menampilkan daftar artikel dan aksi cepat di halaman Home
export default function ListBlog({ userData, featuredArticle, habits, articles, todayMatches, onEdit, onDelete }) {
  // Hook untuk mengakses fungsi navigasi
  const navigation = useNavigation();

  // Animated values untuk efek fade-in dan slide-up saat mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Menjalankan animasi masuk saat komponen pertama kali di-render
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /**
   * Fungsi untuk menangani klik pada artikel
   * Berfungsi untuk berpindah ke layar BlogDetail dengan membawa data artikel
   */
  const handleArticlePress = (article) => {
    navigation.navigate("BlogDetail", {
      title: article.title,
      image: article.image_url,
      category: article.category,
      readTime: article.read_time,
      description: article.description,
    });
  };

  return (
    // Animated.View membungkus seluruh konten untuk efek fade-in + slide-up saat mount
    <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <Header 
        title={userData.name} 
        subtitle={userData.subtitle} 
        userImage={userData.image} 
      />

      {/* Featured Card */}
      <FeaturedCard 
        title={featuredArticle.title}
        image={featuredArticle.image}
        readTime={featuredArticle.readTime}
        badgeText={featuredArticle.badgeText}
        onPress={() => handleArticlePress(featuredArticle)}
      />

      {/* Akses Cepat Section */}
      <View style={styles.section}>
        <SectionHeader 
          title="Akses Cepat" 
          showSeeAll={false}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitRowScroll}
        >
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id}
              Icon={habit.Icon}
              label={habit.label}
              color={habit.color}
              bgColor={habit.bgColor}
              onPress={() => {
                if(habit.screen) navigation.navigate(habit.screen);
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Jadwal Hari Ini Section */}
      {todayMatches && todayMatches.length > 0 && (
        <View style={styles.section}>
          <SectionHeader 
            title="Jadwal Hari Ini" 
            showSeeAll={true} 
            onPressSeeAll={() => navigation.navigate("Bola")}
          />
          <View style={styles.matchList}>
            {todayMatches.map((match, index) => (
              <MatchCard key={match.id} match={match} index={index} />
            ))}
          </View>
        </View>
      )}

      {/* Berita Terkini Section */}
      <View style={styles.section}>
        <SectionHeader title="Berita Terkini" />

        <View style={styles.grid}>
          {articles.map((article) => (
            <ArticleCard 
              key={article.id}
              title={article.title}
              image={article.image_url}
              category={article.category}
              readTime={article.read_time}
              createdAt={article.created_at}
              onPress={() => handleArticlePress(article)}
              onEdit={() => onEdit(article)}
              onDelete={() => onDelete(article)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </View>

    </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10, 
    flex: 1,
    backgroundColor: theme.colors.background
  },
  section: {
    marginBottom: 35,
  },
  habitRowScroll: {
    paddingHorizontal: 24,
    gap: 15,
  },
  matchList: {
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  }
});