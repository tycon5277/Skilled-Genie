import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { skilledGenieAPI } from '../../src/api/vendorApi';
import { THEME, getSkillColor } from '../../src/theme';

export default function HomeScreen() {
  const { user, refreshProfile } = useAuthStore();
  const {
    activeJobs,
    availableJobs,
    fetchActiveJobs,
    fetchAvailableJobs,
    fetchEarnings,
    periodEarnings,
    totalJobs,
    totalEarnings,
  } = useServiceStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(user?.is_online || false);

  useEffect(() => {
    fetchEarnings(7);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchActiveJobs(),
      fetchAvailableJobs(),
      fetchEarnings(7),
      refreshProfile(),
    ]);
    setRefreshing(false);
  };

  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    try {
      await skilledGenieAPI.updateAvailability(value);
      refreshProfile();
    } catch (error) {
      setIsOnline(!value);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's skills for badges
  const userSkills = user?.skills || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Online Status Bar */}
      {isOnline && (
        <View style={styles.onlineStatusBar}>
          <View style={styles.onlineStatusDot} />
          <Text style={styles.onlineStatusText}>You are Online</Text>
          <Text style={styles.onlineStatusSubtext}>Visible to customers</Text>
        </View>
      )}

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
        {/* Header with Online Toggle */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Genie'}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.onlineToggle}>
              <Text style={[styles.onlineLabel, isOnline && styles.onlineLabelActive]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: THEME.textMuted, true: THEME.success + '50' }}
                thumbColor={isOnline ? THEME.success : THEME.backgroundSecondary}
              />
            </View>
          </View>
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingLeft}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= Math.round(user?.rating || 0) ? 'star' : 'star-outline'}
                  size={18}
                  color={THEME.warning}
                />
              ))}
            </View>
            <Text style={styles.ratingValue}>
              {user?.rating ? user.rating.toFixed(1) : 'No ratings'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.viewRatingsBtn}
            onPress={() => router.push('/my-ratings')}
          >
            <Text style={styles.viewRatingsText}>View Reviews</Text>
            <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
          </TouchableOpacity>
        </View>

        {/* Today's Earnings */}
        <View style={styles.earningsCard}>
          <LinearGradient
            colors={THEME.gradientPrimary as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.earningsGradient}
          >
            <View style={styles.earningsContent}>
              <View>
                <Text style={styles.earningsLabel}>This Week's Earnings</Text>
                <Text style={styles.earningsAmount}>${periodEarnings.toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.earningsBtn}
                onPress={() => router.push('/my-earnings')}
              >
                <Ionicons name="wallet" size={24} color={THEME.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.earningsStats}>
              <View style={styles.earningStat}>
                <Text style={styles.earningStatValue}>{totalJobs}</Text>
                <Text style={styles.earningStatLabel}>Jobs Done</Text>
              </View>
              <View style={styles.earningStatDivider} />
              <View style={styles.earningStat}>
                <Text style={styles.earningStatValue}>${totalEarnings.toFixed(0)}</Text>
                <Text style={styles.earningStatLabel}>Total Earned</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Active Job Banner */}
        {activeJobs.length > 0 && (
          <TouchableOpacity
            style={styles.activeJobBanner}
            onPress={() => router.push('/active-job')}
            activeOpacity={0.8}
          >
            <View style={styles.activeJobIcon}>
              <Ionicons name="flash" size={24} color={THEME.secondary} />
            </View>
            <View style={styles.activeJobInfo}>
              <Text style={styles.activeJobTitle}>Active Job</Text>
              <Text style={styles.activeJobSubtitle}>
                {activeJobs[0].service_type.charAt(0).toUpperCase() +
                  activeJobs[0].service_type.slice(1)} - {activeJobs[0].status.replace('_', ' ')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={THEME.secondary} />
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={24} color={THEME.primary} />
            <Text style={styles.statValue}>{availableJobs.length}</Text>
            <Text style={styles.statLabel}>Available Jobs</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={THEME.success} />
            <Text style={styles.statValue}>{totalJobs}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={THEME.warning} />
            <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Skill Badges */}
        {userSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Skills</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.skillsScroll}
            >
              {userSkills.map((skill, index) => {
                const color = getSkillColor(skill);
                const formattedSkill = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <View key={index} style={[styles.skillBadge, { backgroundColor: color + '15' }]}>
                    <View style={[styles.skillDot, { backgroundColor: color }]} />
                    <Text style={[styles.skillText, { color }]}>
                      {formattedSkill}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/work-orders')}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME.primary + '15' }]}>
              <Ionicons name="search" size={22} color={THEME.primary} />
            </View>
            <Text style={styles.actionText}>Find Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/schedule')}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME.secondary + '15' }]}>
              <Ionicons name="calendar" size={22} color={THEME.secondary} />
            </View>
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/my-earnings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME.success + '15' }]}>
              <Ionicons name="cash" size={22} color={THEME.success} />
            </View>
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/profile')}
          >
            <View style={[styles.actionIcon, { backgroundColor: THEME.warning + '15' }]}>
              <Ionicons name="settings" size={22} color={THEME.warning} />
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  onlineStatusBar: {
    backgroundColor: THEME.success,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  onlineStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  onlineStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  onlineStatusSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
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
  headerRight: {
    alignItems: 'flex-end',
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  onlineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  onlineLabelActive: {
    color: THEME.success,
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  viewRatingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewRatingsText: {
    fontSize: 13,
    color: THEME.primary,
    fontWeight: '500',
  },
  earningsCard: {
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: THEME.spacing.md,
  },
  earningsGradient: {
    padding: THEME.spacing.lg,
  },
  earningsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  earningsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  earningsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: THEME.borderRadius.medium,
    padding: THEME.spacing.sm,
  },
  earningStat: {
    flex: 1,
    alignItems: 'center',
  },
  earningStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  earningStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  earningStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  activeJobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.secondary + '15',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.secondary + '30',
  },
  activeJobIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeJobInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  activeJobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.secondary,
  },
  activeJobSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
    marginTop: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  skillsScroll: {
    marginBottom: THEME.spacing.lg,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.full,
    marginRight: THEME.spacing.sm,
    gap: 6,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  actionCard: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
  },
});
