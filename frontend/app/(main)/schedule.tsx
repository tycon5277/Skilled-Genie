import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useServiceStore } from '../../src/stores/serviceStore';
import { useAuthStore } from '../../src/stores/authStore';
import { THEME, SERVICE_COLORS, SERVICE_ICONS } from '../../src/theme';
import { getIndiaWeekDays, getIndiaTime, isIndiaToday, formatIndiaFullDate, formatIndiaDayName } from '../../src/utils/indiaTime';

export default function ScheduleScreen() {
  const { user } = useAuthStore();
  const { activeJobs, fetchActiveJobs } = useServiceStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getIndiaTime());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const isOnline = user?.is_online || false;

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveJobs();
    setRefreshing(false);
  };

  // Generate week days using Indian timezone
  const weekDays = getIndiaWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (date: Date) => {
    return formatIndiaFullDate(date);
  };

  const isToday = (date: Date) => {
    return isIndiaToday(date);
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Mock appointments (placeholder)
  const mockAppointments = [
    {
      id: '1',
      time: '09:00 AM',
      service: 'plumbing',
      customer: 'John Smith',
      address: '123 Main St',
      status: 'confirmed',
    },
    {
      id: '2',
      time: '02:00 PM',
      service: 'electrical',
      customer: 'Sarah Johnson',
      address: '456 Oak Ave',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return THEME.success;
      case 'pending': return THEME.warning;
      case 'in_progress': return THEME.secondary;
      case 'completed': return THEME.textMuted;
      default: return THEME.textMuted;
    }
  };

  const renderAppointmentCard = (appointment: any) => {
    const serviceColor = SERVICE_COLORS[appointment.service] || THEME.primary;
    const serviceIcon = SERVICE_ICONS[appointment.service] || 'construct';
    const statusColor = getStatusColor(appointment.status);

    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        activeOpacity={0.8}
      >
        <View style={styles.timeColumn}>
          <Text style={styles.appointmentTime}>{appointment.time}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>

        <View style={styles.appointmentContent}>
          <View style={styles.appointmentHeader}>
            <View style={[styles.serviceIcon, { backgroundColor: serviceColor + '15' }]}>
              <Ionicons name={serviceIcon as any} size={18} color={serviceColor} />
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.serviceType}>
                {appointment.service.charAt(0).toUpperCase() + appointment.service.slice(1)}
              </Text>
              <Text style={styles.customerName}>{appointment.customer}</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={THEME.textMuted} />
            <Text style={styles.addressText}>{appointment.address}</Text>
          </View>

          <View style={styles.appointmentActions}>
            <TouchableOpacity style={styles.navigateBtn}>
              <Ionicons name="navigate" size={14} color={THEME.primary} />
              <Text style={styles.navigateBtnText}>Navigate</Text>
            </TouchableOpacity>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {appointment.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'day' && styles.toggleBtnActive]}
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.toggleText, viewMode === 'day' && styles.toggleTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'week' && styles.toggleBtnActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {weekDays.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayItem,
                isToday(date) && styles.dayItemToday,
                isSelected(date) && styles.dayItemSelected,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dayName,
                isSelected(date) && styles.dayNameSelected,
              ]}>
                {dayNames[date.getDay()]}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected(date) && styles.dayNumberSelected,
              ]}>
                {date.getDate()}
              </Text>
              {isToday(date) && <View style={styles.todayDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
        <Text style={styles.appointmentCount}>
          {mockAppointments.length} appointments
        </Text>
      </View>

      {/* Appointments List */}
      <ScrollView
        style={styles.appointmentsList}
        contentContainerStyle={styles.appointmentsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.primary}
          />
        }
      >
        {mockAppointments.length > 0 ? (
          mockAppointments.map(renderAppointmentCard)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color={THEME.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Appointments</Text>
            <Text style={styles.emptySubtitle}>
              You have no scheduled appointments for this day
            </Text>
          </View>
        )}
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.backgroundSecondary,
    borderRadius: THEME.borderRadius.medium,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.small,
  },
  toggleBtnActive: {
    backgroundColor: THEME.cardBg,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.textMuted,
  },
  toggleTextActive: {
    color: THEME.text,
  },
  calendarStrip: {
    backgroundColor: THEME.cardBg,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  daysContainer: {
    paddingHorizontal: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  dayItem: {
    width: 50,
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.medium,
    marginRight: THEME.spacing.sm,
  },
  dayItemToday: {
    borderWidth: 1,
    borderColor: THEME.primary + '50',
  },
  dayItemSelected: {
    backgroundColor: THEME.primary,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.textMuted,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: 'white',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
  },
  dayNumberSelected: {
    color: 'white',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.primary,
    marginTop: 4,
  },
  dateHeader: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  appointmentCount: {
    fontSize: 13,
    color: THEME.textMuted,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentsContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: THEME.borderRadius.large,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  timeColumn: {
    alignItems: 'center',
    paddingRight: THEME.spacing.md,
    borderRightWidth: 1,
    borderRightColor: THEME.cardBorder,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentContent: {
    flex: 1,
    paddingLeft: THEME.spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentInfo: {
    marginLeft: THEME.spacing.sm,
  },
  serviceType: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
  },
  customerName: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: THEME.spacing.sm,
  },
  addressText: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navigateBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.primary,
  },
  statusBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.small,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
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
