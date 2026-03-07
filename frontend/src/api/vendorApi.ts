import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get backend URL from environment
const getBaseUrl = () => {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 
                     Constants.expoConfig?.extra?.backendUrl ||
                     'http://localhost:8001';
  return backendUrl;
};

const VENDOR_API_BASE = getBaseUrl();

const vendorAxios = axios.create({
  baseURL: `${VENDOR_API_BASE}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage
let authToken: string | null = null;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

// Request interceptor - attach token
vendorAxios.interceptors.request.use(async (config) => {
  if (!authToken) {
    authToken = await AsyncStorage.getItem('vendor_token');
  }
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - handle 401
vendorAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return vendorAxios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Re-authenticate
        const phone = await AsyncStorage.getItem('user_phone');
        if (phone) {
          await skilledGenieAPI.sendOTP(phone);
          const response = await skilledGenieAPI.verifyOTP(phone, '123456');
          const newToken = response.data.session_token;

          authToken = newToken;
          await AsyncStorage.setItem('vendor_token', newToken);

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return vendorAxios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const skilledGenieAPI = {
  // Auth
  sendOTP: (phone: string) => vendorAxios.post('/auth/send-otp', { phone }),
  verifyOTP: (phone: string, otp: string) => vendorAxios.post('/auth/verify-otp', { phone, otp }),
  register: (data: {
    phone: string;
    name: string;
    skills: string[];
    skill_category?: string;
    experience_level?: string;
    service_area?: string;
    bio?: string;
    social_links?: { [key: string]: string };
    certifications?: string[];
  }) => vendorAxios.post('/auth/register', data),

  // Profile
  getProfile: () => vendorAxios.get('/genie/profile'),
  updateProfile: (data: { name?: string; skills?: string[] }) => vendorAxios.put('/genie/profile', data),
  updateLocation: (lat: number, lng: number) => vendorAxios.put('/genie/location', { lat, lng }),
  updateAvailability: (isOnline: boolean) => vendorAxios.put('/genie/availability', { is_online: isOnline }),

  // Jobs
  getAvailableJobs: () => vendorAxios.get('/genie/available-jobs'),
  getActiveJobs: () => vendorAxios.get('/genie/active-jobs'),
  getJobDetails: (jobId: string) => vendorAxios.get(`/genie/job/${jobId}`),
  acceptJob: (jobId: string) => vendorAxios.post(`/genie/jobs/${jobId}/accept`),
  startJob: (jobId: string) => vendorAxios.post(`/genie/jobs/${jobId}/start`),
  completeJob: (jobId: string) => vendorAxios.post(`/genie/jobs/${jobId}/complete`),
  getJobHistory: (limit?: number) => vendorAxios.get(`/genie/job-history${limit ? `?limit=${limit}` : ''}`),

  // Stats
  getMyRatings: (limit: number = 50) => vendorAxios.get(`/genie/my-ratings?limit=${limit}`),
  getMyEarnings: (days: number = 7) => vendorAxios.get(`/genie/earnings?days=${days}`),
};

// Token management helpers
export const setAuthToken = async (token: string) => {
  authToken = token;
  await AsyncStorage.setItem('vendor_token', token);
};

export const clearAuthToken = async () => {
  authToken = null;
  await AsyncStorage.removeItem('vendor_token');
  await AsyncStorage.removeItem('user_phone');
};

export const getStoredToken = async () => {
  return await AsyncStorage.getItem('vendor_token');
};

export default vendorAxios;
