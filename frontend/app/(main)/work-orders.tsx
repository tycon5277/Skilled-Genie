import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore } from '../../src/stores/serviceStore';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME, SERVICE_COLORS, SERVICE_ICONS } from '../../src/theme';

export default function WorkOrdersScreen() {
  const { user } = useAuthStore();
  const { availableJobs, fetchAvailableJobs, isLoading } = useServiceStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const isOnline = user?.is_online || false;

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableJobs();
    setRefreshing(false);
  };

  const filteredJobs = activeFilter
    ? availableJobs.filter(job => job.service_type === activeFilter)
    : availableJobs;

  const renderJobCard = ({ item }: { item: any }) => {
    const serviceColor = SERVICE_COLORS[item.service_type] || THEME.primary;
    const serviceIcon = SERVICE_ICONS[item.service_type] || 'construct';

    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => router.push({ pathname: '/job-details', params: { jobId: item.job_id } })}
        activeOpacity={0.8}
      >
        <View style={styles.jobHeader}>
          <View style={[styles.serviceIconContainer, { backgroundColor: serviceColor + '15' }]}>
            <Ionicons name={serviceIcon as any} size={22} color={serviceColor} />
          </View>
          <View style={styles.jobHeaderInfo}>
            <Text style={styles.jobServiceType}>
              {item.service_type.charAt(0).toUpperCase() + item.service_type.slice(1)}
            </Text>
            <View style={styles.distanceBadge}>
              <Ionicons name="location" size={12} color={THEME.textMuted} />
              <Text style={styles.distanceText}>{item.distance || '2.5'} km away</Text>
            </View>
          </View>
          <View style={styles.payBadge}>
            <Text style={styles.payAmount}>${item.estimated_pay || item.price || '45'}</Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={THEME.textSecondary} />
            <Text style={styles.detailText}>{item.customer_name || 'Customer'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={14} color={THEME.textSecondary} />
            <Text style={styles.detailText}>{item.scheduled_time || 'Flexible timing'}</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.jobDescription} numberOfLines={2}>
            {item.description || 'Service request details will appear here'}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.declineBtn}>
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.acceptBtnText}>Accept</Text>
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={64} color={THEME.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Work Orders Available</Text>
      <Text style={styles.emptySubtitle}>
        {isOnline 
          ? 'Check back soon for new service requests matching your skills'
          : 'Go online to start receiving work orders'}
      </Text>
    </View>
  );

  const filters = [
    { key: null, label: 'All' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'electrical', label: 'Electrical' },
    { key: 'cleaning', label: 'Cleaning' },
    { key: 'carpentry', label: 'Carpentry' },
  ];

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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Work Orders</Text>
        <TouchableOpacity style={styles.mapBtn}>
          <Ionicons name="map" size={20} color={THEME.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          keyExtractor={(item) => item.key || 'all'}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === item.key && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Jobs List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.job_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME.primary}
            />
          }
        />
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
  },
  mapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  filtersContainer: {
    marginBottom: THEME.spacing.sm,
  },
  filtersList: {
    paddingHorizontal: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.cardBg,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginRight: THEME.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textSecondary,
  },
  filterTextActive: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  jobCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobHeaderInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  jobServiceType: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  payBadge: {
    backgroundColor: THEME.success + '15',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.small,
  },
  payAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.success,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  jobFooter: {
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    marginBottom: THEME.spacing.sm,
  },
  jobDescription: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: THEME.backgroundSecondary,
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    backgroundColor: THEME.success,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME.textMuted,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
});
