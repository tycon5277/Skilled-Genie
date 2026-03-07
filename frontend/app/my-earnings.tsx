import React, { useEffect, useState } from 'react';
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
import { useServiceStore } from '../src/stores/serviceStore';
import { THEME } from '../src/theme';

export default function MyEarningsScreen() {
  const {
    periodEarnings,
    periodJobs,
    totalEarnings,
    totalJobs,
    earningsLoading,
    fetchEarnings,
  } = useServiceStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  useEffect(() => {
    fetchEarnings(selectedPeriod);
  }, [selectedPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEarnings(selectedPeriod);
    setRefreshing(false);
  };

  const periods = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Earnings</Text>
        <View style={{ width: 44 }} />
      </View>

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
        {/* Total Earnings Card */}
        <LinearGradient colors={THEME.gradientAccent as any} style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <Ionicons name="wallet" size={32} color="white" />
          </View>
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalValue}>${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.totalJobs}>{totalJobs} jobs completed</Text>
        </LinearGradient>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.periodButton,
                selectedPeriod === period.value && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.value)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.value && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Period Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={24} color={THEME.success} />
            <Text style={styles.statValue}>${periodEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Last {selectedPeriod} Days</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="briefcase" size={24} color={THEME.secondary} />
            <Text style={styles.statValue}>{periodJobs}</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
          </View>
        </View>

        {/* Average Card */}
        <View style={styles.averageCard}>
          <View style={styles.averageRow}>
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Avg per Job</Text>
              <Text style={styles.averageValue}>
                ${periodJobs > 0 ? (periodEarnings / periodJobs).toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.averageDivider} />
            <View style={styles.averageItem}>
              <Text style={styles.averageLabel}>Avg per Day</Text>
              <Text style={styles.averageValue}>
                ${(periodEarnings / selectedPeriod).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips to Earn More</Text>
          <View style={styles.tipCard}>
            <Ionicons name="star" size={20} color={THEME.warning} />
            <Text style={styles.tipText}>Maintain high ratings for priority jobs</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="time" size={20} color={THEME.secondary} />
            <Text style={styles.tipText}>Complete jobs quickly for bonus opportunities</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="notifications" size={20} color={THEME.primary} />
            <Text style={styles.tipText}>Stay online during peak hours (8AM-6PM)</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  totalCard: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.large,
  },
  totalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    marginTop: THEME.spacing.xs,
  },
  totalJobs: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: THEME.spacing.xs,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.medium,
    padding: 4,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.small,
  },
  periodButton: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.small,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: THEME.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.textSecondary,
  },
  periodButtonTextActive: {
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    alignItems: 'center',
    ...THEME.shadow.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    marginTop: THEME.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
  },
  averageCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadow.small,
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageItem: {
    flex: 1,
    alignItems: 'center',
  },
  averageDivider: {
    width: 1,
    height: 40,
    backgroundColor: THEME.cardBorder,
  },
  averageLabel: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  averageValue: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.text,
    marginTop: 4,
  },
  tipsSection: {
    marginTop: THEME.spacing.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
    ...THEME.shadow.small,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: THEME.textSecondary,
  },
});
