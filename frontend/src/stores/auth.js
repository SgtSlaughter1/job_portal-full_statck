import { defineStore } from 'pinia';
import { authApi, handleApiError } from '@/services/api';
import router from '@/router';

// Helper function to safely parse JSON from localStorage
const safeJSONParse = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage:`, e);
        return null;
    }
};

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: safeJSONParse('user'),
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
                const { token, employer } = response.data;
                
                this.token = token;
                this.user = employer;
                this.userType = 'employer';
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(employer));
                localStorage.setItem('userType', 'employer');
                
                return true;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
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
                const { token, job_seeker } = response.data;
                
                this.token = token;
                this.user = job_seeker;
                this.userType = 'jobseeker';
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(job_seeker));
                localStorage.setItem('userType', 'jobseeker');
                
                return true;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
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
                
                // Check if response has the expected structure
                if (!response.data?.data?.token || !response.data?.data?.employer) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, employer } = response.data.data;
                
                this.token = token;
                this.user = employer;
                this.userType = 'employer';
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(employer));
                localStorage.setItem('userType', 'employer');
                
                await router.push('/dashboard');
                return response.data;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
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
                
                // Check if response has the expected structure
                if (!response.data?.token || !response.data?.job_seeker) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, job_seeker } = response.data;
                
                this.token = token;
                this.user = job_seeker;
                this.userType = 'jobseeker';
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(job_seeker));
                localStorage.setItem('userType', 'jobseeker');
                
                await router.push('/dashboard');
                return response.data;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Initialize auth state from localStorage
        initializeAuth() {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                const userType = localStorage.getItem('userType');
                
                if (token && userStr && userType) {
                    this.token = token;
                    this.user = JSON.parse(userStr);
                    this.userType = userType;
                } else {
                    // If any required auth data is missing, clear everything
                    this.clearAuth();
                }
            } catch (error) {
                console.error('Error initializing auth state:', error);
                this.clearAuth();
            }
        },

        // Clear all auth data
        clearAuth() {
            this.token = null;
            this.user = null;
            this.userType = null;
            this.error = null;
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
        },

        // Logout
        async logout() {
            try {
                if (this.token) {
                    await authApi.logout();
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
                await router.push('/login');
            }
        },

        // Fetch current user
        async fetchUser() {
            if (!this.token) return;
            
            this.loading = true;
            try {
                const response = await authApi.getUser();
                this.user = response.data.data;
                
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return this.user;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
                
                // If unauthorized, clear auth state
                if (error.response?.status === 401) {
                    await this.logout();
                }
                
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Clear error
        clearError() {
            this.error = null;
        }
    }
});
