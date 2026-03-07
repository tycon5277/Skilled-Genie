import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { THEME, getSkillColor } from '../../src/theme';

export default function ProfileScreen() {
  const { user, logout, refreshProfile } = useAuthStore();
  const { totalJobs, totalEarnings, periodEarnings, fetchEarnings } = useServiceStore();
  const [refreshing, setRefreshing] = useState(false);
  const isOnline = user?.is_online || false;

  useEffect(() => {
    fetchEarnings(30); // Last 30 days
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshProfile(), fetchEarnings(30)]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'wallet',
      label: 'My Earnings',
      color: THEME.success,
      onPress: () => router.push('/my-earnings'),
    },
    {
      icon: 'star',
      label: 'Reviews & Ratings',
      color: THEME.warning,
      onPress: () => router.push('/my-ratings'),
    },
    {
      icon: 'document-text',
      label: 'Documents',
      color: THEME.secondary,
      onPress: () => {},
    },
    {
      icon: 'shield-checkmark',
      label: 'Verification',
      color: THEME.accent,
      onPress: () => {},
    },
    {
      icon: 'settings',
      label: 'Settings',
      color: THEME.textSecondary,
      onPress: () => {},
    },
    {
      icon: 'help-circle',
      label: 'Help & Support',
      color: THEME.info,
      onPress: () => {},
    },
  ];

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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user?.profile_pic ? (
                <Image 
                  source={{ uri: user.profile_pic }} 
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={THEME.gradientPrimary as any}
                  style={styles.avatarPlaceholder}
                >
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'G'}
                  </Text>
                </LinearGradient>
              )}
              <View style={[styles.onlineBadge, isOnline && styles.onlineBadgeActive]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'Genie'}</Text>
              <Text style={styles.userPhone}>{user?.phone || ''}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={THEME.warning} />
                <Text style={styles.ratingText}>
                  {user?.rating?.toFixed(1) || '0.0'} ({totalJobs} jobs)
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={20} color={THEME.primary} />
            </TouchableOpacity>
          </View>

          {/* Skills */}
          {userSkills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.skillsSectionTitle}>My Skills</Text>
              <View style={styles.skillsRow}>
                {userSkills.slice(0, 4).map((skill, index) => {
                  const color = getSkillColor(skill);
                  const formattedSkill = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                  return (
                    <View 
                      key={index} 
                      style={[styles.skillChip, { backgroundColor: color + '15' }]}
                    >
                      <Text style={[styles.skillChipText, { color }]}>
                        {formattedSkill}
                      </Text>
                    </View>
                  );
                })}
                {userSkills.length > 4 && (
                  <View style={styles.moreSkillsChip}>
                    <Text style={styles.moreSkillsText}>+{userSkills.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Earnings Overview */}
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <View style={styles.earningsGrid}>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Today</Text>
            <Text style={styles.earningsValue}>$0</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsValue}>${periodEarnings.toFixed(0)}</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>This Month</Text>
            <Text style={styles.earningsValue}>${totalEarnings.toFixed(0)}</Text>
          </View>
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Total</Text>
            <Text style={styles.earningsValue}>${totalEarnings.toFixed(0)}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={THEME.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={THEME.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Skilled Genie v1.0.0</Text>
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
  profileCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: THEME.textMuted,
    borderWidth: 3,
    borderColor: THEME.cardBg,
  },
  onlineBadgeActive: {
    backgroundColor: THEME.success,
  },
  profileInfo: {
    flex: 1,
    marginLeft: THEME.spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
  },
  userPhone: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsSection: {
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  skillsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMuted,
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
  },
  skillChip: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.small,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreSkillsChip: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.small,
    backgroundColor: THEME.backgroundSecondary,
  },
  moreSkillsText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.md,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  earningsCard: {
    width: '48%',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  earningsLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
  },
  menuContainer: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    overflow: 'hidden',
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: THEME.text,
    marginLeft: THEME.spacing.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    padding: THEME.spacing.md,
    backgroundColor: THEME.error + '10',
    borderRadius: THEME.borderRadius.large,
    marginBottom: THEME.spacing.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: THEME.textMuted,
    marginBottom: THEME.spacing.lg,
  },
});
