import { defineStore } from "pinia";
import jobsData from "/data/jobs.json";

export const useJobStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchJobs() {
      this.loading = true;
      try {
        this.jobs = await new Promise((resolve) => resolve(jobsData));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    getJobById(id) {
      return this.jobs.find(job => job.id === id);
    }
  },

  getters: {
    getJobs: (state) => state.jobs,
    isLoading() {
      return this.loading;
    },
    hasError() {
      return this.error;
    },
  },
});
