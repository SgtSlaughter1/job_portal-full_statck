<template>
    <div class="register-container">
        <!-- Add the SVG blob background -->
        <div class="blob-container">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="blobBg">
                <path
                    fill="#0d6efd"
                    d="M66.2,-49.1C81.5,-33.5,86.8,-6.2,79.8,15.6C72.7,37.5,53.3,53.9,30.9,65.1C8.5,76.2,-16.9,81.9,-36.2,73.3C-55.5,64.7,-68.8,41.7,-70.8,19.9C-72.8,-2,-63.6,-22.7,-49.9,-37.8C-36.2,-53,-18.1,-62.7,3.6,-65.6C25.4,-68.5,50.8,-64.6,66.2,-49.1Z"
                    transform="translate(100 100)"
                />
            </svg>
        </div>
        
        <div class="container my-3">
            <div class="row justify-content-center">
                <div class="col-md-8">

                    <div class="card border-0 shadow">
                        <div class="card-body p-4">
                            <h2 class="text-center mb-4">Create Account</h2>
                            
                            <!-- Error Alert -->
                            <div v-if="errors?.general" class="alert alert-danger">
                                {{ formatErrorMessage(errors.general) }}
                            </div>

                            <form @submit.prevent="handleSignup" class="needs-validation" novalidate>
                            
                                <!-- Common Fields -->
                                <div class="row g-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label" for="name" v-if="!isEmployer">
                                            Name <span class="text-danger">*</span>
                                        </label>
                                        <label class="form-label" for="company_name" v-else>
                                            Company Name <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-building" v-if="isEmployer"></i>
                                                <i class="bi bi-person" v-else></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                :id="isEmployer ? 'company_name' : 'name'"
                                                v-model="formData[isEmployer ? 'company_name' : 'name']"
                                                :placeholder="isEmployer ? 'Enter company name' : 'Enter name'"
                                                required
                                                :class="{ 'is-invalid': errors?.[isEmployer ? 'company_name' : 'name'] }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.[isEmployer ? 'company_name' : 'name']">
                                                {{ formatErrorMessage(errors[isEmployer ? 'company_name' : 'name']) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="email">
                                            Email Address <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-envelope"></i>
                                            </span>
                                            <input 
                                                type="email" 
                                                class="form-control" 
                                                id="email" 
                                                v-model="formData.email"
                                                placeholder="Enter email address"
                                                required
                                                :class="{ 'is-invalid': errors?.email }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.email">
                                                {{ formatErrorMessage(errors.email) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="phone">
                                            Phone Number <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-telephone"></i>
                                            </span>
                                            <input 
                                                type="tel" 
                                                class="form-control" 
                                                id="phone" 
                                                v-model="formData.phone"
                                                placeholder="Enter phone number"
                                                required
                                                :class="{ 'is-invalid': errors?.phone }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.phone">
                                                {{ formatErrorMessage(errors.phone) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="location">
                                            Location <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-geo-alt"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                id="location" 
                                                v-model="formData.location"
                                                placeholder="Enter location"
                                                required
                                                :class="{ 'is-invalid': errors?.location }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.location">
                                                {{ formatErrorMessage(errors.location) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Employer Specific Fields -->
                                <div class="row g-3 mb-3" v-if="isEmployer">
                                    <div class="col-md-6">
                                        <label class="form-label" for="company_size">
                                            Company Size
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-people"></i>
                                            </span>
                                            <select 
                                                class="form-select" 
                                                id="company_size" 
                                                v-model="formData.company_size"
                                                :class="{ 'is-invalid': errors?.company_size }"
                                            >
                                                <option value="">Select company size</option>
                                                <option v-for="size in companySizes" :key="size" :value="size">
                                                    {{ size }}
                                                </option>
                                            </select>
                                            <div class="invalid-feedback" v-if="errors?.company_size">
                                                {{ formatErrorMessage(errors.company_size) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="industry">
                                            Industry <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-briefcase"></i>
                                            </span>
                                            <select 
                                                class="form-select" 
                                                id="industry" 
                                                v-model="formData.industry"
                                                required
                                                :class="{ 'is-invalid': errors?.industry }"
                                            >
                                                <option value="">Select industry</option>
                                                <option v-for="industry in industries" :key="industry" :value="industry">
                                                    {{ industry }}
                                                </option>
                                            </select>
                                            <div class="invalid-feedback" v-if="errors?.industry">
                                                {{ formatErrorMessage(errors.industry) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label" for="company_description">
                                            Company Description <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-file-text"></i>
                                            </span>
                                            <textarea 
                                                class="form-control" 
                                                id="company_description" 
                                                v-model="formData.company_description"
                                                rows="3"
                                                placeholder="Describe your company"
                                                required
                                                :class="{ 'is-invalid': errors?.company_description }"
                                            ></textarea>
                                            <div class="invalid-feedback" v-if="errors?.company_description">
                                                {{ formatErrorMessage(errors.company_description) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Job Seeker Specific Fields -->
                                <div class="row g-3 mb-3" v-else>
                                    <div class="col-md-6">
                                        <label class="form-label" for="education_level">
                                            Education Level
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-book"></i>
                                            </span>
                                            <select 
                                                class="form-select" 
                                                id="education_level" 
                                                v-model="formData.education_level"
                                                :class="{ 'is-invalid': errors?.education_level }"
                                            >
                                                <option value="">Select education level</option>
                                                <option v-for="level in educationLevels" :key="level" :value="level">
                                                    {{ level }}
                                                </option>
                                            </select>
                                            <div class="invalid-feedback" v-if="errors?.education_level">
                                                {{ formatErrorMessage(errors.education_level) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="years_of_experience">
                                            Years of Experience
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-briefcase"></i>
                                            </span>
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                id="years_of_experience" 
                                                v-model="formData.years_of_experience"
                                                placeholder="Enter years of experience"
                                                :class="{ 'is-invalid': errors?.years_of_experience }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.years_of_experience">
                                                {{ formatErrorMessage(errors.years_of_experience) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label" for="skills">
                                            Skills
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-tools"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                id="skills" 
                                                v-model="formData.skills"
                                                placeholder="Enter skills (comma separated)"
                                                :class="{ 'is-invalid': errors?.skills }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.skills">
                                                {{ formatErrorMessage(errors.skills) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Password Section -->
                                <div class="row g-3 mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label" for="password">
                                            Password <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-lock"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                class="form-control" 
                                                id="password" 
                                                v-model="formData.password"
                                                placeholder="Enter password"
                                                required
                                                :class="{ 'is-invalid': errors?.password }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.password">
                                                {{ formatErrorMessage(errors.password) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="password_confirmation">
                                            Confirm Password <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <span class="input-group-text">
                                                <i class="bi bi-lock"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                class="form-control" 
                                                id="password_confirmation" 
                                                v-model="formData.password_confirmation"
                                                placeholder="Confirm password"
                                                required
                                                :class="{ 'is-invalid': errors?.password_confirmation }"
                                            >
                                            <div class="invalid-feedback" v-if="errors?.password_confirmation">
                                                {{ formatErrorMessage(errors.password_confirmation) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <div class="d-grid">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isLoading"
                                    >
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                                    </button>
                                </div>

                                <div class="text-center mt-3">
                                    Already have an account? 
                                    <router-link to="/auth/login" class="text-decoration-none">
                                        Sign in
                                    </router-link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Success Modal -->
            <SuccessModal 
                :show="showSuccessModal"
                type="jobseeker-register"
                :title="isEmployer ? 'Employer Registration Successful!' : 'Job Seeker Registration Successful!'"
                :message="successMessage"
                @close="handleSuccessModalClose"
            />
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SuccessModal from '@/components/SuccessModal.vue';

export default {
    name: 'Register',
    components: {
        SuccessModal
    },
    data() {
        return {
            // Form data for both registration types
            formData: {
                // Common fields
                name: '',
                company_name: '',
                email: '',
                phone: '',
                location: '',
                password: '',
                password_confirmation: '',

                // Employer specific fields
                company_size: '',
                industry: '',
                company_description: '',

                // Job seeker specific fields
                education_level: '',
                years_of_experience: '',
                skills: '',
            },
            errors: null,
            showSuccessModal: false,

            // Dropdown options
            industries: [
                'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
                'Retail', 'Construction', 'Transportation', 'Media', 'Other'
            ],
            companySizes: [
                '1-10 employees', '11-50 employees', '51-200 employees', 
                '201-500 employees', '501+ employees'
            ],
            educationLevels: [
                'High School', 'Associate Degree', 'Bachelor\'s Degree', 
                'Master\'s Degree', 'PhD', 'Other'
            ],

            // Router and store instances
            router: null,
            authStore: null
        };
    },
    computed: {
        // Determine if registration is for employer
        isEmployer() {
            return this.$route.query.type === 'employer';
        },
        // Dynamic success message based on registration type
        successMessage() {
            return this.isEmployer 
                ? 'Your employer account has been created successfully. You will be redirected to your dashboard.'
                : 'Your job seeker account has been created successfully. You will be redirected to your dashboard.';
        },
        // Get loading state from store
        isLoading() {
            return this.authStore.isLoading;
        }
    },
    methods: {
        // Reset form data
        resetForm() {
            this.formData = {
                name: '',
                company_name: '',
                email: '',
                phone: '',
                location: '',
                password: '',
                password_confirmation: '',
                company_size: '',
                industry: '',
                company_description: '',
                education_level: '',
                years_of_experience: '',
                skills: '',
            };
            this.errors = null;
        },
        // Format job seeker data for API
        formatJobSeekerData() {
            const skills = this.formData.skills
                ? this.formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
                : [];
                
            return {
                name: this.formData.name,
                email: this.formData.email,
                phone: this.formData.phone,
                location: this.formData.location,
                password: this.formData.password,
                password_confirmation: this.formData.password_confirmation,
                education_level: this.formData.education_level,
                experience_years: parseInt(this.formData.years_of_experience) || 0,
                skills: skills
            };
        },
        // Format employer data for API
        formatEmployerData() {
            return {
                company_name: this.formData.company_name?.trim(),
                email: this.formData.email?.trim(),
                phone: this.formData.phone?.trim(),
                location: this.formData.location?.trim(),
                password: this.formData.password,
                password_confirmation: this.formData.password_confirmation,
                company_size: this.formData.company_size || null, // Handle nullable field
                industry: this.formData.industry?.trim(),
                company_description: this.formData.company_description?.trim()
            };
        },
        // Format error message to be more user-friendly
        formatErrorMessage(error) {
            if (Array.isArray(error)) {
                return error[0]; // Return just the message without brackets
            }
            return error;
        },
        // Handle form submission
        async handleSignup() {
            try {
                console.log('Signup process started');
                this.errors = null;

                // Format data based on registration type
                const formattedData = this.isEmployer 
                    ? this.formatEmployerData()
                    : this.formatJobSeekerData();

                console.log('Formatted registration data:', formattedData);

                // Register using the appropriate store method
                if (this.isEmployer) {
                    console.log('Registering employer');
                    await this.authStore.registerEmployer(formattedData);
                } else {
                    console.log('Registering job seeker');
                    await this.authStore.registerJobSeeker(formattedData);
                }

                console.log('Registration successful, showing modal');
                // Show success modal
                this.showSuccessModal = true;
                
                // Ensure modal is triggered
                this.$nextTick(() => {
                    console.log('Modal should now be visible:', this.showSuccessModal);
                });

                this.resetForm();

            } catch (error) {
                console.error('Registration error:', error);

                // Handle validation errors
                if (error.response?.data?.errors) {
                    console.log('Validation errors:', error.response.data.errors);
                    this.errors = error.response.data.errors;
                } else if (error.response?.data?.message) {
                    // Handle specific error message from backend
                    console.log('Backend error message:', error.response.data.message);
                    this.errors = {
                        general: error.response.data.message
                    };
                } else {
                    // Handle generic error
                    console.log('Generic registration error');
                    this.errors = {
                        general: 'An error occurred during registration. Please try again.'
                    };
                }
            }
        },
        // Handle success modal close
        handleSuccessModalClose() {
            console.log('Success modal closed');
            this.showSuccessModal = false;
            this.router.push(this.isEmployer ? '/employer/dashboard' : '/jobseeker/dashboard');
        }
    },
    created() {
        // Initialize router and authStore
        this.router = useRouter();
        this.authStore = useAuthStore();

        // Redirect if no account type selected
        if (!this.$route.query.type) {
            this.$router.replace('/auth/account-type')
        }
    }
};
</script>

<style scoped>
.register-container {
    position: relative;
    /* border: 1px solid red; */
    overflow: hidden;
    /* min-height: 100vh; */
    background: linear-gradient(rgba(13, 110, 253, 0.3), rgba(13, 110, 253, 0.3)), url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* padding: 2rem 0; */
}


textarea.form-control {
    resize: none;
}

.blob-container {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.05;
}

.blobBg {
    width: 100%;
    height: 100%;
}

.container {
    position: relative;
    z-index: 1;
    width: 80%;
}

.invalid-feedback {
    display: block;
}

.form-control:focus,
.form-select:focus {
    box-shadow: none;
    border-color: #0d6efd;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
}

/* Update illustration styles */
.illustration-container {
    position: relative;
    z-index: 1;
    margin-bottom: 2rem;
}

.register-illustration {
    width: 300px;
    height: auto;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
}

.illustration-text {
    margin-top: 1rem;
}

.illustration-text h3 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: #0d6efd;
}

.illustration-text p {
    font-size: 1.1rem;
    opacity: 0.9;
    color: #495057;
}
</style>