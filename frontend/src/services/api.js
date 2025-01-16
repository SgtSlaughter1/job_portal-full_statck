import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
}, error => {
        return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear auth data on 401 responses
                    localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API service
export const authApi = {
    // Employer endpoints
    employerLogin: (credentials) => api.post('/employer/login', credentials),
    employerRegister: (data) => api.post('/employer/register', data),
    
    // Job seeker endpoints
    jobSeekerLogin: (credentials) => api.post('/jobseeker/login', credentials),
    jobSeekerRegister: (data) => api.post('/jobseeker/register', data),
    
    // User profile endpoints - will use the correct endpoint based on user type
    getUser: () => {
        const userType = localStorage.getItem('userType');
        return api.get(`/${userType}/profile`);
    },
    updateProfile: (data) => {
        const userType = localStorage.getItem('userType');
        return api.post(`/${userType}/profile`, data);
    },
    
    // Common endpoints
    logout: () => api.post('/logout'),
    refreshToken: () => api.post('/refresh-token')
};

// Jobs API service
export const jobsApi = {
    // Public endpoints
    getJobs: (params = {}) => api.get('/jobs', { params }),
    getAllJobs: () => api.get('/jobs'),
    getJob: (id) => api.get(`/jobs/${id}`),
    searchJobs: (query) => api.get('/jobs/search', { params: { query } }),
    
    // Protected endpoints
    createJob: (data) => api.post('/jobs', data),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/jobs/${id}`),
    
    // Job categories and filters
    getCategories: () => api.get('/jobs/categories'),
    getLocations: () => api.get('/jobs/locations'),
    getTypes: () => api.get('/jobs/types'),
};

// Employer API service
export const employerApi = {
    // Profile endpoints
    getProfile: () => api.get('/employer/profile'),
    updateProfile: (data) => api.post('/employer/profile', data),
    
    // Dashboard endpoints
    getDashboard: () => api.get('/employer/dashboard'),
    
    // Applications endpoints
    getApplications: () => api.get('/employer/applications'),
    updateApplication: (id, data) => api.put(`/employer/applications/${id}`, data),
};

// Job Seeker API service
export const jobSeekerApi = {
    // Profile endpoints
    getProfile: () => api.get('/jobseeker/profile'),
    updateProfile: (data) => api.post('/jobseeker/profile', data),
    
    // Dashboard endpoints
    getDashboard: () => api.get('/jobseeker/dashboard'),
    
    // Applications endpoints
    getApplications: () => api.get('/jobseeker/applications'),
    applyForJob: (jobId, data) => api.post(`/jobseeker/jobs/${jobId}/apply`, data),
    withdrawApplication: (id) => api.delete(`/jobseeker/applications/${id}`),
    
    // Saved jobs endpoints
    getSavedJobs: () => api.get('/jobseeker/saved-jobs'),
    saveJob: (jobId) => api.post(`/jobseeker/saved-jobs/${jobId}`),
    unsaveJob: (jobId) => api.delete(`/jobseeker/saved-jobs/${jobId}`),
};

// Error handler helper
export const handleApiError = (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    const errors = error.response?.data?.errors || {};
    return { message, errors };
};

export default api;