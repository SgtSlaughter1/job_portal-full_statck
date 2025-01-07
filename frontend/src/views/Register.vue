<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card border-0 shadow">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">{{ isEmployer ? 'Create Employer Account' : 'Create Job Seeker Account' }}</h2>
                        
                        <!-- Account Type Toggle -->
                        <div class="btn-group w-100 mb-4" role="group">
                            <input type="radio" class="btn-check" name="accountType" id="seeker" value="seeker" v-model="formData.role">
                            <label class="btn btn-outline-primary" for="seeker">
                                <i class="bi bi-person me-2"></i>Job Seeker
                            </label>
                            <input type="radio" class="btn-check" name="accountType" id="employer" value="employer" v-model="formData.role">
                            <label class="btn btn-outline-primary" for="employer">
                                <i class="bi bi-building me-2"></i>Employer
                            </label>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="errors" class="alert alert-danger">
                            <ul class="mb-0">
                                <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
                            </ul>
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
                                        >
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
                                        >
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
                                        >
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
                                        >
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
                                        >
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
                                        <select class="form-select" id="companySize" v-model="formData.companySize">
                                            <option value="">Select company size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201+">201+ employees</option>
                                        </select>
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
                                        >
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
                                    >
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
                                        >
                                        <button 
                                            class="btn btn-outline-secondary" 
                                            type="button"
                                            @click="showPassword = !showPassword"
                                        >
                                            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                        </button>
                                    </div>
                                    <div class="form-text">
                                        Password must be at least 6 characters
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
                                            v-model="formData.confirmPassword"
                                            placeholder="Confirm password"
                                            required
                                        >
                                        <button 
                                            class="btn btn-outline-secondary" 
                                            type="button"
                                            @click="showConfirmPassword = !showConfirmPassword"
                                        >
                                            <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                        </button>
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
                                    >
                                    <label class="form-check-label" for="terms">
                                        I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and 
                                        <a href="#" class="text-decoration-none">Privacy Policy</a>
                                    </label>
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

export default {
    name: 'Register',
    
    components: {
        SuccessModal
    },

    data() {
        return {
            formData: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                location: '',
                skills: '',
                experience: '',
                companySize: '',
                industry: '',
                role: this.$route.query.type || 'seeker'
            },
            errors: null,
            isLoading: false,
            showPassword: false,
            showConfirmPassword: false,
            showSuccessModal: false,
            acceptTerms: false
        };
    },

    computed: {
        isEmployer() {
            return this.formData.role === 'employer';
        }
    },

    methods: {
        validateForm() {
            const errors = {};

            if (!this.formData.name) {
                errors.name = `${this.isEmployer ? 'Company name' : 'Name'} is required`;
            }

            if (!this.formData.email) {
                errors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
                errors.email = 'Invalid email format';
            }

            if (!this.formData.password) {
                errors.password = 'Password is required';
            } else if (this.formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }

            if (this.formData.password !== this.formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }

            if (!this.formData.phone) {
                errors.phone = 'Phone number is required';
            }

            if (!this.formData.location) {
                errors.location = 'Location is required';
            }

            // Role-specific validation
            if (this.isEmployer) {
                if (!this.formData.industry) {
                    errors.industry = 'Industry is required';
                }
                if (!this.formData.companySize) {
                    errors.companySize = 'Company size is required';
                }
            } else {
                if (!this.formData.skills) {
                    errors.skills = 'Skills are required';
                }
            }

            this.errors = Object.keys(errors).length ? errors : null;
            return !this.errors;
        },

        async handleSignup() {
            if (this.validateForm()) {
                try {
                    this.isLoading = true;
                    const userData = {
                        ...this.formData,
                        createdAt: new Date().toISOString()
                    };
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const existingData = JSON.parse(localStorage.getItem('userData')) || [];
                    existingData.push(userData);
                    localStorage.setItem('userData', JSON.stringify(existingData));

                    this.showSuccessModal = true;
                } catch (error) {
                    console.error('Registration error:', error);
                    this.errors = { general: 'Registration failed. Please try again.' };
                } finally {
                    this.isLoading = false;
                }
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