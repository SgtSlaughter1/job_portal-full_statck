// // User Profile Store for managing user profile state and actions
// import { defineStore } from 'pinia'
// import axios from 'axios'

// const API_URL = 'http://localhost:8000/api'

// export const useUserProfileStore = defineStore('userProfile', {
//   state: () => ({
//     user: {
//       name: '',
//       email: '',
//       joinedDate: '',
//       role: ''
//     },
//     companyDetails: {
//       name: '',
//       email: '',
//       phone: '',
//       companySize: '',
//       industry: '',
//       location: ''
//     },
//     userDetails: {
//       experience: '',
//       skills: [],
//       phone: ''
//     },
//     applications: [],
//     jobSeekers: [],
//     isLoading: false,
//     error: null
//   }),

//   actions: {
//     // Set auth token for API requests
//     setAuthHeader() {
//       const token = localStorage.getItem('token')
//       if (token) {
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       }
//     },

//     // Load user profile from API
//     async loadProfile() {
//       try {
//         this.isLoading = true
//         this.setAuthHeader()
        
//         const userRole = localStorage.getItem('userRole')
//         const endpoint = userRole === 'employer' ? '/employer/profile' : '/jobseeker/profile'
        
//         const response = await axios.get(`${API_URL}${endpoint}`)
//         const profileData = response.data

//         this.user.role = userRole

//         if (userRole === 'employer') {
//           this.companyDetails = {
//             name: profileData.company_name,
//             email: profileData.email,
//             phone: profileData.phone,
//             companySize: profileData.company_size,
//             industry: profileData.industry,
//             location: profileData.location
//           }
//           // Load job applications for employer
//           const applicationsResponse = await axios.get(`${API_URL}/employer/applications`)
//           this.jobSeekers = applicationsResponse.data
//         } else {
//           this.userDetails = {
//             experience: profileData.experience,
//             skills: profileData.skills ? profileData.skills.split(',').map(skill => skill.trim()) : [],
//             phone: profileData.phone
//           }
//           // Load job applications for job seeker
//           const applicationsResponse = await axios.get(`${API_URL}/jobseeker/applications`)
//           this.applications = applicationsResponse.data
//         }
//       } catch (error) {
//         this.error = error.response?.data?.message || 'Failed to load profile'
//         throw error
//       } finally {
//         this.isLoading = false
//       }
//     },

//     // Update user profile
//     async updateProfile(profileData) {
//       try {
//         this.isLoading = true
//         this.setAuthHeader()
        
//         const userRole = localStorage.getItem('userRole')
//         const endpoint = userRole === 'employer' 
//           ? '/employer/profile/update'
//           : '/jobseeker/profile/update'

//         const response = await axios.put(`${API_URL}${endpoint}`, profileData)
//         await this.loadProfile()
//         return response.data
//       } catch (error) {
//         this.error = error.response?.data?.message || 'Failed to update profile'
//         throw error
//       } finally {
//         this.isLoading = false
//       }
//     },

//     // Delete user profile
//     async deleteProfile() {
//       try {
//         this.isLoading = true
//         this.setAuthHeader()
        
//         const userRole = localStorage.getItem('userRole')
//         const endpoint = userRole === 'employer' 
//           ? '/employer/profile/delete'
//           : '/jobseeker/profile/delete'

//         await axios.delete(`${API_URL}${endpoint}`)
//         localStorage.removeItem('token')
//         localStorage.removeItem('userRole')
//         return true
//       } catch (error) {
//         this.error = error.response?.data?.message || 'Failed to delete profile'
//         return false
//       } finally {
//         this.isLoading = false
//       }
//     }
//   }
// })
