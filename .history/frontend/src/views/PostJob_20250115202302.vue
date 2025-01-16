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

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success" role="alert">
              {{ successMessage }}
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
</template>

<script>
import { useEmployerStore } from '@/stores/employerStore';

export default {
  name: 'PostJob',
  
  data() {
    return {
      employerStore: useEmployerStore(),
      error: '',
      successMessage: '',
      isLoading: false,
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

  methods: {
    addRequirement() {
      this.formData.requirements.push('');
    },

    removeRequirement(index) {
      this.formData.requirements.splice(index, 1);
    },

    addResponsibility() {
      this.formData.responsibilities.push('');
    },

    removeResponsibility(index) {
      this.formData.responsibilities.splice(index, 1);
    },

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
    },

    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = '';
        this.successMessage = '';

        const jobData = {
          ...this.formData,
          requirements: this.formData.requirements.filter(req => req.trim()),
          responsibilities: this.formData.responsibilities.filter(resp => resp.trim()),
          salary: this.formData.salary ? parseInt(this.formData.salary) : null
        };

        await this.employerStore.createJob(jobData);
        
        this.successMessage = 'Job posted successfully!';
        this.resetForm();

        // Redirect after success
        setTimeout(() => {
          this.$router.push('/jobs');
        }, 2000);

      } catch (err) {
        this.error = err.message || 'Failed to post job. Please try again.';
      } finally {
        this.isLoading = false;
      }
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
