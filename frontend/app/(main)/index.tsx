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

  const userSkills = user?.skills || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* iOS-style Online Status Banner */}
      {isOnline && (
        <View style={styles.onlineBanner}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>You're Online</Text>
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
            tintColor="#007AFF"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Partner'}</Text>
          </View>
          <View style={styles.onlineToggle}>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5EA"
            />
          </View>
        </View>

        {/* Stats Cards - iOS grouped style */}
        <Text style={styles.sectionHeader}>TODAY'S OVERVIEW</Text>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${periodEarnings.toFixed(0)}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalJobs}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Active Job Banner */}
        {activeJobs.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>ACTIVE JOB</Text>
            <TouchableOpacity
              style={styles.activeJobCard}
              onPress={() => router.push('/active-job')}
              activeOpacity={0.7}
            >
              <View style={styles.activeJobIcon}>
                <Ionicons name="flash" size={24} color="#FF9500" />
              </View>
              <View style={styles.activeJobInfo}>
                <Text style={styles.activeJobTitle}>
                  {activeJobs[0].service_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Text>
                <Text style={styles.activeJobStatus}>
                  {activeJobs[0].status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionHeader}>QUICK ACTIONS</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/work-orders')}
            activeOpacity={0.6}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#007AFF15' }]}>
              <Ionicons name="search" size={20} color="#007AFF" />
            </View>
            <Text style={styles.actionText}>Find Jobs</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/schedule')}
            activeOpacity={0.6}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF950015' }]}>
              <Ionicons name="calendar" size={20} color="#FF9500" />
            </View>
            <Text style={styles.actionText}>My Schedule</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/my-earnings')}
            activeOpacity={0.6}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#34C75915' }]}>
              <Ionicons name="wallet" size={20} color="#34C759" />
            </View>
            <Text style={styles.actionText}>Earnings</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
          
          <View style={styles.actionDivider} />
          
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/my-ratings')}
            activeOpacity={0.6}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFCC0015' }]}>
              <Ionicons name="star" size={20} color="#FFCC00" />
            </View>
            <Text style={styles.actionText}>Reviews</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Skills */}
        {userSkills.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>MY SKILLS</Text>
            <View style={styles.skillsContainer}>
              {userSkills.map((skill: string, index: number) => {
                const color = getSkillColor(skill);
                const formattedSkill = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <View key={index} style={[styles.skillBadge, { backgroundColor: color + '15' }]}>
                    <View style={[styles.skillDot, { backgroundColor: color }]} />
                    <Text style={[styles.skillText, { color }]}>{formattedSkill}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Total Earnings Card */}
        <Text style={styles.sectionHeader}>TOTAL EARNINGS</Text>
        <View style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Lifetime Earnings</Text>
            <Text style={styles.earningsValue}>${totalEarnings.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  onlineBanner: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  onlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 15,
    color: THEME.textMuted,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textMuted,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  statsCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
  },
  statLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  activeJobCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeJobIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF950015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeJobInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activeJobTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.text,
  },
  activeJobStatus: {
    fontSize: 13,
    color: '#FF9500',
    marginTop: 2,
  },
  actionsCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 17,
    color: THEME.text,
    marginLeft: 12,
  },
  actionDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 60,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  earningsCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 17,
    color: THEME.text,
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#34C759',
  },
});
