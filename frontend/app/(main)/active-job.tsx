import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore } from '../../src/stores/serviceStore';
import { THEME, SERVICE_ICONS, SERVICE_COLORS } from '../../src/theme';

export default function ActiveJobScreen() {
  const { activeJobs, startJob, completeJob, fetchActiveJobs } = useServiceStore();
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const activeJob = activeJobs.length > 0 ? activeJobs[0] : null;

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  // Timer for in-progress jobs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeJob?.status === 'in_progress' && activeJob.started_at) {
      const startTime = new Date(activeJob.started_at).getTime();
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeJob]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavigate = () => {
    if (!activeJob?.customer.location) return;
    const { lat, lng } = activeJob.customer.location;
    const scheme = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
    });
    if (scheme) {
      Linking.openURL(scheme);
    }
  };

  const handleCallCustomer = () => {
    if (!activeJob?.customer.phone) return;
    Linking.openURL(`tel:${activeJob.customer.phone}`);
  };

  const handleStartJob = async () => {
    if (!activeJob) return;
    setLoading(true);
    const success = await startJob(activeJob.job_id);
    setLoading(false);
    if (!success) {
      Alert.alert('Error', 'Failed to start job. Please try again.');
    }
  };

  const handleCompleteJob = async () => {
    if (!activeJob) return;
    Alert.alert(
      'Complete Job',
      'Are you sure you want to mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setLoading(true);
            const success = await completeJob(activeJob.job_id);
            setLoading(false);
            if (success) {
              Alert.alert('Success', 'Job completed successfully!', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } else {
              Alert.alert('Error', 'Failed to complete job. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!activeJob) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Active Job</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={64} color={THEME.success} />
          <Text style={styles.emptyTitle}>No Active Jobs</Text>
          <Text style={styles.emptySubtitle}>
            Accept a job from the Jobs tab to get started
          </Text>
          <TouchableOpacity
            style={styles.findJobsButton}
            onPress={() => router.push('/jobs')}
          >
            <Ionicons name="briefcase" size={20} color="white" />
            <Text style={styles.findJobsButtonText}>Find Jobs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const serviceColor = SERVICE_COLORS[activeJob.service_type] || SERVICE_COLORS.other;
  const serviceIcon = SERVICE_ICONS[activeJob.service_type] || SERVICE_ICONS.other;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <LinearGradient
          colors={[serviceColor, serviceColor + 'DD']}
          style={styles.headerCard}
        >
          <View style={styles.headerContent}>
            <View style={styles.serviceIconLarge}>
              <Ionicons name={serviceIcon as any} size={36} color="white" />
            </View>
            <Text style={styles.serviceType}>
              {activeJob.service_type.charAt(0).toUpperCase() +
                activeJob.service_type.slice(1)}
            </Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                {activeJob.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Timer for in-progress */}
          {activeJob.status === 'in_progress' && (
            <View style={styles.timerContainer}>
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{activeJob.description}</Text>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={18} color={THEME.primary} />
              <Text style={styles.detailLabel}>Estimated Pay:</Text>
              <Text style={styles.detailValue}>${activeJob.estimated_pay.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={18} color={THEME.textSecondary} />
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>~{activeJob.estimated_duration} min</Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <View style={styles.card}>
            <View style={styles.customerRow}>
              <View style={styles.customerAvatar}>
                <Ionicons name="person" size={24} color={THEME.textSecondary} />
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{activeJob.customer.name}</Text>
                <Text style={styles.customerPhone}>{activeJob.customer.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCallCustomer}
              >
                <Ionicons name="call" size={20} color={THEME.success} />
              </TouchableOpacity>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="location" size={18} color={THEME.textSecondary} />
              <Text style={styles.address}>{activeJob.customer.address}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {activeJob.status === 'accepted' && (
            <>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={handleNavigate}
              >
                <Ionicons name="navigate" size={20} color={THEME.secondary} />
                <Text style={styles.navigateButtonText}>Navigate to Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: THEME.primary }]}
                onPress={handleStartJob}
                disabled={loading}
              >
                <Ionicons name="play" size={24} color="white" />
                <Text style={styles.actionButtonText}>Start Service</Text>
              </TouchableOpacity>
            </>
          )}

          {activeJob.status === 'in_progress' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: THEME.success }]}
              onPress={handleCompleteJob}
              disabled={loading}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.actionButtonText}>Complete Service</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.text,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    padding: THEME.spacing.lg,
    margin: THEME.spacing.md,
    borderRadius: THEME.borderRadius.xl,
    alignItems: 'center',
    ...THEME.shadow.large,
  },
  headerContent: {
    alignItems: 'center',
  },
  serviceIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  serviceType: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: THEME.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    gap: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
  section: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.sm,
  },
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    ...THEME.shadow.small,
  },
  description: {
    fontSize: 15,
    color: THEME.text,
    lineHeight: 22,
    marginBottom: THEME.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: THEME.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  customerPhone: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing.sm,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  actionsSection: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.secondary + '15',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.secondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
    ...THEME.shadow.medium,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: THEME.text,
    marginTop: THEME.spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME.textMuted,
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
    lineHeight: 20,
  },
  findJobsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    marginTop: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  findJobsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
