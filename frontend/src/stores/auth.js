// Auth store for managing authentication state
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
                const data = response.data?.data || response.data;
                
                if (!data?.token || !data?.job_seeker) {
                    throw new Error('Invalid response structure from server');
                }
                
                // Store essential data
                this.setAuthData(data.token, data.job_seeker, 'jobseeker');
                router.push({ name: 'Profile' });
                
                return data;
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
                const data = response.data?.data || response.data;
                
                if (!data?.token || !data?.employer) {
                    throw new Error('Invalid response structure from server');
                }
                
                // Store essential data
                this.setAuthData(data.token, data.employer, 'employer');
                router.push({ name: 'Profile' });
                
                return data;
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
                const responseData = response.data?.data || response.data;
                
                if (!responseData?.token || !responseData?.job_seeker) {
                    throw new Error('Invalid response structure from server');
                }
                
                // Clear auth data and redirect to login
                this.clearAuth();
                router.push({ 
                    name: 'Login',
                    query: { 
                        message: 'Registration successful! Please login to continue.',
                        type: 'success'
                    }
                });
                
                return responseData;
            } catch (error) {
                this.error = handleApiError(error);
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
                const responseData = response.data?.data || response.data;
                
                if (!responseData?.token || !responseData?.employer) {
                    throw new Error('Invalid response structure from server');
                }
                
                // Clear auth data and redirect to login
                this.clearAuth();
                router.push({ 
                    name: 'Login',
                    query: { 
                        message: 'Registration successful! Please login to continue.',
                        type: 'success'
                    }
                });
                
                return responseData;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Fetch user data from API
        async fetchUser() {
            if (!this.token) return null;
            
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.getUser();
                const data = response.data?.data || response.data;
                
                if (!data) {
                    throw new Error('Invalid response structure from server');
                }
                
                this.user = data;
                return data;
            } catch (error) {
                this.error = handleApiError(error);
                this.clearAuth();
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
        },

        // Logout action
        async logout() {
            this.loading = true;
            try {
                await authApi.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.clearAuth();
                this.loading = false;
                router.push({ name: 'Login' });
            }
        },

        // Set auth data
        setAuthData(token, user, type) {
            this.token = token;
            this.user = user;
            this.userType = type;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userType', type);
        },

        // Initialize auth state
        initializeAuth() {
            const token = localStorage.getItem('token');
            const user = safeJSONParse('user');
            const userType = localStorage.getItem('userType');

            if (token && user && userType) {
                this.token = token;
                this.user = user;
                this.userType = userType;
                return true;
            }
            return false;
        },

        // Clear error
        clearError() {
            this.error = null;
        },

        // Update profile
        async updateProfile(data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.updateProfile(data);
                const responseData = response.data?.data || response.data;
                
                if (!responseData) {
                    throw new Error('Invalid response structure from server');
                }
                
                this.user = responseData;
                localStorage.setItem('user', JSON.stringify(responseData));
                return responseData;
            } catch (error) {
                this.error = handleApiError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
