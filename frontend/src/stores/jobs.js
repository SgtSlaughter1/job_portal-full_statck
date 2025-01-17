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
    
    // Enhanced filtered jobs getter with better error handling
    getFilteredJobs: (state) => {
      try {
        let filteredJobs = [...state.jobs];

        if (state.filters.search) {
          const searchTerms = state.filters.search.toLowerCase().split(' ');
          filteredJobs = filteredJobs.filter(job => {
            const searchText = `${job.title} ${job.description} ${job.company}`.toLowerCase();
            return searchTerms.every(term => searchText.includes(term));
          });
        }

        if (state.filters.type) {
          filteredJobs = filteredJobs.filter(job => 
            job.type?.toLowerCase() === state.filters.type.toLowerCase()
          );
        }

        if (state.filters.location) {
          filteredJobs = filteredJobs.filter(job => 
            job.location?.toLowerCase().includes(state.filters.location.toLowerCase())
          );
        }

        return filteredJobs;
      } catch (error) {
        // Return empty array on error
        return [];
      }
    }
  },

  actions: {
    // Enhanced fetchJobs with better error and data handling
    async fetchJobs(page = 1, filters = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await jobsApi.getJobs({ page, ...filters });

        // Check if response exists
        if (!response?.data) {
          throw new Error('Invalid response structure from server');
        }

        // Handle both paginated and non-paginated responses
        let jobsData = [];
        let metaData = {};

        if (response.data.data) {
          // Laravel paginated response
          jobsData = response.data.data;
          metaData = {
            current_page: response.data.meta?.current_page || 1,
            last_page: response.data.meta?.last_page || 1
          };
        } else if (Array.isArray(response.data)) {
          // Array response
          jobsData = response.data;
          metaData = {
            current_page: 1,
            last_page: 1
          };
        } else if (typeof response.data === 'object') {
          // Single object response
          jobsData = [response.data];
          metaData = {
            current_page: 1,
            last_page: 1
          };
        }

        // Normalize job data
        this.jobs = jobsData.map(job => ({
          id: job.id,
          title: job.title || 'Untitled Position',
          description: job.description || '',
          location: job.location || 'Location not specified',
          salary: job.salary || 0,
          type: job.type || 'full-time',
          employer: {
            company_name: job.employer?.company_name || 'Company not specified',
            location: job.employer?.location || 'Location not specified'
          },
          created_at: job.created_at || new Date().toISOString(),
          requirements: job.requirements || [],
          benefits: job.benefits || []
        }));

        this.currentPage = metaData.current_page;
        this.totalPages = metaData.last_page;
        this.filters = { ...this.filters, ...filters };

        return this.jobs;

      } catch (error) {
        this.error = error.message || 'Failed to fetch jobs';
        this.jobs = [];
        this.currentPage = 1;
        this.totalPages = 1;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch job by ID with proper data handling
    async fetchJobById(id) {
      if (!id) return null;
      
      this.loading = true;
      try {
        const response = await jobsApi.getJob(id);
        const job = response.data.data; // The job data is nested under 'data' key
        
        if (!job) {
          throw new Error('Job not found');
        }

        // Normalize job data
        this.currentJob = {
          ...job,
          requirements: Array.isArray(job.requirements) ? job.requirements : 
                       typeof job.requirements === 'string' ? job.requirements.split('\n').filter(item => item.trim()) : [],
          responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities :
                          typeof job.responsibilities === 'string' ? job.responsibilities.split('\n').filter(item => item.trim()) : [],
          type: job.type || 'Not specified',
          salary: job.salary || null,
          location: job.location || 'Location not specified',
          description: job.description || 'No description available',
          created_at: job.created_at || new Date().toISOString()
        };

        this.error = null;
        return this.currentJob;
      } catch (error) {
        this.error = error.message || 'Failed to fetch job details';
        this.currentJob = null;
        throw error;
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
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});

function handleApiError(error) {
  // Implement error handling logic here
  return error.message;
}
