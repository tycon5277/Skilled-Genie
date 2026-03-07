import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, StyleSheet, Platform, BackHandler, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { NewJobAlertModal } from '../../src/components/NewJobAlertModal';
import { THEME } from '../../src/theme';

// Fresh, modern, calm, professional tab bar theme
const TAB_THEME = {
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabBarActive: '#0EA5E9',      // Calm teal/sky blue
  tabBarInactive: '#94A3B8',    // Soft gray
  iconActiveBackground: '#0EA5E915',
};

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuthStore();
  const {
    fetchAvailableJobs,
    fetchActiveJobs,
    newJobAlert,
    clearNewJobAlert,
    acceptJob,
  } = useServiceStore();

  const [backPressCount, setBackPressCount] = useState(0);

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

    poll();
    const interval = setInterval(poll, 15000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle back button (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        if (Platform.OS === 'android') {
          ToastAndroid.show('Press back again to go offline & exit', ToastAndroid.SHORT);
        }
        setTimeout(() => setBackPressCount(0), 2000);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [backPressCount]);

  const handleAcceptNewJob = async () => {
    if (newJobAlert) {
      const success = await acceptJob(newJobAlert.job_id);
      clearNewJobAlert();
      if (success) {
        router.push('/active-job');
      }
    }
  };

  const renderTabIcon = (name: string, focused: boolean) => {
    return (
      <View style={[
        styles.tabIconContainer,
        focused && styles.tabIconContainerActive
      ]}>
        <Ionicons
          name={name as any}
          size={22}
          color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive}
        />
      </View>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: TAB_THEME.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: TAB_THEME.tabBarBorder,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom + 4,
            paddingTop: 8,
            shadowColor: '#64748B',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          },
          tabBarActiveTintColor: TAB_THEME.tabBarActive,
          tabBarInactiveTintColor: TAB_THEME.tabBarInactive,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        {/* Tab 1: Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => renderTabIcon(focused ? 'home' : 'home-outline', focused),
          }}
        />
        
        {/* Tab 2: Work Orders */}
        <Tabs.Screen
          name="work-orders"
          options={{
            title: 'Work Orders',
            tabBarIcon: ({ focused }) => renderTabIcon(focused ? 'briefcase' : 'briefcase-outline', focused),
          }}
        />
        
        {/* Tab 3: Schedule */}
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ focused }) => renderTabIcon(focused ? 'calendar' : 'calendar-outline', focused),
          }}
        />
        
        {/* Tab 4: Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => renderTabIcon(focused ? 'person' : 'person-outline', focused),
          }}
        />
        
        {/* Hidden screens - not in tab bar */}
        <Tabs.Screen
          name="active-job"
          options={{
            href: null,
          }}
        />
        
        {/* Hide old jobs screen if it exists */}
        <Tabs.Screen
          name="jobs"
          options={{
            href: null,
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
  tabIconContainer: {
    width: 40,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: TAB_THEME.iconActiveBackground,
  },
});
