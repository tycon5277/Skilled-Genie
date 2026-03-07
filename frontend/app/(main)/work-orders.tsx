import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore } from '../../src/stores/serviceStore';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME, getSkillColor, getSkillIcon } from '../../src/theme';

export default function WorkOrdersScreen() {
  const { user } = useAuthStore();
  const { availableJobs, fetchAvailableJobs, isLoading } = useServiceStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const isOnline = user?.is_online || false;

  const userSkills = useMemo(() => user?.skills || [], [user?.skills]);

  const filterOptions = useMemo(() => {
    const options = [{ key: null, label: 'All' }];
    userSkills.forEach((skill: string) => {
      const formattedLabel = skill.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      options.push({ key: skill, label: formattedLabel });
    });
    return options;
  }, [userSkills]);

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
    const serviceColor = getSkillColor(item.service_type);
    const serviceIcon = getSkillIcon(item.service_type);
    const formattedServiceType = item.service_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={[styles.serviceIcon, { backgroundColor: serviceColor + '15' }]}>
            <Ionicons name={serviceIcon as any} size={24} color={serviceColor} />
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{formattedServiceType}</Text>
            <Text style={styles.jobCustomer}>{item.customer_name || 'Customer'}</Text>
          </View>
          <View style={styles.payBadge}>
            <Text style={styles.payAmount}>₹{item.estimated_pay || '450'}</Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={THEME.textMuted} />
            <Text style={styles.detailText}>{item.distance || '2.5'} km away</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={THEME.textMuted} />
            <Text style={styles.detailText}>{item.scheduled_time || 'Flexible'}</Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>
          {item.description || 'Service request details will appear here'}
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.declineBtn} activeOpacity={0.7}>
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.7}>
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="briefcase-outline" size={48} color={THEME.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Jobs Available</Text>
      <Text style={styles.emptySubtitle}>
        {isOnline 
          ? 'New jobs matching your skills will appear here'
          : 'Go online to start receiving work orders'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Online Banner */}
      {isOnline && (
        <View style={styles.onlineBanner}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>You're Online</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map((item) => {
          const isActive = activeFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key || 'all'}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(item.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Jobs List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.cardBg,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.text,
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
    padding: 20,
    paddingBottom: 100,
  },
  jobCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobInfo: {
    flex: 1,
    marginLeft: 12,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.text,
  },
  jobCustomer: {
    fontSize: 15,
    color: THEME.textMuted,
    marginTop: 2,
  },
  payBadge: {
    backgroundColor: '#34C75915',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#34C759',
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: THEME.textMuted,
  },
  jobDescription: {
    fontSize: 15,
    color: THEME.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: THEME.background,
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: THEME.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
