<template>
    <div class="container my-5">
        <!-- Loading State -->
        <div v-if="jobStore.isLoading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="jobStore.hasError" class="alert alert-danger" role="alert">
            {{ jobStore.hasError }}
        </div>

        <!-- Application Form -->
        <div v-else class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Job Application</h2>
                        
                        <!-- Job Details Summary -->
                        <div class="mb-4 p-3 bg-light rounded">
                            <h5 class="mb-3">{{ job?.title }}</h5>
                            <p class="mb-2"><strong>Company:</strong> {{ job?.employer?.company_name }}</p>
                            <p class="mb-0"><strong>Location:</strong> {{ job?.location }}</p>
                        </div>

                        <form @submit.prevent="submitApplication" class="needs-validation" novalidate>
                            <!-- Personal Information -->
                            <h5 class="mb-3">Personal Information</h5>
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label for="firstName" class="form-label">First Name</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="firstName"
                                        v-model="formData.firstName"
                                        required
                                    >
                                </div>
                                <div class="col-md-6">
                                    <label for="lastName" class="form-label">Last Name</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="lastName"
                                        v-model="formData.lastName"
                                        required
                                    >
                                </div>
                                <div class="col-12">
                                    <label for="email" class="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="email"
                                        v-model="formData.email"
                                        required
                                    >
                                </div>
                                <div class="col-12">
                                    <label for="phone" class="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        class="form-control" 
                                        id="phone"
                                        v-model="formData.phone"
                                        required
                                    >
                                </div>
                            </div>

                            <!-- Professional Information -->
                            <h5 class="mb-3">Professional Information</h5>
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
                                <div class="form-text">Accepted formats: PDF, DOC, DOCX</div>
                            </div>

                            <div class="mb-4">
                                <label for="coverLetter" class="form-label">Cover Letter</label>
                                <textarea 
                                    class="form-control" 
                                    id="coverLetter"
                                    v-model="formData.coverLetter"
                                    rows="5"
                                    required
                                ></textarea>
                            </div>

                            <div class="mb-4">
                                <label for="experience" class="form-label">Years of Experience</label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    id="experience"
                                    v-model="formData.experience"
                                    min="0"
                                    required
                                >
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
import { useJobStore } from '@/stores/jobs';
import SuccessModal from '@/components/SuccessModal.vue';

export default {
    name: 'ApplicationForm',
    
    components: {
        SuccessModal
    },

    props: {
        id: {
            type: [Number, String],
            required: true
        }
    },

    data() {
        return {
            jobStore: useJobStore(),
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                resume: null,
                coverLetter: '',
                experience: 0
            },
            isSubmitting: false,
            showSuccessModal: false
        };
    },

    computed: {
        job() {
            return this.jobStore.getCurrentJob;
        }
    },

    methods: {
        handleFileUpload(event) {
            this.formData.resume = event.target.files[0];
        },

        async submitApplication() {
            try {
                this.isSubmitting = true;
                
                // Create form data for file upload
                const formData = new FormData();
                Object.keys(this.formData).forEach(key => {
                    formData.append(key, this.formData[key]);
                });
                
                // Add job ID to form data
                formData.append('jobId', this.id);

                // Submit application
                await this.jobStore.submitApplication(formData);
                
                // Show success modal
                this.showSuccessModal = true;
                
                // Reset form
                this.formData = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    resume: null,
                    coverLetter: '',
                    experience: 0
                };
            } catch (error) {
                console.error('Error submitting application:', error);
                // Show error message
                alert(error.message || 'Failed to submit application. Please try again.');
            } finally {
                this.isSubmitting = false;
            }
        },

        handleModalClose() {
            this.showSuccessModal = false;
            this.$router.push('/jobs');
        }
    },

    async mounted() {
        if (!this.job) {
            await this.jobStore.fetchJobById(this.id);
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 0.5rem;
}

.form-control:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
</style>