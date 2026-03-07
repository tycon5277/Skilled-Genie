import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { skilledGenieAPI, setAuthToken, clearAuthToken, getStoredToken } from '../api/vendorApi';

export interface GenieProfile {
  genie_id: string;
  name: string;
  phone: string;
  skills: string[];
  rating: number;
  total_jobs: number;
  total_earnings: number;
  is_online: boolean;
  current_location?: { lat: number; lng: number };
  availability_hours?: { start: string; end: string };
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  needsRegistration: boolean;
  pendingPhone: string | null;
  user: GenieProfile | null;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<'login' | 'register' | 'error'>;
  register: (phone: string, name: string, skills: string[]) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<GenieProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  needsRegistration: false,
  pendingPhone: null,
  user: null,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const token = await getStoredToken();
      
      if (token) {
        // Try to get profile with existing token
        try {
          const response = await skilledGenieAPI.getProfile();
          if (response.data.success) {
            set({ 
              isAuthenticated: true, 
              user: response.data.genie,
              isLoading: false,
              needsRegistration: false,
              error: null
            });
            return;
          }
        } catch (error) {
          // Token invalid, clear it
          await clearAuthToken();
        }
      }
      
      set({ isAuthenticated: false, user: null, isLoading: false, needsRegistration: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false, needsRegistration: false });
    }
  },

  sendOTP: async (phone: string) => {
    try {
      set({ error: null });
      await AsyncStorage.setItem('user_phone', phone);
      const response = await skilledGenieAPI.sendOTP(phone);
      return response.data.success;
    } catch (error: any) {
      set({ error: error.message || 'Failed to send OTP' });
      return false;
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    try {
      set({ error: null, isLoading: true });
      const response = await skilledGenieAPI.verifyOTP(phone, otp);
      
      if (response.data.success) {
        if (response.data.session_token && response.data.genie) {
          // Existing user - login successful
          await setAuthToken(response.data.session_token);
          await AsyncStorage.setItem('user_phone', phone);
          
          set({
            isAuthenticated: true,
            user: response.data.genie,
            isLoading: false,
            needsRegistration: false,
            pendingPhone: null,
            error: null
          });
          return 'login';
        } else {
          // New user - needs registration
          set({
            isLoading: false,
            needsRegistration: true,
            pendingPhone: phone,
            error: null
          });
          return 'register';
        }
      }
      
      set({ isLoading: false });
      return 'error';
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Invalid OTP',
        isLoading: false
      });
      return 'error';
    }
  },

  register: async (data: {
    phone: string;
    name: string;
    skills: string[];
    skill_category?: string;
    experience_level?: string;
    service_area?: string;
    bio?: string;
    social_links?: { [key: string]: string };
    certifications?: string[];
  }) => {
    try {
      set({ error: null, isLoading: true });
      const response = await skilledGenieAPI.register(data);
      
      if (response.data.success && response.data.session_token) {
        await setAuthToken(response.data.session_token);
        await AsyncStorage.setItem('user_phone', data.phone);
        
        set({
          isAuthenticated: true,
          user: response.data.genie,
          isLoading: false,
          needsRegistration: false,
          pendingPhone: null,
          error: null
        });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed',
        isLoading: false
      });
      return false;
    }
  },

  logout: async () => {
    await clearAuthToken();
    set({
      isAuthenticated: false,
      user: null,
      needsRegistration: false,
      pendingPhone: null,
      error: null
    });
  },

  updateProfile: async (data: Partial<GenieProfile>) => {
    try {
      const response = await skilledGenieAPI.updateProfile(data);
      if (response.data.success) {
        set({ user: response.data.genie });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  refreshProfile: async () => {
    try {
      const response = await skilledGenieAPI.getProfile();
      if (response.data.success) {
        set({ user: response.data.genie });
      }
    } catch (error) {
      console.log('Failed to refresh profile:', error);
    }
  },
}));
