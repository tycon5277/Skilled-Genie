import { create } from 'zustand';
import { skilledGenieAPI } from '../api/vendorApi';

export interface Job {
  job_id: string;
  service_type: string;
  status: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    location?: { lat: number; lng: number };
  };
  description: string;
  estimated_duration: number;
  estimated_pay: number;
  distance_km: number;
  created_at: string;
  scheduled_time?: string;
  assigned_genie_id?: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface Rating {
  rating_id: string;
  genie_id: string;
  job_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
  service_type: string;
  created_at: string;
}

interface ServiceState {
  // Jobs state
  availableJobs: Job[];
  availableJobsLoading: boolean;
  activeJobs: Job[];
  activeJobsLoading: boolean;
  selectedJob: Job | null;
  
  // Ratings state
  ratings: Rating[];
  totalRatings: number;
  averageRating: number;
  ratingsLoading: boolean;
  
  // Earnings state
  periodEarnings: number;
  periodJobs: number;
  totalEarnings: number;
  totalJobs: number;
  earningsLoading: boolean;
  
  // Job history
  jobHistory: Job[];
  jobHistoryLoading: boolean;
  
  // New job alert
  newJobAlert: Job | null;
  
  // Actions
  fetchAvailableJobs: () => Promise<void>;
  fetchActiveJobs: () => Promise<void>;
  fetchJobDetails: (jobId: string) => Promise<Job | null>;
  acceptJob: (jobId: string) => Promise<boolean>;
  startJob: (jobId: string) => Promise<boolean>;
  completeJob: (jobId: string) => Promise<boolean>;
  fetchRatings: () => Promise<void>;
  fetchEarnings: (days?: number) => Promise<void>;
  fetchJobHistory: () => Promise<void>;
  setSelectedJob: (job: Job | null) => void;
  clearNewJobAlert: () => void;
  resetStore: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  // Initial state
  availableJobs: [],
  availableJobsLoading: false,
  activeJobs: [],
  activeJobsLoading: false,
  selectedJob: null,
  
  ratings: [],
  totalRatings: 0,
  averageRating: 5.0,
  ratingsLoading: false,
  
  periodEarnings: 0,
  periodJobs: 0,
  totalEarnings: 0,
  totalJobs: 0,
  earningsLoading: false,
  
  jobHistory: [],
  jobHistoryLoading: false,
  
  newJobAlert: null,

  fetchAvailableJobs: async () => {
    try {
      set({ availableJobsLoading: true });
      const response = await skilledGenieAPI.getAvailableJobs();
      const newJobs = response.data.jobs || [];
      
      // Check for new jobs to alert
      const currentJobs = get().availableJobs;
      if (currentJobs.length > 0 && newJobs.length > currentJobs.length) {
        const currentIds = new Set(currentJobs.map((j: Job) => j.job_id));
        const newJob = newJobs.find((j: Job) => !currentIds.has(j.job_id));
        if (newJob) {
          set({ newJobAlert: newJob });
        }
      }
      
      set({ availableJobs: newJobs, availableJobsLoading: false });
    } catch (error) {
      console.log('Available jobs fetch error:', error);
      set({ availableJobsLoading: false });
    }
  },

  fetchActiveJobs: async () => {
    try {
      set({ activeJobsLoading: true });
      const response = await skilledGenieAPI.getActiveJobs();
      set({ activeJobs: response.data.jobs || [], activeJobsLoading: false });
    } catch (error) {
      console.log('Active jobs fetch error:', error);
      set({ activeJobsLoading: false });
    }
  },

  fetchJobDetails: async (jobId: string) => {
    try {
      const response = await skilledGenieAPI.getJobDetails(jobId);
      const job = response.data.job;
      set({ selectedJob: job });
      return job;
    } catch (error) {
      console.log('Job details fetch error:', error);
      return null;
    }
  },

  acceptJob: async (jobId: string) => {
    try {
      const response = await skilledGenieAPI.acceptJob(jobId);
      if (response.data.success) {
        // Refresh jobs lists
        get().fetchAvailableJobs();
        get().fetchActiveJobs();
        set({ selectedJob: response.data.job });
        return true;
      }
      return false;
    } catch (error: any) {
      console.log('Accept job error:', error);
      return false;
    }
  },

  startJob: async (jobId: string) => {
    try {
      const response = await skilledGenieAPI.startJob(jobId);
      if (response.data.success) {
        get().fetchActiveJobs();
        set({ selectedJob: response.data.job });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Start job error:', error);
      return false;
    }
  },

  completeJob: async (jobId: string) => {
    try {
      const response = await skilledGenieAPI.completeJob(jobId);
      if (response.data.success) {
        get().fetchActiveJobs();
        get().fetchJobHistory();
        set({ selectedJob: response.data.job });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Complete job error:', error);
      return false;
    }
  },

  fetchRatings: async () => {
    try {
      set({ ratingsLoading: true });
      const response = await skilledGenieAPI.getMyRatings();
      set({
        ratings: response.data.ratings || [],
        totalRatings: response.data.total_ratings || 0,
        averageRating: response.data.average_rating || 5.0,
        ratingsLoading: false
      });
    } catch (error) {
      console.log('Ratings fetch error:', error);
      set({ ratingsLoading: false });
    }
  },

  fetchEarnings: async (days: number = 7) => {
    try {
      set({ earningsLoading: true });
      const response = await skilledGenieAPI.getMyEarnings(days);
      set({
        periodEarnings: response.data.period_earnings || 0,
        periodJobs: response.data.period_jobs || 0,
        totalEarnings: response.data.total_earnings || 0,
        totalJobs: response.data.total_jobs || 0,
        earningsLoading: false
      });
    } catch (error) {
      console.log('Earnings fetch error:', error);
      set({ earningsLoading: false });
    }
  },

  fetchJobHistory: async () => {
    try {
      set({ jobHistoryLoading: true });
      const response = await skilledGenieAPI.getJobHistory();
      set({ jobHistory: response.data.jobs || [], jobHistoryLoading: false });
    } catch (error) {
      console.log('Job history fetch error:', error);
      set({ jobHistoryLoading: false });
    }
  },

  setSelectedJob: (job: Job | null) => {
    set({ selectedJob: job });
  },

  clearNewJobAlert: () => {
    set({ newJobAlert: null });
  },

  resetStore: () => {
    set({
      availableJobs: [],
      activeJobs: [],
      selectedJob: null,
      ratings: [],
      totalRatings: 0,
      averageRating: 5.0,
      periodEarnings: 0,
      periodJobs: 0,
      totalEarnings: 0,
      totalJobs: 0,
      jobHistory: [],
      newJobAlert: null,
    });
  },
}));
