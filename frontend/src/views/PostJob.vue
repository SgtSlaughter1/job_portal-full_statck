<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">Post a New Job</h3>
          </div>
          <div class="card-body">
            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit">
              <!-- Job Title -->
              <div class="mb-3">
                <label for="title" class="form-label">Job Title*</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="formData.title"
                  required
                  placeholder="e.g., Senior Software Engineer"
                >
              </div>

              <!-- Job Description -->
              <div class="mb-3">
                <label for="description" class="form-label">Job Description*</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="formData.description"
                  rows="5"
                  required
                  placeholder="Describe the role and company"
                ></textarea>
              </div>

              <!-- Job Type -->
              <div class="mb-3">
                <label for="type" class="form-label">Job Type*</label>
                <select class="form-select" id="type" v-model="formData.type" required>
                  <option value="">Select job type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <!-- Location -->
              <div class="mb-3">
                <label for="location" class="form-label">Location*</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  v-model="formData.location"
                  required
                  placeholder="e.g., New York, NY or Remote"
                >
              </div>

              <!-- Salary -->
              <div class="mb-3">
                <label for="salary" class="form-label">Salary</label>
                <input
                  type="number"
                  class="form-control"
                  id="salary"
                  v-model="formData.salary"
                  placeholder="e.g., 75000"
                >
              </div>

              <!-- Experience Level -->
              <div class="mb-3">
                <label for="experience_level" class="form-label">Experience Level*</label>
                <select class="form-select" id="experience_level" v-model="formData.experience_level" required>
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                </select>
              </div>

              <!-- Requirements -->
              <div class="mb-3">
                <label for="requirements" class="form-label">Requirements*</label>
                <div v-for="(req, index) in formData.requirements" :key="index" class="d-flex mb-2">
                  <input
                    type="text"
                    class="form-control me-2"
                    v-model="formData.requirements[index]"
                    placeholder="Add a requirement"
                  >
                  <button type="button" class="btn btn-danger" @click="removeRequirement(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-secondary" @click="addRequirement">
                  Add Requirement
                </button>
              </div>

              <!-- Responsibilities -->
              <div class="mb-3">
                <label for="responsibilities" class="form-label">Responsibilities*</label>
                <div v-for="(resp, index) in formData.responsibilities" :key="index" class="d-flex mb-2">
                  <input
                    type="text"
                    class="form-control me-2"
                    v-model="formData.responsibilities[index]"
                    placeholder="Add a responsibility"
                  >
                  <button type="button" class="btn btn-danger" @click="removeResponsibility(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-secondary" @click="addResponsibility">
                  Add Responsibility
                </button>
              </div>

              <!-- Deadline -->
              <div class="mb-3">
                <label for="deadline" class="form-label">Application Deadline*</label>
                <input
                  type="date"
                  class="form-control"
                  id="deadline"
                  v-model="formData.deadline"
                  required
                >
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Posting...' : 'Post Job' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <SuccessModal
    :show="showSuccessModal"
    type="job-post"
    @close="handleSuccessModalClose"
    @secondary-action="handlePostAnother"
  />
</template>

<script>
import { useEmployerStore } from '@/stores/employerStore';
import { useAuthStore } from '@/stores/auth';
import SuccessModal from '@/components/SuccessModal.vue';

export default {
  name: 'PostJob',
  components: {
    SuccessModal
  },

  data() {
    const employerStore = useEmployerStore();
    const authStore = useAuthStore();

    return {
      employerStore,
      authStore,
      error: '',
      isLoading: false,
      showSuccessModal: false,
      createdJobId: null,
      formData: {
        title: '',
        description: '',
        type: '',
        location: '',
        salary: null,
        experience_level: '',
        requirements: [''],
        responsibilities: [''],
        deadline: '',
        is_active: true
      }
    };
  },

  // Check authentication and authorization
  created() {
    if (!this.authStore.isAuthenticated) {
      this.$router.push({ 
        path: '/login',
        query: { redirect: '/jobs/post' }
      });
    } else if (!this.authStore.isEmployer) {
      this.$router.push('/unauthorized');
    }
  },

  methods: {
    // Add a new requirement field
    addRequirement() {
      this.formData.requirements.push('');
    },

    // Remove a requirement field at specified index
    removeRequirement(index) {
      this.formData.requirements.splice(index, 1);
    },

    // Add a new responsibility field
    addResponsibility() {
      this.formData.responsibilities.push('');
    },

    // Remove a responsibility field at specified index
    removeResponsibility(index) {
      this.formData.responsibilities.splice(index, 1);
    },

    // Reset form to initial state
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        type: '',
        location: '',
        salary: null,
        experience_level: '',
        requirements: [''],
        responsibilities: [''],
        deadline: '',
        is_active: true
      };
      this.error = '';
    },

    // Handle form submission
    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = '';

        // Format job data
        const jobData = {
          ...this.formData,
          requirements: this.formData.requirements.filter(req => req.trim()),
          responsibilities: this.formData.responsibilities.filter(resp => resp.trim()),
          salary: this.formData.salary ? parseInt(this.formData.salary) : null
        };

        // Create job using store
        const response = await this.employerStore.createJob(jobData);
        this.createdJobId = response.id;
        this.showSuccessModal = true;

      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create job. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    // Handle success modal close
    handleSuccessModalClose() {
      this.showSuccessModal = false;
      if (this.createdJobId) {
        this.$router.push(`/jobs/${this.createdJobId}`);
      }
    },

    // Handle post another job action
    handlePostAnother() {
      this.showSuccessModal = false;
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: none;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 500;
}

.btn-danger {
  padding: 0.5rem;
}

.btn-secondary {
  margin-top: 0.5rem;
}

.invalid-feedback {
  font-size: 0.875rem;
}
</style>
