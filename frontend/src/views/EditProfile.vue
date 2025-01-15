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
                  <label for="education_level" class="form-label">Education Level</label>
                  <select class="form-select" id="education_level" v-model="formData.education_level">
                    <option value="">Select education level</option>
                    <option value="high_school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="experience_years" class="form-label">Years of Experience</label>
                  <input
                    type="number"
                    class="form-control"
                    id="experience_years"
                    v-model="formData.experience_years"
                    min="0"
                  >
                </div>

                <div class="mb-3">
                  <label for="current_position" class="form-label">Current Position</label>
                  <input
                    type="text"
                    class="form-control"
                    id="current_position"
                    v-model="formData.current_position"
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

                <div class="mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="is_available"
                      v-model="formData.is_available"
                    >
                    <label class="form-check-label" for="is_available">
                      Available for hire
                    </label>
                  </div>
                </div>
              </template>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
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
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useEmployerStore } from '@/stores/employerStore';
import { useJobSeekerStore } from '@/stores/jobSeekerStore';

export default {
  name: 'EditProfile',
  
  setup() {
    const authStore = useAuthStore();
    const employerStore = useEmployerStore();
    const jobSeekerStore = useJobSeekerStore();
    
    const error = ref('');
    const successMessage = ref('');
    const isLoading = ref(false);
    
    const isEmployer = computed(() => authStore.userType === 'employer');
    const store = computed(() => isEmployer.value ? employerStore : jobSeekerStore);

    const formData = ref({
      name: '',
      email: '',
      phone: '',
      // Employer fields
      company_name: '',
      industry: '',
      company_size: '',
      company_description: '',
      // Job seeker fields
      skills: '',
      education_level: '',
      experience_years: '',
      current_position: '',
      is_available: false
    });

    const handleFileUpload = (event) => {
      formData.value.resume = event.target.files[0];
    };

    const loadProfile = async () => {
      try {
        isLoading.value = true;
        const profile = await store.value.fetchProfile();
        
        // Update form data based on user type
        if (isEmployer.value) {
          Object.assign(formData.value, {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            company_name: profile.company_name,
            industry: profile.industry,
            company_size: profile.company_size,
            company_description: profile.company_description
          });
        } else {
          Object.assign(formData.value, {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills,
            education_level: profile.education_level,
            experience_years: profile.experience_years,
            current_position: profile.current_position,
            is_available: profile.is_available
          });
        }
      } catch (err) {
        error.value = 'Failed to load profile data';
      } finally {
        isLoading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        successMessage.value = '';

        const data = { ...formData.value };
        
        // Format data based on user type
        if (!isEmployer.value) {
          data.skills = data.skills.split(',').map(skill => skill.trim());
        }

        // Update profile
        await store.value.updateProfile(data);
        successMessage.value = 'Profile updated successfully!';
      } catch (err) {
        error.value = err.message || 'Failed to update profile. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(loadProfile);

    return {
      formData,
      error,
      successMessage,
      isLoading,
      isEmployer,
      handleSubmit,
      handleFileUpload
    };
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
