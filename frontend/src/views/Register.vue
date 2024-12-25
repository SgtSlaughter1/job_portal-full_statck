<template>
    <div class="signup-container">
        <div class="signup-card">
            <h2 class="signup-title">Sign Up as {{ accountTypeLabel }}</h2>
            <form @submit.prevent="handleSignup">
                <!-- Common Fields -->
                <div class="form-row">
                    <div class="mb-3 col">
                        <label for="name" class="form-label">
                            {{ isEmployer ? 'Company Name' : 'Full Name' }}
                        </label>
                        <input type="text" class="form-control" id="name" v-model="formData.name" required>
                    </div>
                    <div class="mb-3 col">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" v-model="formData.email" required>
                    </div>
                </div>

                <!-- Job Seeker Specific Fields -->
                <div v-if="!isEmployer" class="form-row">
                    <div class="mb-3 col">
                        <label for="skills" class="form-label">Skills</label>
                        <input type="text" class="form-control" id="skills" v-model="formData.skills" 
                            placeholder="e.g., JavaScript, React, Node.js">
                    </div>
                    <div class="mb-3 col">
                        <label for="experience" class="form-label">Years of Experience</label>
                        <input type="number" class="form-control" id="experience" v-model="formData.experience">
                    </div>
                </div>

                <!-- Employer Specific Fields -->
                <div v-if="isEmployer" class="form-row">
                    <div class="mb-3 col">
                        <label for="companySize" class="form-label">Company Size</label>
                        <select class="form-select" id="companySize" v-model="formData.companySize">
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201+">201+ employees</option>
                        </select>
                    </div>
                    <div class="mb-3 col">
                        <label for="industry" class="form-label">Industry</label>
                        <input type="text" class="form-control" id="industry" v-model="formData.industry"
                            placeholder="e.g., Technology, Healthcare">
                    </div>
                </div>

                <!-- Common Fields -->
                <div class="form-row">
                    <div class="mb-3 col">
                        <label for="phone" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phone" v-model="formData.phone" required>
                    </div>
                    <div class="mb-3 col">
                        <label for="location" class="form-label">Location</label>
                        <input type="text" class="form-control" id="location" v-model="formData.location" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="mb-3 col">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" v-model="formData.password" required>
                    </div>
                    <div class="mb-3 col">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword"
                            v-model="formData.confirmPassword" required>
                    </div>
                </div>

                <div v-if="errors" class="alert alert-danger">
                    <ul class="mb-0">
                        <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
                    </ul>
                </div>

                <button type="submit" class="btn btn-primary">Register as {{ accountTypeLabel }}</button>
                <div class="mt-3 text-center">
                    Already have an account?
                    <router-link to="/login" class="text-primary"> Login</router-link>
                </div>
            </form>
        </div>
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
    name: 'SignupPage',
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
                // Job seeker specific fields
                skills: '',
                experience: '',
                // Employer specific fields
                companySize: '',
                industry: '',
                role: this.$route.query.type || 'seeker'
            },
            errors: null,
            showSuccessModal: false
        };
    },
    computed: {
        isEmployer() {
            return this.formData.role === 'employer';
        },
        accountTypeLabel() {
            return this.isEmployer ? 'Employer' : 'Job Seeker';
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
        handleSignup() {
            if (this.validateForm()) {
                const userData = {
                    ...this.formData,
                    createdAt: new Date().toISOString()
                };
                
                const existingData = JSON.parse(localStorage.getItem('userData')) || [];
                existingData.push(userData);
                localStorage.setItem('userData', JSON.stringify(existingData));

                this.showSuccessModal = true;
            }
        },

        handleSuccessModalClose() {
            this.showSuccessModal = false;
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
}

.signup-card {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
}

.signup-title {
    margin-bottom: 20px;
    font-size: 2rem;
    text-align: center;
}

.form-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.form-row .col {
    flex: 1;
    margin-right: 10px;
}

.form-row .col:last-child {
    margin-right: 0;
}

.form-label {
    font-weight: bold;
}

.form-control {
    border-radius: 5px;
    border: 1px solid #ccc;
}

.btn-primary {
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    width: 100%;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.text-danger {
    margin-top: 10px;
    text-align: center;
}


@media (max-width: 768px) {
    .form-row .col {
        margin-right: 0;
        flex: 100%;
    }
}
</style>