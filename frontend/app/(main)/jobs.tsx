import React, { useEffect, useState } from 'react';
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
import { useServiceStore, Job } from '../../src/stores/serviceStore';
import { JobCard } from '../../src/components/JobCard';
import { THEME } from '../../src/theme';

export default function JobsScreen() {
  const {
    availableJobs,
    activeJobs,
    availableJobsLoading,
    fetchAvailableJobs,
    fetchActiveJobs,
    setSelectedJob,
  } = useServiceStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAvailableJobs();
    fetchActiveJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAvailableJobs(), fetchActiveJobs()]);
    setRefreshing(false);
  };

  const handleJobPress = (job: Job) => {
    setSelectedJob(job);
    router.push('/job-details');
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Active Jobs Button */}
      <TouchableOpacity
        style={[
          styles.activeJobsButton,
          activeJobs.length > 0 && styles.activeJobsButtonActive,
        ]}
        onPress={() => router.push('/active-job')}
        activeOpacity={0.7}
      >
        <View style={styles.activeJobsLeft}>
          <Ionicons
            name="flash"
            size={24}
            color={activeJobs.length > 0 ? THEME.secondary : THEME.textMuted}
          />
          <View>
            <Text
              style={[
                styles.activeJobsTitle,
                activeJobs.length > 0 && styles.activeJobsTitleActive,
              ]}
            >
              Active Jobs
            </Text>
            <Text style={styles.activeJobsSubtitle}>
              {activeJobs.length > 0
                ? `${activeJobs.length} job${activeJobs.length > 1 ? 's' : ''} in progress`
                : 'No active jobs'}
            </Text>
          </View>
        </View>
        {activeJobs.length > 0 && (
          <View style={styles.activeJobsBadge}>
            <Text style={styles.activeJobsBadgeText}>{activeJobs.length}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
      </TouchableOpacity>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Jobs</Text>
        <Text style={styles.jobCount}>{availableJobs.length} jobs</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="briefcase-outline" size={64} color={THEME.textMuted} />
      <Text style={styles.emptyTitle}>No Jobs Available</Text>
      <Text style={styles.emptySubtitle}>
        Pull down to refresh or check back later for new opportunities
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
      </View>

      <FlatList
        data={availableJobs}
        keyExtractor={(item) => item.job_id}
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => handleJobPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          availableJobsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME.primary} />
            </View>
          ) : (
            renderEmptyState()
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  headerSection: {
    marginBottom: THEME.spacing.md,
  },
  activeJobsButton: {
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    ...THEME.shadow.small,
  },
  activeJobsButtonActive: {
    borderColor: THEME.secondary,
    backgroundColor: THEME.secondary + '08',
  },
  activeJobsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  activeJobsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  activeJobsTitleActive: {
    color: THEME.secondary,
  },
  activeJobsSubtitle: {
    fontSize: 13,
    color: THEME.textMuted,
    marginTop: 2,
  },
  activeJobsBadge: {
    backgroundColor: THEME.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: THEME.spacing.sm,
  },
  activeJobsBadgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.text,
  },
  jobCount: {
    fontSize: 14,
    color: THEME.textMuted,
  },
  loadingContainer: {
    padding: THEME.spacing.xxl,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
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
});
