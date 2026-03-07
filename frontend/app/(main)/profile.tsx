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
    fetchEarnings(30);
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

  const userSkills = user?.skills || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.profile_pic ? (
              <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'G'}
                </Text>
              </View>
            )}
            <View style={[styles.statusBadge, isOnline && styles.statusBadgeOnline]} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Partner'}</Text>
          <Text style={styles.userPhone}>{user?.phone || ''}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FF9500" />
            <Text style={styles.ratingText}>{user?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.ratingCount}>({totalJobs} jobs)</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{totalEarnings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
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

        {/* Skills */}
        {userSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MY SKILLS</Text>
            <View style={styles.skillsContainer}>
              {userSkills.map((skill: string, index: number) => {
                const color = getSkillColor(skill);
                const formattedSkill = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <View key={index} style={[styles.skillChip, { backgroundColor: color + '15' }]}>
                    <Text style={[styles.skillText, { color }]}>{formattedSkill}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-earnings')} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#34C75915' }]}>
                <Ionicons name="wallet" size={20} color="#34C759" />
              </View>
              <Text style={styles.menuText}>My Earnings</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-ratings')} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF950015' }]}>
                <Ionicons name="star" size={20} color="#FF9500" />
              </View>
              <Text style={styles.menuText}>Reviews & Ratings</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#007AFF15' }]}>
                <Ionicons name="document-text" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuText}>Documents</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#5856D615' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#5856D6" />
              </View>
              <Text style={styles.menuText}>Verification</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#00C7BE15' }]}>
                <Ionicons name="help-circle" size={20} color="#00C7BE" />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
              <View style={[styles.menuIcon, { backgroundColor: '#8E8E9315' }]}>
                <Ionicons name="settings" size={20} color="#8E8E93" />
              </View>
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Skilled Genie v1.0.0</Text>

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
  },
  header: {
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8E8E93',
    borderWidth: 3,
    borderColor: THEME.background,
  },
  statusBadgeOnline: {
    backgroundColor: '#34C759',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
  },
  userPhone: {
    fontSize: 15,
    color: THEME.textMuted,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  ratingCount: {
    fontSize: 14,
    color: THEME.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E5EA',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textMuted,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
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
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 17,
    color: THEME.text,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 58,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B3010',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionText: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: 'center',
  },
});
