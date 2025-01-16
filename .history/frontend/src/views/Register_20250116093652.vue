<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 shadow">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">Create Account</h2>
                        
                        <!-- Error Alert -->
                        <div v-if="errors?.general" class="alert alert-danger">
                            {{ errors.general }}
                        </div>

                        <form @submit.prevent="handleSignup" class="needs-validation" novalidate>
                            <!-- Registration Type
                            <div class="btn-group mb-3">
                                <button 
                                    type="button" 
                                    class="btn btn-primary" 
                                    :class="{ 'active': isEmployer }"
                                    @click="switchToEmployer"
                                >
                                    Employer
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-primary" 
                                    :class="{ 'active': !isEmployer }"
                                    @click="switchToJobSeeker"
                                >
                                    Job Seeker
                                </button>
                            </div> -->

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
                                            {{ errors[isEmployer ? 'company_name' : 'name'] }}
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
                                            {{ errors.email }}
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
                                            {{ errors.phone }}
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
                                            {{ errors.location }}
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
                                            {{ errors.company_size }}
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
                                            {{ errors.industry }}
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
                                            {{ errors.company_description }}
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
                                            {{ errors.education_level }}
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
                                            {{ errors.years_of_experience }}
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
                                            {{ errors.skills }}
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
                                            {{ errors.password }}
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
                                            {{ errors.password_confirmation }}
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
                                <router-link to="/login" class="text-primary">Login here</router-link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <SuccessModal 
            :show="showSuccessModal"
            :title="isEmployer ? 'Registration Successful!' : 'Registration Successful!'"
            :message="successMessage"
            @close="handleSuccessModalClose"
        />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SuccessModal from '@/components/SuccessModal.vue';

export default defineComponent({
    name: 'Register',
    components: {
        SuccessModal
    },
    setup() {
        const router = useRouter();
        const authStore = useAuthStore();
        return { router, authStore };
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
                'Technology',
                'Healthcare',
                'Finance',
                'Education',
                'Manufacturing',
                'Retail',
                'Construction',
                'Transportation',
                'Media',
                'Other'
            ],
            companySizes: [
                '1-10 employees',
                '11-50 employees',
                '51-200 employees',
                '201-500 employees',
                '501+ employees'
            ],
            educationLevels: [
                'High School',
                'Associate Degree',
                'Bachelor\'s Degree',
                'Master\'s Degree',
                'PhD',
                'Other'
            ]
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
            return {
                name: this.formData.name,
                email: this.formData.email,
                phone: this.formData.phone,
                location: this.formData.location,
                password: this.formData.password,
                password_confirmation: this.formData.password_confirmation,
                education_level: this.formData.education_level,
                years_of_experience: parseInt(this.formData.years_of_experience) || 0,
                skills: this.formData.skills.split(',').map(skill => skill.trim())
            };
        },
        // Format employer data for API
        formatEmployerData() {
            return {
                company_name: this.formData.company_name,
                email: this.formData.email,
                phone: this.formData.phone,
                location: this.formData.location,
                password: this.formData.password,
                password_confirmation: this.formData.password_confirmation,
                company_size: this.formData.company_size,
                industry: this.formData.industry,
                company_description: this.formData.company_description
            };
        },
        // Handle form submission
        async handleSignup() {
            try {
                this.errors = null;

                // Format data based on registration type
                const formattedData = this.isEmployer 
                    ? this.formatEmployerData()
                    : this.formatJobSeekerData();

                // Register using the appropriate store method
                if (this.isEmployer) {
                    await this.authStore.registerEmployer(formattedData);
                } else {
                    await this.authStore.registerJobSeeker(formattedData);
                }

                // Show success modal
                this.showSuccessModal = true;
                this.resetForm();

            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                } else {
                    this.errors = {
                        general: this.authStore.error || 'An error occurred during registration. Please try again.'
                    };
                }
            }
        },
        // Handle success modal close
        handleSuccessModalClose() {
            this.showSuccessModal = false;
            this.router.push(this.isEmployer ? '/employer/dashboard' : '/jobseeker/dashboard');
        }
    }
});
</script>

<style scoped>
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
</style>