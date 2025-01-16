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
        token: null,
        loading: false,
        error: null,
        userType: null
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
                
                // Store essential data
                this.setAuthData(token, job_seeker, 'jobseeker');
                router.push({ name: 'Profile' });
                
                return response.data;
            } catch (error) {
                this.error = handleApiError(error);
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
                
                if (!response.data?.token || !response.data?.employer) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, employer } = response.data;
                
                // Store essential data
                this.setAuthData(token, employer, 'employer');
                router.push({ name: 'Profile' });
                
                return response.data;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Job seeker registration
        async registerJobSeeker(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.jobSeekerRegister(data);
                
                if (!response.data?.token || !response.data?.job_seeker) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, job_seeker } = response.data;
                this.setAuthData(token, job_seeker, 'jobseeker');
                router.push({ name: 'Profile' });
                return response.data;
            } catch (error) {
                console.error('Registration error:', error.response?.data || error);
                this.error = error.response?.data?.message || 'Registration failed. Please try again.';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Employer registration
        async registerEmployer(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.employerRegister(data);
                
                if (!response.data?.token || !response.data?.employer) {
                    throw new Error('Invalid response structure from server');
                }
                
                const { token, employer } = response.data;
                this.setAuthData(token, employer, 'employer');
                router.push({ name: 'Profile' });
                return response.data;
            } catch (error) {
                console.error('Registration error:', error.response?.data || error);
                this.error = error.response?.data?.message || 'Registration failed. Please try again.';
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

        // Clear auth data
        clearAuth() {
            this.user = null;
            this.token = null;
            this.userType = null;
            this.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            router.push({ name: 'Home' });
        },

        // Logout action
        async logout() {
            try {
                // Call logout endpoint if needed
                await authApi.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
            }
        },

        // Set auth data
        setAuthData(token, user, type) {
            this.token = token;
            this.user = user;
            this.userType = type;
            this.error = null;
            localStorage.setItem('token', token);
            localStorage.setItem('userType', type);
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

        // Add back clearError
        clearError() {
            this.error = null;
        },

        // Update profile
        async updateProfile(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.updateProfile(data);
                this.user = response.data;
                return response.data;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Alias methods for profile updates
        updateJobSeekerProfile(data) {
            return this.updateProfile(data);
        },

        updateEmployerProfile(data) {
            return this.updateProfile(data);
        },
    }
});
