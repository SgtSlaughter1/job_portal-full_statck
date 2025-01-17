// Store for managing job applications
import { defineStore } from 'pinia';
import api from '@/services/api';
import { jobSeekerApi } from '@/services/api';

export const useApplicationStore = defineStore('applications', {
  state: () => ({
    applications: [],
    currentApplication: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {
      status: '',
      jobId: null
    }
  }),

  getters: {
    getApplications: (state) => state.applications,
    getCurrentApplication: (state) => state.currentApplication,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
    getCurrentPage: (state) => state.currentPage,
    getTotalPages: (state) => state.totalPages
  },

  actions: {
    // Fetch all applications with optional filters
    async fetchApplications(page = 1, filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page,
          ...filters
        };
        const response = await jobSeekerApi.getApplications(params);
        this.applications = response.data.data;
        this.currentPage = response.data.meta.current_page;
        this.totalPages = response.data.meta.last_page;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch applications';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Submit new application
    async submitApplication(formData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await jobSeekerApi.applyForJob(formData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to submit application';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get application details
    async fetchApplicationById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/applications/${id}`);
        this.currentApplication = response.data.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch application details';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete/withdraw application (job seeker only)
    async deleteApplication(id) {
      this.loading = true;
      this.error = null;
      try {
        await jobSeekerApi.withdrawApplication(id);
        // Remove from list if exists
        this.applications = this.applications.filter(app => app.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete application';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Reset store state
    resetState() {
      this.applications = [];
      this.currentApplication = null;
      this.loading = false;
      this.error = null;
      this.currentPage = 1;
      this.totalPages = 1;
      this.filters = {
        status: '',
        jobId: null
      };
    }
  }
});
