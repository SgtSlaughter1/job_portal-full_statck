import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor for auth
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 422:
                    // Validation error
                    console.error('Validation failed:', error.response.data.errors);
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

// Jobs API
export const jobsApi = {
    getJobs: (queryString = '') => api.get(`/jobs${queryString ? '?' + queryString : ''}`),
    getJobById: (id) => {
        if (!id) throw new Error('Job ID is required');
        return api.get(`/jobs/${id}`);
    },
    createJob: (jobData) => api.post('/jobs', jobData),
    updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
    deleteJob: (id) => api.delete(`/jobs/${id}`),
    applyForJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData)
};

// Auth API
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getUser: () => api.get('/auth/user')
};

// Profile API
export const profileApi = {
    updateProfile: (userData) => api.put('/profile', userData),
    updatePassword: (passwordData) => api.put('/profile/password', passwordData)
};

export default api;