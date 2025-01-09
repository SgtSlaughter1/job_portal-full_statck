<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card border-0 shadow">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">{{ isEmployer ? 'Create Employer Account' : 'Create Job Seeker Account' }}</h2>
                        
                        <!-- Error Alert -->
                        <div v-if="errors?.general" class="alert alert-danger">
                            {{ errors.general }}
                        </div>

                        <form @submit.prevent="handleSignup" class="needs-validation" novalidate>
                            <!-- Basic Information -->
                            <div class="row g-3 mb-3">
                                <div class="col-12">
                                    <label class="form-label" for="name">
                                        {{ isEmployer ? 'Company Name' : 'Full Name' }}
                                        <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i :class="isEmployer ? 'bi bi-building' : 'bi bi-person'"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="name" 
                                            v-model="formData.name"
                                            :placeholder="isEmployer ? 'Enter company name' : 'Enter your full name'"
                                            required
                                            :class="{ 'is-invalid': errors?.name }"
                                        >
                                        <div class="invalid-feedback" v-if="errors?.name">
                                            {{ errors.name }}
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
                            </div>

                            <!-- Role Specific Fields -->
                            <div v-if="!isEmployer" class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="skills">Skills</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-tools"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="skills" 
                                            v-model="formData.skills"
                                            placeholder="e.g., JavaScript, React, Node.js"
                                            :class="{ 'is-invalid': errors?.skills }"
                                        >
                                        <div class="invalid-feedback" v-if="errors?.skills">
                                            {{ errors.skills }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="experience">Years of Experience</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-clock-history"></i>
                                        </span>
                                        <input 
                                            type="number" 
                                            class="form-control" 
                                            id="experience" 
                                            v-model="formData.experience"
                                            min="0"
                                            placeholder="Enter years of experience"
                                            :class="{ 'is-invalid': errors?.experience }"
                                        >
                                        <div class="invalid-feedback" v-if="errors?.experience">
                                            {{ errors.experience }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="isEmployer" class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label" for="companySize">Company Size</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-people"></i>
                                        </span>
                                        <select class="form-select" id="companySize" v-model="formData.companySize" :class="{ 'is-invalid': errors?.companySize }">
                                            <option value="">Select company size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201+">201+ employees</option>
                                        </select>
                                        <div class="invalid-feedback" v-if="errors?.companySize">
                                            {{ errors.companySize }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="industry">Industry</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-briefcase"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="industry" 
                                            v-model="formData.industry"
                                            placeholder="e.g., Technology, Healthcare"
                                            :class="{ 'is-invalid': errors?.industry }"
                                        >
                                        <div class="invalid-feedback" v-if="errors?.industry">
                                            {{ errors.industry }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label" for="companyDescription">Company Description</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-file-text"></i>
                                        </span>
                                        <textarea 
                                            class="form-control" 
                                            id="companyDescription" 
                                            v-model="formData.company_description"
                                            placeholder="Enter company description"
                                            :class="{ 'is-invalid': errors?.company_description }"
                                        ></textarea>
                                        <div class="invalid-feedback" v-if="errors?.company_description">
                                            {{ errors.company_description }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Location -->
                            <div class="mb-3">
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
                                        placeholder="Enter your location"
                                        required
                                        :class="{ 'is-invalid': errors?.location }"
                                    >
                                    <div class="invalid-feedback" v-if="errors?.location">
                                        {{ errors.location }}
                                    </div>
                                </div>
                            </div>

                            <!-- Password Fields -->
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
                                            :type="showPassword ? 'text' : 'password'" 
                                            class="form-control" 
                                            id="password" 
                                            v-model="formData.password"
                                            placeholder="Enter password"
                                            required
                                            :class="{ 'is-invalid': errors?.password }"
                                        >
                                        <button 
                                            class="btn btn-outline-secondary" 
                                            type="button"
                                            @click="showPassword = !showPassword"
                                        >
                                            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                        </button>
                                        <div class="invalid-feedback" v-if="errors?.password">
                                            {{ errors.password }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="confirmPassword">
                                        Confirm Password <span class="text-danger">*</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="bi bi-lock"></i>
                                        </span>
                                        <input 
                                            :type="showConfirmPassword ? 'text' : 'password'" 
                                            class="form-control" 
                                            id="confirmPassword" 
                                            v-model="formData.password_confirmation"
                                            placeholder="Confirm password"
                                            required
                                            :class="{ 'is-invalid': errors?.password_confirmation }"
                                        >
                                        <button 
                                            class="btn btn-outline-secondary" 
                                            type="button"
                                            @click="showConfirmPassword = !showConfirmPassword"
                                        >
                                            <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                        </button>
                                        <div class="invalid-feedback" v-if="errors?.password_confirmation">
                                            {{ errors.password_confirmation }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Terms and Conditions -->
                            <div class="mb-4">
                                <div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        id="terms" 
                                        v-model="acceptTerms"
                                        required
                                        :class="{ 'is-invalid': errors?.terms }"
                                    >
                                    <label class="form-check-label" for="terms">
                                        I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and 
                                        <a href="#" class="text-decoration-none">Privacy Policy</a>
                                    </label>
                                    <div class="invalid-feedback" v-if="errors?.terms">
                                        {{ errors.terms }}
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid gap-2">
                                <button 
                                    type="submit" 
                                    class="btn btn-primary py-2"
                                    :disabled="!acceptTerms || isLoading"
                                >
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                                </button>
                                <div class="text-center">
                                    Already have an account?
                                    <router-link to="/login" class="text-decoration-none"> Sign in</router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <SuccessModal 
            :show="showSuccessModal"
            type="register"
            @close="handleSuccessModalClose"
        />
    </div>
</template>

<script>
import SuccessModal from '@/components/SuccessModal.vue';
import { authApi } from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Register',
    components: {
        SuccessModal
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            formData: {
                name: '',
                email: '',
                phone: '',
                skills: '',
                experience: '',
                education_level: "Bachelor's Degree",
                location: '',
                password: '',
                password_confirmation: '',
                company_description: '',
                industry: '',
                role: this.$route.query.type || 'seeker' // Default to job seeker if not specified
            },
            errors: null,
            showSuccessModal: false,
            isLoading: false,
            showPassword: false,
            showConfirmPassword: false,
            acceptTerms: false
        };
    },
    computed: {
        isEmployer() {
            return this.formData.role === 'employer';
        }
    },
    methods: {
        async handleSignup() {
            try {
                this.isLoading = true;
                this.errors = null;

                let formattedData;
                
                if (this.isEmployer) {
                    // Format employer data
                    formattedData = {
                        company_name: this.formData.name,
                        email: this.formData.email,
                        password: this.formData.password,
                        password_confirmation: this.formData.password_confirmation,
                        phone: this.formData.phone,
                        company_description: this.formData.company_description,
                        industry: this.formData.industry,
                        location: this.formData.location
                    };
                } else {
                    // Format job seeker data
                    formattedData = {
                        name: this.formData.name,
                        email: this.formData.email,
                        password: this.formData.password,
                        password_confirmation: this.formData.password_confirmation,
                        phone: this.formData.phone,
                        skills: this.formData.skills ? this.formData.skills.split(',').map(skill => skill.trim()) : [],
                        years_of_experience: parseInt(this.formData.experience) || 0,
                        education_level: this.formData.education_level,
                        location: this.formData.location
                    };
                }

                // Call the appropriate registration API
                const response = this.isEmployer 
                    ? await authApi.employerRegister(formattedData)
                    : await authApi.jobSeekerRegister(formattedData);
                
                // Store the token
                localStorage.setItem('token', response.data.token);
                
                // Show success message
                this.showSuccessModal = true;
                
                // Reset form
                this.formData = {
                    name: '',
                    email: '',
                    phone: '',
                    skills: '',
                    experience: '',
                    education_level: "Bachelor's Degree",
                    location: '',
                    password: '',
                    password_confirmation: '',
                    company_description: '',
                    industry: '',
                    role: this.formData.role // Preserve the current role
                };

                // Redirect to appropriate dashboard after a short delay
                setTimeout(() => {
                    this.router.push(this.isEmployer ? '/employer/dashboard' : '/jobseeker/dashboard');
                }, 2000);

            } catch (error) {
                this.errors = {};
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                } else if (error.response?.data?.message) {
                    this.errors.general = error.response.data.message;
                } else {
                    this.errors.general = 'An error occurred during registration. Please try again.';
                }
            } finally {
                this.isLoading = false;
            }
        },

        handleSuccessModalClose() {
            this.showSuccessModal = false;
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 1rem;
}

.form-control:focus,
.form-select:focus,
.btn-check:checked + .btn-outline-primary {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.input-group-text {
    background-color: transparent;
}

.btn-primary {
    padding: 0.75rem;
    font-weight: 500;
}

.form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}

@media (max-width: 768px) {
    .card {
        border-radius: 0;
        box-shadow: none;
    }
}
</style>