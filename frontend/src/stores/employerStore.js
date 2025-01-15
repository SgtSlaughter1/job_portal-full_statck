// Store for managing employer-related state and actions
import { defineStore } from 'pinia';
import { employerApi, jobsApi, handleApiError } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    profile: null,
    jobs: [],
    applications: [],
    isLoading: false,
    error: null,
    dashboardStats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      recentApplications: []
    }
  }),

  getters: {
    // Get employer profile information
    getProfile: (state) => state.profile,
    
    // Get all jobs posted by the employer
    getJobs: (state) => state.jobs,
    
    // Get all applications for employer's jobs
    getApplications: (state) => state.applications,
    
    // Check if data is being loaded
    getLoadingStatus: (state) => state.isLoading,
    
    // Get any error messages
    getError: (state) => state.error,

    // Get all items (jobs) for the dashboard
    getItems: (state) => state.jobs
  },

  actions: {
    // Fetch employer profile data
    async fetchProfile() {
      try {
        this.isLoading = true;
        const response = await employerApi.getProfile();
        this.profile = response.data.data;
        this.error = null;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error fetching profile:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Update employer profile
    async updateProfile(profileData) {
      try {
        this.isLoading = true;
        const response = await employerApi.updateProfile(profileData);
        this.profile = response.data.data;
        this.error = null;
        return true;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error updating profile:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch dashboard data
    async fetchDashboardData() {
      const authStore = useAuthStore();
      
      // Check if user is authorized and is an employer
      if (!authStore.isAuthenticated || !authStore.isEmployer) {
        this.error = 'Unauthorized access';
        throw new Error('Unauthorized access');
      }

      try {
        this.isLoading = true;
        const response = await employerApi.getDashboard();
        
        if (!response.data?.data) {
          throw new Error('Invalid response structure from server');
        }
        
        const { profile, jobs, applications, stats } = response.data.data;
        
        // Update store state
        this.profile = profile;
        this.jobs = jobs || [];
        this.applications = applications || [];
        
        // Update dashboard stats
        this.dashboardStats = {
          totalJobs: stats?.totalJobs || this.jobs.length,
          activeJobs: stats?.activeJobs || this.jobs.filter(job => job.status === 'open').length,
          totalApplications: stats?.totalApplications || this.applications.length,
          recentApplications: stats?.recentApplications || this.applications
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
        };

        this.error = null;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error fetching dashboard data:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Create a new job posting
    async createJob(jobData) {
      try {
        this.isLoading = true;
        const response = await jobsApi.createJob(jobData);
        this.jobs.push(response.data.data);
        this.error = null;
        return response.data.data;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error creating job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Update an existing job
    async updateJob(jobId, jobData) {
      try {
        this.isLoading = true;
        const response = await jobsApi.updateJob(jobId, jobData);
        const updatedJob = response.data.data;
        
        const index = this.jobs.findIndex(job => job.id === jobId);
        if (index !== -1) {
          this.jobs[index] = updatedJob;
        }
        
        this.error = null;
        return updatedJob;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error updating job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Delete a job posting
    async deleteJob(jobId) {
      try {
        this.isLoading = true;
        await jobsApi.deleteJob(jobId);
        this.jobs = this.jobs.filter(job => job.id !== jobId);
        this.error = null;
        return true;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error deleting job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Handle job application
    async handleApplication(applicationId, status) {
      try {
        this.isLoading = true;
        const response = await employerApi.updateApplication(applicationId, { status });
        
        const updatedApplication = response.data.data;
        const index = this.applications.findIndex(app => app.id === applicationId);
        
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }
        
        this.error = null;
        return updatedApplication;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error updating application:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Reset store state
    resetState() {
      this.profile = null;
      this.jobs = [];
      this.applications = [];
      this.isLoading = false;
      this.error = null;
      this.dashboardStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        recentApplications: []
      };
    }
  }
});
