// // Store for managing job applications
// import { defineStore } from 'pinia';
// import { api } from '@/services/api';
// import { useAuthStore } from './auth';

// export const useApplicationStore = defineStore('applications', {
//   state: () => ({
//     applications: [],
//     currentApplication: null,
//     loading: false,
//     error: null,
//     currentPage: 1,
//     totalPages: 1,
//     filters: {
//       status: '',
//       jobId: null
//     }
//   }),

//   getters: {
//     getApplications: (state) => state.applications,
//     getCurrentApplication: (state) => state.currentApplication,
//     isLoading: (state) => state.loading,
//     hasError: (state) => state.error,
//     getCurrentPage: (state) => state.currentPage,
//     getTotalPages: (state) => state.totalPages
//   },

//   actions: {
//     // Fetch all applications with optional filters
//     async fetchApplications(page = 1, filters = {}) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const params = {
//           page,
//           ...filters
//         };
//         const response = await api.get('/applications', { params });
//         this.applications = response.data.data;
//         this.currentPage = response.data.current_page;
//         this.totalPages = response.data.last_page;
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to fetch applications';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // Submit new application
//     async submitApplication(formData) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.post('/applications', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         return response.data;
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to submit application';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // Get application details
//     async fetchApplicationById(id) {
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.get(`/applications/${id}`);
//         this.currentApplication = response.data;
//         return response.data;
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to fetch application details';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // Update application status (employer only)
//     async updateApplicationStatus(id, status, notes = '') {
//       this.loading = true;
//       this.error = null;
//       try {
//         const response = await api.put(`/applications/${id}`, {
//           status,
//           employer_notes: notes
//         });
//         // Update application in list if exists
//         const index = this.applications.findIndex(app => app.id === id);
//         if (index !== -1) {
//           this.applications[index] = response.data;
//         }
//         return response.data;
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to update application';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // Delete application (job seeker only)
//     async deleteApplication(id) {
//       this.loading = true;
//       this.error = null;
//       try {
//         await api.delete(`/applications/${id}`);
//         // Remove from list if exists
//         this.applications = this.applications.filter(app => app.id !== id);
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to delete application';
//         throw error;
//       } finally {
//         this.loading = false;
//       }
//     },

//     // Reset store state
//     resetState() {
//       this.applications = [];
//       this.currentApplication = null;
//       this.loading = false;
//       this.error = null;
//       this.currentPage = 1;
//       this.totalPages = 1;
//       this.filters = {
//         status: '',
//         jobId: null
//       };
//     }
//   }
// });

