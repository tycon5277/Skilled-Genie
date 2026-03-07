import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME, SERVICE_ICONS, SERVICE_COLORS } from '../theme';
import { Job } from '../stores/serviceStore';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  showStatus?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress, showStatus = false }) => {
  const serviceColor = SERVICE_COLORS[job.service_type] || SERVICE_COLORS.other;
  const serviceIcon = SERVICE_ICONS[job.service_type] || SERVICE_ICONS.other;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return THEME.warning;
      case 'in_progress': return THEME.secondary;
      case 'completed': return THEME.success;
      default: return THEME.primary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: serviceColor + '20' }]}>
          <Ionicons name={serviceIcon as any} size={24} color={serviceColor} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.serviceType}>
            {job.service_type.charAt(0).toUpperCase() + job.service_type.slice(1)}
          </Text>
          <Text style={styles.timeAgo}>{formatTime(job.created_at)}</Text>
        </View>
        <View style={styles.payContainer}>
          <Text style={styles.payAmount}>${job.estimated_pay.toFixed(0)}</Text>
          <Text style={styles.payLabel}>Est. Pay</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Ionicons name="location-outline" size={16} color={THEME.textSecondary} />
            <Text style={styles.detailText}>{job.distance_km} km</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="time-outline" size={16} color={THEME.textSecondary} />
            <Text style={styles.detailText}>{job.estimated_duration} min</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="person-outline" size={16} color={THEME.textSecondary} />
            <Text style={styles.detailText}>{job.customer.name}</Text>
          </View>
        </View>

        {showStatus && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
              {job.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    ...THEME.shadow.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  timeAgo: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  payContainer: {
    alignItems: 'flex-end',
  },
  payAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.primary,
  },
  payLabel: {
    fontSize: 10,
    color: THEME.textMuted,
    textTransform: 'uppercase',
  },
  content: {
    gap: THEME.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.small,
    marginTop: THEME.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
