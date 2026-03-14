import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import theme from "../../assets/theme";
import { Clock, Droplets, Activity, Flame, ChevronRight } from "lucide-react-native";

export default function ListBlog() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Winden</Text>
          <Text style={styles.subtitle}>Daily Health Reminder</Text>
        </View>
        
        {/* Profile Avatar Placeholder */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }} 
            style={styles.avatar}
          />
        </View>
      </View>


      {/* Featured Article */}
      <View style={styles.featureCardContainer}>
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            style={styles.featureImage}
            imageStyle={{ borderRadius: 24 }}
            source={{
              uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
            }}
          >
            {/* Dark Gradient Overlay Equivalent */}
            <View style={styles.featureOverlay}>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.featureTitle}>
                10 Minute Daily Exercise For Beginners
              </Text>
              <View style={styles.featureMeta}>
                <Clock size={14} color="#E0E0E0" />
                <Text style={styles.featureMetaText}>5 min read</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>


      {/* Quick Habits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Habits</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitRowScroll}
        >
          <TouchableOpacity style={styles.habitCardScroll} activeOpacity={0.8}>
            <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(0, 194, 168, 0.15)' }]}>
              <Droplets size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.habitText}>Water</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.habitCardScroll} activeOpacity={0.8}>
            <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
              <Activity size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.habitText}>Stretch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.habitCardScroll} activeOpacity={0.8}>
            <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(255, 76, 76, 0.15)' }]}>
              <Flame size={24} color={theme.colors.danger} />
            </View>
            <Text style={styles.habitText}>Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.habitCardScroll} activeOpacity={0.8}>
            <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(66, 135, 245, 0.15)' }]}>
              <Clock size={24} color="#4287f5" />
            </View>
            <Text style={styles.habitText}>Sleep</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.habitCardScroll} activeOpacity={0.8}>
            <View style={[styles.habitIconContainer, { backgroundColor: 'rgba(245, 173, 66, 0.15)' }]}>
              <Activity size={24} color="#f5ad42" />
            </View>
            <Text style={styles.habitText}>Meditate</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>


      {/* Article Grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Articles</Text>
        </View>

        <View style={styles.grid}>

          {/* Card 1 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>NUTRITION</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Healthy Food Guide For You</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>5 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>DIET</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Boost Your Energy Levels</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>6 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>FITNESS</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Home Workout Routine Basics</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>7 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>HEALTH</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Secret To Better Sleep</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>4 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 5 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1532099515082-9dbcc5e25a2a" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>MINDSET</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Daily Meditation Practice</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>5 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 6 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1552674605-15c370425cc0" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>WELLNESS</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Stay Hydrated All Day</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>3 min</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Card 7 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1517618957861-125fc7333671" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>RECOVERY</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Post-Workout Stretching</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>6 min</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Card 8 */}
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
            <Image
              style={styles.gridImage}
              source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" }}
            />
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCategory}>NUTRITION</Text>
              <Text style={styles.gridTitle} numberOfLines={2}>Healthy Snack Ideas</Text>
              
              <View style={styles.gridInfo}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.gridText}>4 min</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },

  /* -- Header -- */
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.border,
    padding: 2,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },

  /* -- Main Featured Card -- */
  featureCardContainer: {
    paddingHorizontal: 24,
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  featureImage: {
    height: 220,
    width: "100%",
  },
  featureOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.45)", 
  },
  featureBadge: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  featureBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    lineHeight: 28,
  },
  featureMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureMetaText: {
    color: "#E0E0E0",
    fontSize: 12,
    fontWeight: "500",
  },

  /* -- Generic Section Styles -- */
  section: {
    marginBottom: 35,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    // When there's no right element, still need standard padding if we don't use sectionHeader
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  /* -- Quick Habits Row -- */
  habitRowScroll: {
    paddingHorizontal: 24,
    gap: 15,
  },
  habitCardScroll: {
    backgroundColor: theme.colors.card,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    width: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  habitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  habitText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  /* -- Article Grid -- */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  gridCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  gridImage: {
    width: "100%",
    height: 120,
  },
  gridCardContent: {
    padding: 14,
  },
  gridCategory: {
    color: theme.colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  gridTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 10,
    height: 40, // fix height so 1-line and 2-line text don't break layout
  },
  gridInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  gridText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});