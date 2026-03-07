import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { skilledGenieAPI } from '../../src/api/vendorApi';
import { THEME } from '../../src/theme';

export default function ProfileScreen() {
  const { user, logout, refreshProfile } = useAuthStore();
  const { totalJobs, totalEarnings, resetStore } = useServiceStore();
  const [isOnline, setIsOnline] = React.useState(user?.is_online || false);

  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    try {
      await skilledGenieAPI.updateAvailability(value);
      refreshProfile();
    } catch (error) {
      setIsOnline(!value);
      Alert.alert('Error', 'Failed to update availability');
    }
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
            resetStore();
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={THEME.gradientPrimary as any}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={THEME.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Genie'}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.rating?.toFixed(1) || '5.0'}</Text>
              <View style={styles.statLabel}>
                <Ionicons name="star" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.statLabelText}>Rating</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.total_jobs || 0}</Text>
              <Text style={styles.statLabelText}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${(user?.total_earnings || 0).toFixed(0)}</Text>
              <Text style={styles.statLabelText}>Earnings</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Online Toggle */}
        <View style={styles.section}>
          <View style={styles.onlineToggle}>
            <View style={styles.onlineToggleLeft}>
              <View style={[styles.onlineIndicator, isOnline && styles.onlineIndicatorActive]} />
              <View>
                <Text style={styles.onlineTitle}>
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </Text>
                <Text style={styles.onlineSubtitle}>
                  {isOnline ? 'Receiving job requests' : 'Not receiving requests'}
                </Text>
              </View>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: THEME.textMuted, true: THEME.success + '50' }}
              thumbColor={isOnline ? THEME.success : THEME.backgroundSecondary}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-ratings')}>
            <View style={[styles.menuIcon, { backgroundColor: THEME.warning + '20' }]}>
              <Ionicons name="star" size={20} color={THEME.warning} />
            </View>
            <Text style={styles.menuText}>My Ratings</Text>
            <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-earnings')}>
            <View style={[styles.menuIcon, { backgroundColor: THEME.success + '20' }]}>
              <Ionicons name="wallet" size={20} color={THEME.success} />
            </View>
            <Text style={styles.menuText}>My Earnings</Text>
            <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: THEME.secondary + '20' }]}>
              <Ionicons name="document-text" size={20} color={THEME.secondary} />
            </View>
            <Text style={styles.menuText}>Job History</Text>
            <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: THEME.primary + '20' }]}>
              <Ionicons name="notifications" size={20} color={THEME.primary} />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: THEME.textSecondary + '20' }]}>
              <Ionicons name="help-circle" size={20} color={THEME.textSecondary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={THEME.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  profileHeader: {
    padding: THEME.spacing.lg,
    alignItems: 'center',
    paddingTop: THEME.spacing.xl,
    paddingBottom: THEME.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadow.medium,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: THEME.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabelText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    padding: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textMuted,
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    ...THEME.shadow.small,
  },
  onlineToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.textMuted,
  },
  onlineIndicatorActive: {
    backgroundColor: THEME.success,
  },
  onlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  onlineSubtitle: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.small,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: THEME.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.error + '10',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.error,
  },
  version: {
    fontSize: 12,
    color: THEME.textMuted,
    textAlign: 'center',
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xxl,
  },
});
