import { defineStore } from "pinia";
import { jobsApi } from "@/services/api";

export const useJobStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    currentJob: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
  }),

  getters: {
    getJobs: (state) => state.jobs,
    getCurrentJob: (state) => state.currentJob,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error,
    getCurrentPage: (state) => state.currentPage,
    getTotalPages: (state) => state.totalPages
  },

  actions: {
    async fetchJobs(page = 1, filters = {}) {
      this.loading = true;
      try {
        const params = {
          page,
          ...(filters.search && { search: filters.search }),
          ...(filters.type && { type: filters.type }),
          ...(filters.location && { location: filters.location })
        };

        const response = await jobsApi.getJobs(params);
        this.jobs = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Failed to fetch jobs';
        console.error('Error fetching jobs:', error);
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
    }
  }
});
