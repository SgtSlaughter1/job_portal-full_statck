<template>
    <div class="container my-5">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>

        <!-- Application Form -->
        <div v-else class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Job Application</h2>
                        
                        <!-- Job Details Summary -->
                        <div v-if="currentJob" class="mb-4 p-3 bg-light rounded">
                            <h5 class="mb-3">{{ currentJob.title }}</h5>
                            <p class="mb-2"><strong>Company:</strong> {{ currentJob.employer?.company_name }}</p>
                            <p class="mb-0"><strong>Location:</strong> {{ currentJob.location }}</p>
                        </div>

                        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                            <!-- Cover Letter -->
                            <div class="mb-4">
                                <label for="coverLetter" class="form-label">Cover Letter</label>
                                <textarea 
                                    class="form-control" 
                                    id="coverLetter"
                                    v-model="formData.cover_letter"
                                    rows="5"
                                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                                    required
                                ></textarea>
                                <div class="invalid-feedback">
                                    Please provide a cover letter.
                                </div>
                            </div>

                            <!-- Resume Upload -->
                            <div class="mb-4">
                                <label for="resume" class="form-label">Resume/CV</label>
                                <input 
                                    type="file" 
                                    class="form-control" 
                                    id="resume"
                                    @change="handleFileUpload"
                                    accept=".pdf,.doc,.docx"
                                    required
                                >
                                <div class="form-text">Accepted formats: PDF, DOC, DOCX (Max size: 2MB)</div>
                                <div class="invalid-feedback">
                                    Please upload your resume.
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid gap-2">
                                <button 
                                    type="submit" 
                                    class="btn btn-primary btn-lg"
                                    :disabled="isSubmitting"
                                >
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <SuccessModal 
            v-if="showSuccessModal"
            @close="handleModalClose"
            title="Application Submitted!"
            message="Your application has been successfully submitted. We will review it and get back to you soon."
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useJobStore } from '@/stores/jobs';
import { useApplicationStore } from '@/stores/applications';
import { useAuthStore } from '@/stores/auth';
import SuccessModal from '@/components/SuccessModal.vue';

// Job application form component for submitting job applications
export default defineComponent({
    name: 'ApplicationForm',
    
    components: {
        SuccessModal
    },

    props: {
        // Job ID for which the application is being submitted
        id: {
            type: String,
            required: true
        }
    },

    data: () => ({
        // Form data for job application
        formData: {
            cover_letter: '',
            resume: null,
        },
        showSuccessModal: false,
        isLoading: false,
        isSubmitting: false,
        errorMessage: null
    }),

    computed: {
        // Get current job details
        currentJob: () => useJobStore().getCurrentJob,
        
        // Check if there's an error
        hasError: function() {
            return !!this.errorMessage;
        }
    },

    created() {
        // Load job details when component is created
        this.loadJobDetails();
    },

    methods: {
        // Handle file upload for resume
        handleFileUpload(event) {
            this.formData.resume = event.target.files[0];
        },

        // Load job details from the store
        async loadJobDetails() {
            try {
                this.isLoading = true;
                const jobStore = useJobStore();
                await jobStore.fetchJobById(this.id);
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Failed to load job details';
            } finally {
                this.isLoading = false;
            }
        },

        // Handle form submission
        async handleSubmit() {
            try {
                this.isSubmitting = true;
                this.errorMessage = null;

                // Create FormData object for file upload
                const formData = new FormData();
                formData.append('job_id', this.id);
                formData.append('cover_letter', this.formData.cover_letter);
                formData.append('resume', this.formData.resume);

                // Submit application using the store
                const applicationStore = useApplicationStore();
                await applicationStore.submitApplication(formData);
                
                // Show success modal and reset form
                this.showSuccessModal = true;
                this.resetForm();
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Failed to submit application';
            } finally {
                this.isSubmitting = false;
            }
        },

        // Reset form after successful submission
        resetForm() {
            this.formData = {
                cover_letter: '',
                resume: null
            };
            
            // Reset file input
            const fileInput = document.getElementById('resume');
            if (fileInput) {
                fileInput.value = '';
            }
        },

        // Handle modal close and navigation
        handleModalClose() {
            this.showSuccessModal = false;
            this.$router.push('/dashboard');
        }
    }
});
</script>

<style scoped>
/* Card styling */
.card {
    border-radius: 1rem;
}

/* Form control focus state */
.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Submit button styling */
.btn-primary {
    padding: 0.75rem 1.5rem;
}
</style>