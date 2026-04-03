import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import theme from "../../assets/theme";
import Header from "./Header";
import SectionHeader from "./SectionHeader";
import HabitCard from "./HabitCard";
import FeaturedCard from "./FeaturedCard";
import ArticleCard from "./ArticleCard";

export default function ListBlog({ userData, featuredArticle, habits, articles }) {

  return (
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
        onPress={() => console.log("Featured article pressed")}
      />

      {/* Quick Habits Section */}
      <View style={styles.section}>
        <SectionHeader 
          title="Quick Habits" 
          showSeeAll={true} 
          onPressSeeAll={() => console.log("See All Habits pressed")}
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
              onPress={() => console.log(`${habit.label} pressed`)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Article Grid Section */}
      <View style={styles.section}>
        <SectionHeader title="Latest Articles" />

        <View style={styles.grid}>
          {articles.map((article) => (
            <ArticleCard 
              key={article.id}
              title={article.title}
              image={article.image}
              category={article.category}
              readTime={article.readTime}
              onPress={() => console.log(`${article.title} pressed`)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </View>

    </ScrollView>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  }
});