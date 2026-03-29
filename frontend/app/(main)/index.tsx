import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { skilledGenieAPI } from '../../src/api/vendorApi';
import { THEME, getSkillColor } from '../../src/theme';
import { getIndiaGreeting } from '../../src/utils/indiaTime';

const { width } = Dimensions.get('window');

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
    return getIndiaGreeting();
  };

  const userSkills = user?.skills || [];
  const pendingJobs = availableJobs.length;

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
            tintColor="#007AFF"
          />
        }
      >
        {/* Header with Online Toggle */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Partner'}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.onlineToggleContainer}>
              <Text style={[styles.onlineLabel, isOnline && styles.onlineLabelActive]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E5EA"
              />
            </View>
          </View>
        </View>

        {/* Online Status Card */}
        {isOnline && (
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="radio" size={20} color="#34C759" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>You're receiving jobs</Text>
              <Text style={styles.statusSubtitle}>Customers can find you nearby</Text>
            </View>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/my-earnings')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statEmoji]}>💰</Text>
            <Text style={styles.statValue}>₹{periodEarnings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/work-orders')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statEmoji]}>💼</Text>
            <Text style={styles.statValue}>{totalJobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/my-ratings')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statEmoji]}>⭐</Text>
            <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => router.push('/work-orders')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statEmoji]}>📋</Text>
            <Text style={styles.statValue}>{pendingJobs}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </TouchableOpacity>
        </View>

        {/* Active Job Alert */}
        {activeJobs.length > 0 && (
          <TouchableOpacity
            style={styles.activeJobBanner}
            onPress={() => router.push('/active-job')}
            activeOpacity={0.8}
          >
            <View style={styles.activeJobPulse}>
              <View style={styles.activeJobDot} />
            </View>
            <View style={styles.activeJobInfo}>
              <Text style={styles.activeJobTitle}>Active Job</Text>
              <Text style={styles.activeJobType}>
                {activeJobs[0].service_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </View>
            <View style={styles.activeJobAction}>
              <Text style={styles.activeJobActionText}>View</Text>
              <Ionicons name="chevron-forward" size={16} color="#007AFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsTitle}>Earnings</Text>
            <TouchableOpacity onPress={() => router.push('/my-earnings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>₹{(periodEarnings / 7).toFixed(0)}</Text>
              <Text style={styles.earningsLabel}>Today</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>₹{periodEarnings.toFixed(0)}</Text>
              <Text style={styles.earningsLabel}>This Week</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>₹{totalEarnings.toFixed(0)}</Text>
              <Text style={styles.earningsLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/work-orders')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="search" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Find Jobs</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/schedule')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="calendar" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/my-earnings')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#34C759' }]}>
                <Ionicons name="cash" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="person" size={24} color="white" />
              </View>
              <Text style={styles.actionLabel}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Skills */}
        {userSkills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>My Skills</Text>
            <View style={styles.skillsContainer}>
              {userSkills.map((skill: string, index: number) => {
                const color = getSkillColor(skill);
                const formattedSkill = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <View key={index} style={[styles.skillChip, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                    <Text style={[styles.skillText, { color }]}>{formattedSkill}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Help Section */}
        <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
          <View style={styles.helpIcon}>
            <Ionicons name="help-circle" size={24} color="#007AFF" />
          </View>
          <View style={styles.helpInfo}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSubtitle}>Contact support for assistance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <View style={{ height: 30 }} />
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 14,
    color: THEME.textMuted,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  onlineToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  onlineLabelActive: {
    color: '#34C759',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C75910',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#34C75920',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C75915',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34C759',
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#34C759',
    opacity: 0.8,
    marginTop: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
  },
  statLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  activeJobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF950010',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF950030',
  },
  activeJobPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF950020',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeJobDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF9500',
  },
  activeJobInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activeJobTitle: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '500',
  },
  activeJobType: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginTop: 2,
  },
  activeJobAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeJobActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  earningsCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.text,
  },
  viewAllText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#34C759',
  },
  earningsLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 4,
  },
  earningsDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E5EA',
  },
  quickActions: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 56) / 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.text,
    textAlign: 'center',
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 14,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpInfo: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  helpSubtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 2,
  },
});
