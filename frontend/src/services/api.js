import axios from 'axios';

const API_URL = 'http://localhost:8000/api/jobs'; 

export const getJobs = () => {
    return axios.get(API_URL);
};

export const getJobById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createJob = (jobData) => {
    return axios.post(API_URL, jobData);
};

export const updateJob = (id, jobData) => {
    return axios.put(`${API_URL}/${id}`, jobData);
};

export const deleteJob = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};