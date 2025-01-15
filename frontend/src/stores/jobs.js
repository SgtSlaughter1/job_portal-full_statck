import { defineStore } from "pinia";
import { jobsApi, jobSeekerApi } from "@/services/api";

export const useJobStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {
      search: '',
      type: '',
      location: ''
    }
  }),

  getters: {
    getJobs: (state) => state.jobs,
    getCurrentJob: (state) => state.currentJob,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
    getCurrentPage: (state) => state.currentPage,
    getTotalPages: (state) => state.totalPages,
    
    // Add a new getter for filtered jobs
    getFilteredJobs: (state) => {
      let filteredJobs = [...state.jobs];

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title?.toLowerCase().includes(searchTerm) ||
          job.description?.toLowerCase().includes(searchTerm) ||
          job.company?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply type filter
      if (state.filters.type) {
        filteredJobs = filteredJobs.filter(job => 
          job.type?.toLowerCase() === state.filters.type.toLowerCase()
        );
      }

      // Apply location filter
      if (state.filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location?.toLowerCase() === state.filters.location.toLowerCase()
        );
      }

      return filteredJobs;
    }
  },

  actions: {
    async fetchJobs(page = 1, filters = {}) {
      this.loading = true;
      try {
        // Update filters in state
        this.filters = {
          search: filters.search || '',
          type: filters.type || '',
          location: filters.location || ''
        };

        const response = await jobsApi.getJobs({
          page,
          ...this.filters
        });

        if (response.data) {
          this.jobs = response.data.data || [];
          
          // Handle pagination
          if (response.data.meta) {
            this.totalPages = response.data.meta.last_page || 1;
            this.currentPage = response.data.meta.current_page || 1;
          } else {
            this.totalPages = 1;
            this.currentPage = 1;
          }
        } else {
          throw new Error('Invalid response format from server');
        }

        this.error = null;
      } catch (error) {
        console.error('Error fetching jobs:', error);
        this.error = error.message;
        this.jobs = [];
        this.totalPages = 1;
        this.currentPage = 1;
      } finally {
        this.loading = false;
      }
    },

    async fetchJobById(id) {
      if (!id) return null;
      
      this.loading = true;
      try {
        const response = await jobsApi.getJob(id);
        this.currentJob = response.data.data;
        this.error = null;
        return this.currentJob;
      } catch (error) {
        this.error = error.message || 'Failed to fetch job details';
        console.error('Error fetching job details:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentJob() {
      this.currentJob = null;
    },

    async submitApplication(formData) {
      this.loading = true;
      try {
        const response = await jobSeekerApi.applyForJob(formData.get('jobId'), formData);
        this.error = null;
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to submit application';
        console.error('Error submitting application:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
