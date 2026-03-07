import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { View, StyleSheet, Platform, BackHandler, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { useServiceStore } from '../../src/stores/serviceStore';
import { NewJobAlertModal } from '../../src/components/NewJobAlertModal';
import { THEME } from '../../src/theme';

// iOS-style Tab Bar Theme
const TAB_THEME = {
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#C6C6C8',        // iOS separator color
  tabBarActive: '#007AFF',        // iOS blue
  tabBarInactive: '#8E8E93',      // iOS gray
};

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
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
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
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
      <Ionicons
        name={name as any}
        size={24}
        color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive}
      />
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: TAB_THEME.tabBarBackground,
            borderTopWidth: 0.5,
            borderTopColor: TAB_THEME.tabBarBorder,
            height: 49 + insets.bottom,  // iOS standard tab bar height
            paddingBottom: insets.bottom,
            paddingTop: 0,
          },
          tabBarActiveTintColor: TAB_THEME.tabBarActive,
          tabBarInactiveTintColor: TAB_THEME.tabBarInactive,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginTop: -2,
          },
        }}
      >
        {/* Tab 1: Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => renderTabIcon(focused ? 'house.fill' : 'house', focused),
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={24} 
                color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive} 
              />
            ),
          }}
        />
        
        {/* Tab 2: Work Orders */}
        <Tabs.Screen
          name="work-orders"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? 'briefcase' : 'briefcase-outline'} 
                size={24} 
                color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive} 
              />
            ),
          }}
        />
        
        {/* Tab 3: Schedule */}
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? 'calendar' : 'calendar-outline'} 
                size={24} 
                color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive} 
              />
            ),
          }}
        />
        
        {/* Tab 4: Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name={focused ? 'person-circle' : 'person-circle-outline'} 
                size={26} 
                color={focused ? TAB_THEME.tabBarActive : TAB_THEME.tabBarInactive} 
              />
            ),
          }}
        />
        
        {/* Hidden screens */}
        <Tabs.Screen
          name="active-job"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="jobs"
          options={{ href: null }}
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

const styles = StyleSheet.create({});
