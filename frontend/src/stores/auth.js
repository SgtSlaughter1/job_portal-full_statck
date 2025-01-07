import { defineStore } from 'pinia';
import { authApi } from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUser: (state) => state.user,
        isLoading: (state) => state.loading,
        hasError: (state) => state.error
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.login(credentials);
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUser();
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authApi.register(userData);
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                await this.fetchUser();
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed';
                return false;
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
                localStorage.removeItem('token');
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
                    localStorage.removeItem('token');
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
