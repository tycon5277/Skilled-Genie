import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore } from '../src/stores/serviceStore';
import { THEME, SERVICE_ICONS, SERVICE_COLORS } from '../src/theme';

export default function JobDetailsScreen() {
  const { selectedJob, acceptJob } = useServiceStore();
  const [loading, setLoading] = React.useState(false);

  if (!selectedJob) {
    router.back();
    return null;
  }

  const job = selectedJob;
  const serviceColor = SERVICE_COLORS[job.service_type] || SERVICE_COLORS.other;
  const serviceIcon = SERVICE_ICONS[job.service_type] || SERVICE_ICONS.other;

  const handleAcceptJob = async () => {
    setLoading(true);
    const success = await acceptJob(job.job_id);
    setLoading(false);
    
    if (success) {
      Alert.alert('Job Accepted!', 'You can now view the customer details and start working.', [
        { text: 'View Active Job', onPress: () => router.replace('/(main)/active-job') },
      ]);
    } else {
      Alert.alert('Error', 'Failed to accept job. It may no longer be available.');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <LinearGradient
          colors={[serviceColor, serviceColor + 'DD']}
          style={styles.serviceHeader}
        >
          <View style={styles.serviceIconContainer}>
            <Ionicons name={serviceIcon as any} size={40} color="white" />
          </View>
          <Text style={styles.serviceType}>
            {job.service_type.charAt(0).toUpperCase() + job.service_type.slice(1)}
          </Text>
          <Text style={styles.postedTime}>Posted {formatTime(job.created_at)}</Text>
        </LinearGradient>

        {/* Pay Section */}
        <View style={styles.paySection}>
          <View style={styles.payMain}>
            <Text style={styles.payLabel}>Estimated Pay</Text>
            <Text style={styles.payAmount}>${job.estimated_pay.toFixed(2)}</Text>
          </View>
          <View style={styles.payDetails}>
            <View style={styles.payDetailItem}>
              <Ionicons name="location" size={18} color={THEME.textSecondary} />
              <Text style={styles.payDetailText}>{job.distance_km} km away</Text>
            </View>
            <View style={styles.payDetailItem}>
              <Ionicons name="time" size={18} color={THEME.textSecondary} />
              <Text style={styles.payDetailText}>~{job.estimated_duration} min</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{job.description}</Text>
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
                <Text style={styles.customerName}>{job.customer.name}</Text>
                <Text style={styles.customerPhone}>
                  {job.status === 'available' ? '***** (shown after accept)' : job.customer.phone}
                </Text>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={18} color={THEME.textSecondary} />
              <Text style={styles.address}>{job.customer.address}</Text>
            </View>
          </View>
        </View>

        {/* Note */}
        {job.status === 'available' && (
          <View style={styles.noteContainer}>
            <Ionicons name="information-circle" size={18} color={THEME.info} />
            <Text style={styles.noteText}>
              Customer contact details will be revealed after you accept this job.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Accept Button */}
      {job.status === 'available' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: serviceColor }]}
            onPress={handleAcceptJob}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <Text style={styles.acceptButtonText}>Accepting...</Text>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.acceptButtonText}>Accept Job</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  serviceHeader: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  serviceType: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  postedTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: THEME.spacing.xs,
  },
  paySection: {
    backgroundColor: THEME.cardBg,
    margin: THEME.spacing.md,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.lg,
    ...THEME.shadow.medium,
  },
  payMain: {
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  payLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: THEME.primary,
  },
  payDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: THEME.spacing.xl,
  },
  payDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payDetailText: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  section: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textMuted,
    marginBottom: THEME.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    ...THEME.shadow.small,
  },
  description: {
    fontSize: 16,
    color: THEME.text,
    lineHeight: 24,
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
    marginLeft: THEME.spacing.sm,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  customerPhone: {
    fontSize: 14,
    color: THEME.textMuted,
    marginTop: 2,
  },
  addressContainer: {
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
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.info + '15',
    marginHorizontal: THEME.spacing.md,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: THEME.info,
    lineHeight: 18,
  },
  footer: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.cardBg,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.medium,
    gap: THEME.spacing.sm,
    ...THEME.shadow.medium,
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});
