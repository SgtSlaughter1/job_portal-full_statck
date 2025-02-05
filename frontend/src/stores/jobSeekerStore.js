// Store for managing job seeker-related state and actions
import { defineStore } from 'pinia';
import { jobSeekerApi, handleApiError } from '@/services/api';

export const useJobSeekerStore = defineStore('jobSeeker', {
  state: () => ({
    profile: null,
    applications: [],
    savedJobs: [],
    isLoading: false,
    error: null,
    dashboardStats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      rejectedApplications: 0,
      recentApplications: []
    }
  }),

  getters: {
    getProfile: (state) => state.profile,
    getApplications: (state) => state.applications,
    getSavedJobs: (state) => state.savedJobs,
    getLoadingStatus: (state) => state.isLoading,
    getError: (state) => state.error,
    getApplicationsByStatus: (state) => (status) => {
      return state.applications.filter(app => app.status === status);
    },
    getItems: (state) => state.applications
  },

  actions: {
    async fetchProfile() {
      try {
        this.isLoading = true;
        const response = await jobSeekerApi.getProfile();
        this.profile = response.data.data;
        this.error = null;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error fetching profile:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(profileData) {
      try {
        this.isLoading = true;
        const response = await jobSeekerApi.updateProfile(profileData);
        this.profile = response.data.data;
        this.error = null;
        return true;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error updating profile:', error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchDashboardData() {
      try {
        this.isLoading = true;
        const response = await jobSeekerApi.getDashboard();
        
        if (!response?.data?.data?.applications) {
          this.applications = [];
          this.updateDashboardStats([]);
          return;
        }

        const { profile, applications } = response.data.data;
        
        this.profile = profile || null;
        this.applications = applications;
        this.updateDashboardStats(applications);
        
        this.error = null;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error fetching dashboard data:', error);
        this.updateDashboardStats([]);
      } finally {
        this.isLoading = false;
      }
    },

    updateDashboardStats(applications) {
      const recentApplications = [...(applications || [])]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      this.dashboardStats = {
        totalApplications: applications?.length || 0,
        pendingApplications: applications?.filter(app => app.status === 'pending')?.length || 0,
        acceptedApplications: applications?.filter(app => app.status === 'accepted')?.length || 0,
        rejectedApplications: applications?.filter(app => app.status === 'rejected')?.length || 0,
        recentApplications: recentApplications.length || []
      };
    },

    async applyForJob(jobId, applicationData) {
      try {
        this.isLoading = true;
        const response = await jobSeekerApi.applyForJob(jobId, applicationData);
        const newApplication = response.data.data;
        this.applications.push(newApplication);
        this.updateDashboardStats(this.applications);
        this.error = null;
        return newApplication;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error applying for job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async withdrawApplication(applicationId) {
      try {
        this.isLoading = true;
        await jobSeekerApi.withdrawApplication(applicationId);
        this.applications = this.applications.filter(app => app.id !== applicationId);
        this.updateDashboardStats(this.applications);
        this.error = null;
        return true;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error withdrawing application:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveJob(jobId) {
      try {
        this.isLoading = true;
        const response = await jobSeekerApi.saveJob(jobId);
        const savedJob = response.data.data;
        this.savedJobs.push(savedJob);
        this.error = null;
        return savedJob;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error saving job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async removeSavedJob(jobId) {
      try {
        this.isLoading = true;
        await jobSeekerApi.unsaveJob(jobId);
        this.savedJobs = this.savedJobs.filter(job => job.id !== jobId);
        this.error = null;
        return true;
      } catch (error) {
        const { message } = handleApiError(error);
        this.error = message;
        console.error('Error removing saved job:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    resetState() {
      this.profile = null;
      this.applications = [];
      this.savedJobs = [];
      this.isLoading = false;
      this.error = null;
      this.dashboardStats = {
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        recentApplications: []
      };
    }
  }
});
