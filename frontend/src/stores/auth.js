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
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null,
        userType: localStorage.getItem('userType')
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
        // Job seeker login
        async jobSeekerLogin(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.jobSeekerLogin(credentials);
                
                if (!response.data?.token || !response.data?.job_seeker) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, job_seeker } = response.data;
                
                // Only store essential data
                this.token = token;
                this.userType = 'jobseeker';
                
                // Store minimal data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userType', 'jobseeker');

                // Set user data in state only (not in localStorage)
                this.user = {
                    id: job_seeker.id,
                    name: job_seeker.name,
                    email: job_seeker.email
                };
                
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

        // Fetch user data from API
        async fetchUser() {
            if (!this.token) return;
            
            this.loading = true;
            try {
                const response = await authApi.getUser();
                const userData = response.data.data;

                // Store minimal user data in state
                this.user = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    // Add only essential fields needed for UI
                    userType: this.userType
                };
                
                return this.user;
            } catch (error) {
                const { message } = handleApiError(error);
                this.error = message;
                
                if (error.response?.status === 401) {
                    await this.logout();
                }
                
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Add back the logout action
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

        // Add back initializeAuth
        async initializeAuth() {
            try {
                const token = localStorage.getItem('token');
                const userType = localStorage.getItem('userType');
                
                if (token && userType) {
                    this.token = token;
                    this.userType = userType;
                    await this.fetchUser();
                } else {
                    this.clearAuth();
                }
            } catch (error) {
                console.error('Error initializing auth state:', error);
                this.clearAuth();
            }
        },

        clearAuth() {
            this.token = null;
            this.user = null;
            this.userType = null;
            this.error = null;
            
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
        },

        // Add back clearError
        clearError() {
            this.error = null;
        }
    }
});
