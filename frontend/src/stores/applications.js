// Store for managing job applications
import { defineStore } from 'pinia';
import { jobSeekerApi } from '@/services/api';
import { employerApi } from '@/services/api'; // Import employerApi

export const useApplicationStore = defineStore('applications', {
  state: () => ({
    // Ensure applications is always an array
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
    // Getter to ensure applications is always returned as an array
    getApplications: (state) => {
      // If applications is an array, return it
      // If it's an object with a data property, return that
      // Otherwise, return an empty array
      return Array.isArray(state.applications) 
        ? state.applications 
        : (state.applications?.data || []);
    },
    
    // Additional getters for easy access
    getLoadingStatus: (state) => state.loading,
    getError: (state) => state.error,

    // Check if user has applied for a specific job
    hasAppliedForJob: (state) => (jobId) => {
      const applications = Array.isArray(state.applications) 
        ? state.applications 
        : (state.applications?.data || []);
      
      return applications.some(app => app.job_id === jobId);
    }
  },

  actions: {
    // Fetch all applications with optional filters
    async fetchApplications(page = 1, filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        // Prepare pagination and filter parameters
        const params = {
          page,
          ...filters,
          // Add default sorting or additional parameters if needed
          sort: 'created_at',
          order: 'desc'
        };

        // Remove undefined or empty string values
        Object.keys(params).forEach(key => 
          (params[key] === undefined || params[key] === '') && delete params[key]
        );

        // Fetch applications with improved error handling
        const response = await jobSeekerApi.getApplications(params);
        
        // Normalize the response to ensure we always have an array
        this.applications = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);

        // Update pagination information
        this.currentPage = response.meta?.current_page || page;
        this.totalPages = response.meta?.last_page || 1;

        return this.applications;
      } catch (error) {
        // Detailed error logging
        console.error('Failed to fetch applications:', error);
        
        // User-friendly error message
        this.error = error.response?.data?.message 
          || error.message 
          || 'Failed to fetch applications. Please try again later.';
        
        // Set applications to an empty array to prevent errors
        this.applications = [];
        
        // Re-throw to allow component-level error handling
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single application by ID
    async fetchApplicationById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await jobSeekerApi.getApplicationById(id);
        this.currentApplication = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch application details';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update application status
    async updateApplicationStatus(applicationId, status, notes = '') {
      this.loading = true;
      this.error = null;
      try {
        // Prepare data object to match backend expectations
        const data = {
          status,
          notes
        };

        // Call API to update status
        const response = await employerApi.updateApplicationStatus(applicationId, data);

        // Update the application in the local store
        const index = this.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          // Update the specific application's status
          this.applications[index] = {
            ...this.applications[index],
            status,
            employer_notes: notes
          };
        }

        return response.data;
      } catch (error) {
        // Detailed error logging
        console.error('Failed to update application status:', error);
        
        // User-friendly error message
        this.error = error.response?.data?.message 
          || error.message 
          || 'Failed to update application status. Please try again later.';
        
        // Re-throw to allow component-level error handling
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Submit a new application
    async submitApplication(formData) {
      this.loading = true;
      this.error = null;
      try {

        const response = await jobSeekerApi.applyForJob(formData);
        
        // Add the new application to the list if successful
        if (response.data) {
          this.applications = Array.isArray(this.applications)
            ? [response.data, ...this.applications]
            : [response.data];
        }
        
        return response.data;
      } catch (error) {
        console.error('Failed to submit application:', error);
        this.error = error.response?.data?.message || 'Failed to submit application';
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
    }
  }
});
