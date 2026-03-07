import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { NewJobAlertModal } from '../../src/components/NewJobAlertModal';
import { THEME } from '../../src/theme';

export default function MainLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    fetchAvailableJobs,
    fetchActiveJobs,
    newJobAlert,
    clearNewJobAlert,
    acceptJob,
  } = useServiceStore();

  // Check auth
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  // Poll for jobs
  useEffect(() => {
    if (!isAuthenticated) return;

    const poll = () => {
      fetchAvailableJobs();
      fetchActiveJobs();
    };

    poll(); // Initial fetch
    const interval = setInterval(poll, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleAcceptNewJob = async () => {
    if (newJobAlert) {
      const success = await acceptJob(newJobAlert.job_id);
      clearNewJobAlert();
      if (success) {
        router.push('/active-job');
      }
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: THEME.primary,
          tabBarInactiveTintColor: THEME.textMuted,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="active-job"
          options={{
            title: 'Active',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.activeIconContainer}>
                <Ionicons name="flash" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Global New Job Alert Modal */}
      <NewJobAlertModal
        visible={!!newJobAlert}
        job={newJobAlert}
        onAccept={handleAcceptNewJob}
        onDismiss={clearNewJobAlert}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.cardBg,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    height: Platform.OS === 'ios' ? 88 : 60,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeIconContainer: {
    position: 'relative',
  },
});
