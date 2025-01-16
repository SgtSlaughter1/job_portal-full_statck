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
                                <div class="col-12">
                                    <label for="name" class="form-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="name"
                                        v-model="formData.name"
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
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'ApplicationForm',
    
    components: {
        SuccessModal
    },

    props: {
        id: {
            type: String,
            required: true
        }
    },

    data() {
        const authStore = useAuthStore();
        const user = authStore.getUser;
        
        return {
            jobStore: useJobStore(),
            formData: {
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                coverLetter: '',
                resume: null,
                jobId: this.id
            },
            isSubmitting: false,
            showSuccessModal: false
        };
    },

    computed: {
        job() {
            return this.jobStore.getCurrentJob;
        },
        
        authStore() {
            return useAuthStore();
        },
        
        user() {
            return this.authStore.getUser;
        }
    },

    async created() {
        try {
            // Fetch job details
            await this.jobStore.fetchJobById(this.id);
            
            // Prefill data if user exists
            if (this.user) {
                this.formData = {
                    ...this.formData,
                    name: this.user.name || this.formData.name,
                    email: this.user.email || this.formData.email,
                    phone: this.user.phone || this.formData.phone
                };
            }
        } catch (error) {
            this.$router.push({ name: 'JobListings' });
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
                
                // Submit application
                await this.jobStore.submitApplication(formData);
                
                // Show success modal
                this.showSuccessModal = true;
                
                // Reset form
                this.formData = {
                    name: this.user?.name || '',
                    email: this.user?.email || '',
                    phone: this.user?.phone || '',
                    coverLetter: '',
                    resume: null,
                    jobId: this.id
                };

                await this.$router.push('/profile/applications');
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

    mounted() {
        // Check if user is authenticated and is a job seeker
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
            this.$router.push({
                path: '/auth/login',
                query: { redirect: `/jobs/${this.$route.params.id}/apply` }
            })
        } else if (!authStore.isJobSeeker) {
            this.$router.push('/unauthorized')
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