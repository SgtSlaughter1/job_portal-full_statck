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
        const endpoint = userType === 'employer' ? '/employer/profile' : '/jobseeker/profile';
        return api.get(endpoint);
    },
    
    updateProfile: (data) => {
        const userType = localStorage.getItem('userType');
        const endpoint = userType === 'employer' ? '/employer/profile' : '/jobseeker/profile';
        return api.post(endpoint, data);
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
    getTypes: () => api.get('/jobs/types')
};

// Employer API service
export const employerApi = {
    // Profile endpoints
    getProfile: () => api.get('/employer/profile'),
    updateProfile: (data) => api.post('/employer/profile', data),
    
    // Dashboard endpoints
    getDashboard: () => api.get('/employer/dashboard'),
    
    // Applications endpoints
    getApplications: () => api.get('/applications'),
    updateApplication: (id, data) => api.put(`/applications/${id}`, data),
    updateApplicationStatus: (applicationId, data) => {
        return api.patch(`/applications/${applicationId}/status`, data);
    }
};

// Job Seeker API service
export const jobSeekerApi = {
    // Profile endpoints
    getProfile: () => api.get('/jobseeker/profile'),
    updateProfile: (data) => api.post('/jobseeker/profile', data),
    
    // Dashboard endpoints
    getDashboard: () => api.get('/jobseeker/dashboard'),
    
    // Applications endpoints
    getApplications: (params = {}) => {
        return api.get('/applications', { 
            params,
            // Add more configuration for error handling
            transformResponse: [
                (data) => {
                    try {
                        const parsedData = JSON.parse(data);
                        
                        // Log full response for debugging
                        console.log('Applications API Response:', parsedData);

                        // More detailed error checking
                        if (parsedData.status !== 'success') {
                            // If there's an error message, throw it
                            throw new Error(
                                parsedData.message || 
                                parsedData.error_details || 
                                'Unknown error occurred while fetching applications'
                            );
                        }

                        return parsedData;
                    } catch (error) {
                        // Log the full error for debugging
                        console.error('Full Application Fetch Error:', error);
                        
                        // Rethrow with a more informative message
                        throw new Error(
                            error.message || 
                            'Unable to retrieve applications. Please check your connection and try again.'
                        );
                    }
                }
            ]
        });
    },
    applyForJob: (data) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return api.post('/applications', data, config);
    },
    withdrawApplication: (id) => api.delete(`/applications/${id}`),
    
    // Saved jobs endpoints
    getSavedJobs: () => api.get('/jobseeker/saved-jobs'),
    saveJob: (jobId) => api.post(`/jobseeker/saved-jobs/${jobId}`),
    unsaveJob: (jobId) => api.delete(`/jobseeker/saved-jobs/${jobId}`)
};

// Error handler helper
export const handleApiError = (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    const errors = error.response?.data?.errors || {};
    return { message, errors };
};

export default api;