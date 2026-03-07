import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { THEME } from '../../src/theme';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const {
    activeJobs,
    availableJobs,
    fetchActiveJobs,
    fetchAvailableJobs,
    fetchEarnings,
    periodEarnings,
    totalJobs,
    availableJobsLoading,
  } = useServiceStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchEarnings(7);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchActiveJobs(),
      fetchAvailableJobs(),
      fetchEarnings(7),
    ]);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Genie'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="notifications" size={24} color={THEME.text} />
          </TouchableOpacity>
        </View>

        {/* Active Jobs Banner */}
        {activeJobs.length > 0 ? (
          <TouchableOpacity
            style={styles.activeJobBanner}
            onPress={() => router.push('/active-job')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={THEME.gradientSecondary as any}
              style={styles.bannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.bannerContent}>
                <Ionicons name="flash" size={28} color="white" />
                <View style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>Active Job</Text>
                  <Text style={styles.bannerSubtitle}>
                    {activeJobs[0].service_type.charAt(0).toUpperCase() +
                      activeJobs[0].service_type.slice(1)}{' '}
                    - {activeJobs[0].status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.noActiveJob}>
            <Ionicons name="checkmark-circle" size={24} color={THEME.success} />
            <Text style={styles.noActiveJobText}>No active jobs</Text>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${periodEarnings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalJobs}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.ratingContainer}>
              <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '5.0'}</Text>
              <Ionicons name="star" size={16} color={THEME.warning} />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/jobs')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: THEME.primary + '20' }]}>
              <Ionicons name="briefcase" size={24} color={THEME.primary} />
            </View>
            <Text style={styles.quickActionText}>Find Jobs</Text>
            <View style={styles.quickActionBadge}>
              <Text style={styles.quickActionBadgeText}>{availableJobs.length}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/my-earnings')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: THEME.success + '20' }]}>
              <Ionicons name="wallet" size={24} color={THEME.success} />
            </View>
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/my-ratings')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: THEME.warning + '20' }]}>
              <Ionicons name="star" size={24} color={THEME.warning} />
            </View>
            <Text style={styles.quickActionText}>Ratings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push('/profile')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: THEME.secondary + '20' }]}>
              <Ionicons name="settings" size={24} color={THEME.secondary} />
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Available Jobs Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/jobs')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {availableJobs.length > 0 ? (
          availableJobs.slice(0, 3).map((job) => (
            <TouchableOpacity
              key={job.job_id}
              style={styles.jobPreview}
              onPress={() => {
                useServiceStore.getState().setSelectedJob(job);
                router.push('/job-details');
              }}
            >
              <View style={styles.jobPreviewLeft}>
                <Text style={styles.jobPreviewType}>
                  {job.service_type.charAt(0).toUpperCase() + job.service_type.slice(1)}
                </Text>
                <Text style={styles.jobPreviewDesc} numberOfLines={1}>
                  {job.description}
                </Text>
              </View>
              <View style={styles.jobPreviewRight}>
                <Text style={styles.jobPreviewPay}>${job.estimated_pay.toFixed(0)}</Text>
                <Text style={styles.jobPreviewDistance}>{job.distance_km} km</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color={THEME.textMuted} />
            <Text style={styles.emptyStateText}>No jobs available right now</Text>
            <Text style={styles.emptyStateSubtext}>Pull down to refresh</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  greeting: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadow.small,
  },
  activeJobBanner: {
    borderRadius: THEME.borderRadius.large,
    overflow: 'hidden',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.medium,
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.md,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  bannerText: {
    marginLeft: THEME.spacing.xs,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  noActiveJob: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.success + '15',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  noActiveJobText: {
    fontSize: 14,
    color: THEME.success,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    alignItems: 'center',
    ...THEME.shadow.small,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  seeAll: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  quickAction: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    ...THEME.shadow.small,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
    flex: 1,
  },
  quickActionBadge: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  quickActionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  jobPreview: {
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.small,
  },
  jobPreviewLeft: {
    flex: 1,
  },
  jobPreviewType: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },
  jobPreviewDesc: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  jobPreviewRight: {
    alignItems: 'flex-end',
  },
  jobPreviewPay: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.primary,
  },
  jobPreviewDistance: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: THEME.textSecondary,
    marginTop: THEME.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: THEME.spacing.xs,
  },
});
