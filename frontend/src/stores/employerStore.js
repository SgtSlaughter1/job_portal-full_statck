import { defineStore } from 'pinia';
import { employerApi, jobsApi, handleApiError } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    profile: null,
    jobs: [],
    applications: [],
    dashboardStats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      recentApplications: []
    },
    error: null,
    isLoading: false
  }),

  actions: {
    // Fetch employer profile data
    async fetchProfile() {
      try {
        this.isLoading = true;
        const response = await employerApi.getProfile();
        this.error = null;
        return response.data.data;
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
        this.error = null;
        return response.data.data;
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
        const errorMessage = 'Unauthorized access';
        this.error = errorMessage;
        this.isLoading = false;
        throw new Error(errorMessage);
      }

      // Set loading state
      this.isLoading = true;
      this.error = null;

      try {
        const response = await employerApi.getDashboard();
        
        if (!response.data?.data) {
          const errorMessage = 'Invalid response structure';
          this.error = errorMessage;
          this.isLoading = false;
          throw new Error(errorMessage);
        }
        
        // Update dashboard data
        const data = response.data.data;
        this.profile = data.profile;
        this.jobs = data.jobs || [];
        this.applications = data.applications || [];
        
        // Update dashboard stats
        this.dashboardStats = {
          totalJobs: data.stats?.totalJobs || this.jobs.length,
          activeJobs: data.stats?.activeJobs || this.jobs.filter(job => job.status === 'open').length,
          totalApplications: data.stats?.totalApplications || this.applications.length,
          recentApplications: data.stats?.recentApplications || []
        };

        return data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch dashboard data';
        
        this.error = errorMessage;
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
    async updateJob({ jobId, jobData }) {
      try {
        this.isLoading = true;
        const response = await jobsApi.updateJob(jobId, jobData);
        this.error = null;
        
        const updatedJob = response.data.data;
        
        const index = this.jobs.findIndex(job => job.id === jobId);
        if (index !== -1) {
          this.jobs[index] = updatedJob;
        }
        
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
        this.error = null;
        
        // Ensure the API call includes the authentication token
        await jobsApi.deleteJob(jobId, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Remove the job from the store
        this.jobs = this.jobs.filter(job => job.id !== jobId);
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete job';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Handle job application
    async handleApplication({ applicationId, status }) {
      try {
        this.isLoading = true;
        this.error = null;
        
        const response = await employerApi.updateApplication(applicationId, { status });
        
        const updatedApplication = response.data.data;
        const index = this.applications.findIndex(app => app.id === applicationId);
        
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }
        
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
      this.isLoading = false;
      this.error = null;
      this.profile = null;
      this.jobs = [];
      this.applications = [];
      this.dashboardStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        recentApplications: []
      };
    },

    // Fetch applications for a specific job
    async fetchJobApplications(jobId) {
      try {
        this.isLoading = true;
        
        const response = await employerApi.getJobApplications(jobId);
        
        // Update applications for the specific job
        const jobApplications = response.data?.data || [];
        
        // Update the applications in the store
        this.applications = jobApplications;
        
        this.error = null;
        return jobApplications;
      } catch (error) {
        console.error('Error fetching job applications:', error);
        const { message } = handleApiError(error);
        this.error = message;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch detailed application information
    async fetchApplicationDetails(applicationId) {
      try {
        const response = await employerApi.getApplicationDetails(applicationId);
        
        if (!response.data?.data) {
          throw new Error('No application details found');
        }
        
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch application details';
        throw error;
      }
    },

    // Update application status
    async updateApplicationStatus({ applicationId, status }) {
      // Reset loading and error states
      this.isLoading = true;
      this.error = null;

      try {
        // Normalize status
        const normalizedStatus = ['accepted', 'rejected'].includes(status) 
          ? status 
          : 'pending';

        const response = await employerApi.updateApplication(applicationId, { status: normalizedStatus });
        
        const updatedApplication = response.data.data;
        
        // Find and update the application in the local state
        const index = this.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }
        
        return updatedApplication;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to update application status';
        
        this.error = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  },

  getters: {
    // Getter for recent applications length
    recentApplicationsCount() {
      return this.dashboardStats.recentApplications.length || 0;
    },

    // Getter for error message
    errorMessage() {
      return this.error;
    }
  }
});
