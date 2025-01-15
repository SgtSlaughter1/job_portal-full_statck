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
                  placeholder="Describe the role, responsibilities, and requirements"
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
                  <option value="internship">Internship</option>
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

              <!-- Salary Range -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="min_salary" class="form-label">Minimum Salary</label>
                  <input
                    type="number"
                    class="form-control"
                    id="min_salary"
                    v-model="formData.min_salary"
                    placeholder="e.g., 50000"
                  >
                </div>
                <div class="col-md-6">
                  <label for="max_salary" class="form-label">Maximum Salary</label>
                  <input
                    type="number"
                    class="form-control"
                    id="max_salary"
                    v-model="formData.max_salary"
                    placeholder="e.g., 80000"
                  >
                </div>
              </div>

              <!-- Required Skills -->
              <div class="mb-3">
                <label for="required_skills" class="form-label">Required Skills</label>
                <textarea
                  class="form-control"
                  id="required_skills"
                  v-model="formData.required_skills"
                  rows="3"
                  placeholder="List the required skills (comma separated)"
                ></textarea>
              </div>

              <!-- Experience Level -->
              <div class="mb-3">
                <label for="experience_level" class="form-label">Experience Level*</label>
                <select class="form-select" id="experience_level" v-model="formData.experience_level" required>
                  <option value="">Select experience level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>

              <!-- Deadline -->
              <div class="mb-3">
                <label for="deadline" class="form-label">Application Deadline</label>
                <input
                  type="date"
                  class="form-control"
                  id="deadline"
                  v-model="formData.deadline"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEmployerStore } from '@/stores/employerStore';

export default {
  name: 'PostJob',
  
  setup() {
    const router = useRouter();
    const employerStore = useEmployerStore();
    const error = ref('');
    const successMessage = ref('');
    const isLoading = ref(false);

    const formData = ref({
      title: '',
      description: '',
      type: '',
      location: '',
      min_salary: '',
      max_salary: '',
      required_skills: '',
      experience_level: '',
      deadline: ''
    });

    const handleSubmit = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        successMessage.value = '';

        // Format skills as array if provided
        const jobData = {
          ...formData.value,
          required_skills: formData.value.required_skills
            ? formData.value.required_skills.split(',').map(skill => skill.trim())
            : []
        };

        // Create job
        const result = await employerStore.createJob(jobData);
        
        successMessage.value = 'Job posted successfully!';
        
        // Reset form
        formData.value = {
          title: '',
          description: '',
          type: '',
          location: '',
          min_salary: '',
          max_salary: '',
          required_skills: '',
          experience_level: '',
          deadline: ''
        };

        // Redirect to jobs list after a short delay
        setTimeout(() => {
          router.push('/jobs');
        }, 2000);

      } catch (err) {
        error.value = err.message || 'Failed to post job. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      error,
      successMessage,
      isLoading,
      handleSubmit
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
