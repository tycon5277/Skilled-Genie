import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore, Rating } from '../src/stores/serviceStore';
import { THEME, SERVICE_COLORS } from '../src/theme';
import { formatIndiaDate } from '../src/utils/indiaTime';

export default function MyRatingsScreen() {
  const {
    ratings,
    totalRatings,
    averageRating,
    ratingsLoading,
    fetchRatings,
  } = useServiceStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRatings();
    setRefreshing(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={THEME.warning}
        />
      );
    }
    return stars;
  };

  const renderHeader = () => (
    <LinearGradient colors={THEME.gradientPrimary as any} style={styles.headerCard}>
      <View style={styles.ratingMain}>
        <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= Math.round(averageRating) ? 'star' : 'star-outline'}
              size={20}
              color="white"
            />
          ))}
        </View>
      </View>
      <Text style={styles.ratingCount}>{totalRatings} total ratings</Text>
    </LinearGradient>
  );

  const renderRatingItem = ({ item }: { item: Rating }) => {
    const serviceColor = SERVICE_COLORS[item.service_type] || SERVICE_COLORS.other;
    
    return (
      <View style={styles.ratingCard}>
        <View style={styles.ratingHeader}>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Ionicons name="person" size={16} color={THEME.textSecondary} />
            </View>
            <View>
              <Text style={styles.customerName}>{item.customer_name}</Text>
              <Text style={styles.serviceType}>
                {item.service_type.charAt(0).toUpperCase() + item.service_type.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.ratingStars}>
            {renderStars(item.rating)}
          </View>
        </View>
        {item.comment && (
          <Text style={styles.comment}>"{item.comment}"</Text>
        )}
        <Text style={styles.date}>
          {formatIndiaDate(item.created_at)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Ratings</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={ratings}
        keyExtractor={(item) => item.rating_id}
        renderItem={renderRatingItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          ratingsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME.primary} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={48} color={THEME.textMuted} />
              <Text style={styles.emptyText}>No ratings yet</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    backgroundColor: THEME.cardBg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
  },
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  headerCard: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.medium,
  },
  ratingMain: {
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: THEME.spacing.xs,
  },
  ratingCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  ratingCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.small,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },
  serviceType: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 14,
    color: THEME.textSecondary,
    fontStyle: 'italic',
    marginTop: THEME.spacing.md,
    lineHeight: 20,
  },
  date: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: THEME.spacing.sm,
  },
  loadingContainer: {
    padding: THEME.spacing.xxl,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.textMuted,
    marginTop: THEME.spacing.md,
  },
});
