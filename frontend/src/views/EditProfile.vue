<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">Edit Profile</h3>
          </div>
          <div class="card-body">
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Common Fields -->
              <div class="mb-3">
                <label for="name" class="form-label">Name*</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="formData.name"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email*</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phone"
                  v-model="formData.phone"
                >
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  v-model="formData.address"
                >
              </div>

              <div class="mb-3">
                <label for="bio" class="form-label">Bio</label>
                <textarea
                  class="form-control"
                  id="bio"
                  v-model="formData.bio"
                  rows="4"
                ></textarea>
              </div>

              <!-- Employer-specific fields -->
              <template v-if="isEmployer">
                <div class="mb-3">
                  <label for="company_name" class="form-label">Company Name*</label>
                  <input
                    type="text"
                    class="form-control"
                    id="company_name"
                    v-model="formData.company_name"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="company_website" class="form-label">Company Website</label>
                  <input
                    type="text"
                    class="form-control"
                    id="company_website"
                    v-model="formData.company_website"
                  >
                </div>

                <div class="mb-3">
                  <label for="industry" class="form-label">Industry*</label>
                  <input
                    type="text"
                    class="form-control"
                    id="industry"
                    v-model="formData.industry"
                    required
                  >
                </div>

                <div class="mb-3">
                  <label for="company_size" class="form-label">Company Size</label>
                  <select class="form-select" id="company_size" v-model="formData.company_size">
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="company_description" class="form-label">Company Description</label>
                  <textarea
                    class="form-control"
                    id="company_description"
                    v-model="formData.company_description"
                    rows="4"
                  ></textarea>
                </div>
              </template>

              <!-- Job Seeker-specific fields -->
              <template v-else>
                <div class="mb-3">
                  <label for="skills" class="form-label">Skills</label>
                  <textarea
                    class="form-control"
                    id="skills"
                    v-model="formData.skills"
                    rows="3"
                    placeholder="Enter your skills (comma separated)"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="experience" class="form-label">Experience</label>
                  <input
                    type="text"
                    class="form-control"
                    id="experience"
                    v-model="formData.experience"
                  >
                </div>

                <div class="mb-3">
                  <label for="education" class="form-label">Education</label>
                  <input
                    type="text"
                    class="form-control"
                    id="education"
                    v-model="formData.education"
                  >
                </div>

                <div class="mb-3">
                  <label for="resume" class="form-label">Resume (PDF)</label>
                  <input
                    type="file"
                    class="form-control"
                    id="resume"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx"
                  >
                </div>
              </template>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'EditProfile',
  
  data() {
    const authStore = useAuthStore();
    const user = authStore.getUser;

    return {
      authStore,
      error: '',
      successMessage: '',
      isSubmitting: false,
      formData: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || '',
        // Job seeker specific fields
        skills: user?.skills || '',
        experience: user?.experience || '',
        education: user?.education || '',
        resume: null,
        // Employer specific fields
        company_name: user?.company_name || '',
        company_website: user?.company_website || '',
        industry: user?.industry || '',
        company_size: user?.company_size || '',
        company_description: user?.company_description || ''
      }
    };
  },

  computed: {
    isEmployer() {
      return this.authStore.isEmployer;
    },
    isJobSeeker() {
      return this.authStore.isJobSeeker;
    }
  },

  mounted() {
    this.loadUserData();
  },

  methods: {
    async loadUserData() {
      try {
        // Fetch fresh user data
        await this.authStore.fetchUser();
        const freshUser = this.authStore.getUser;
        
        // Update form data with fresh user data
        if (freshUser) {
          this.formData = {
            ...this.formData,
            name: freshUser.name || this.formData.name,
            email: freshUser.email || this.formData.email,
            phone: freshUser.phone || this.formData.phone,
            address: freshUser.address || this.formData.address,
            bio: freshUser.bio || this.formData.bio,
            // Job seeker specific fields
            skills: freshUser.skills || this.formData.skills,
            experience: freshUser.experience || this.formData.experience,
            education: freshUser.education || this.formData.education,
            // Employer specific fields
            company_name: freshUser.company_name || this.formData.company_name,
            company_website: freshUser.company_website || this.formData.company_website,
            industry: freshUser.industry || this.formData.industry,
            company_size: freshUser.company_size || this.formData.company_size,
            company_description: freshUser.company_description || this.formData.company_description
          };
        }
      } catch (err) {
        this.error = 'Failed to load user data';
      }
    },

    async handleSubmit() {
      try {
        this.isSubmitting = true;
        this.error = '';
        this.successMessage = '';

        // Create FormData for file upload
        const submitData = new FormData();
        Object.keys(this.formData).forEach(key => {
          if (this.formData[key] !== null) {
            submitData.append(key, this.formData[key]);
          }
        });

        // Update profile based on user type
        if (this.isEmployer) {
          await this.authStore.updateEmployerProfile(submitData);
        } else {
          await this.authStore.updateJobSeekerProfile(submitData);
        }

        this.successMessage = 'Profile updated successfully';
      } catch (err) {
        this.error = err.message || 'Failed to update profile';
      } finally {
        this.isSubmitting = false;
      }
    },

    handleFileUpload(event) {
      this.formData.resume = event.target.files[0];
    }
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.form-label {
  font-weight: 500;
}

.btn-primary {
  padding: 0.75rem;
}
</style>
