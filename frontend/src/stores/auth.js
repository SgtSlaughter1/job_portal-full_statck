import { defineStore } from 'pinia';
import { authApi } from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
        userType: localStorage.getItem('userType') || null // 'employer' or 'jobseeker'
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
        isEmployer: (state) => state.userType === 'employer',
        isJobSeeker: (state) => state.userType === 'jobseeker'
    },

    actions: {
        // Employer registration
        async registerEmployer(employerData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.employerRegister(employerData);
                this.token = response.data.token;
                this.user = response.data.employer;
                this.userType = 'employer';
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('userType', 'employer');
                
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Employer registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Job seeker registration
        async registerJobSeeker(jobSeekerData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.jobSeekerRegister(jobSeekerData);
                this.token = response.data.token;
                this.user = response.data.job_seeker;
                this.userType = 'jobseeker';
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('userType', 'jobseeker');
                
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Job seeker registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Employer login
        async employerLogin(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.employerLogin(credentials);
                this.token = response.data.token;
                this.user = response.data.employer;
                this.userType = 'employer';
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('userType', 'employer');
                
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Employer login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Job seeker login
        async jobSeekerLogin(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.jobSeekerLogin(credentials);
                this.token = response.data.token;
                this.user = response.data.job_seeker;
                this.userType = 'jobseeker';
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                localStorage.setItem('userType', 'jobseeker');
                
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Job seeker login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            try {
                await authApi.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.token = null;
                this.user = null;
                this.userType = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                this.loading = false;
            }
        },

        async fetchUser() {
            if (!this.token) return;
            
            this.loading = true;
            try {
                const response = await authApi.getUser();
                this.user = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to fetch user';
                if (error.response?.status === 401) {
                    this.token = null;
                    this.user = null;
                    this.userType = null;
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userType');
                }
            } finally {
                this.loading = false;
            }
        },

        clearError() {
            this.error = null;
        }
    }
});
