<template>
    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="text-center mb-4">Welcome Back</h2>
                        
                        <!-- Error Alert -->
                        <div v-if="error" class="alert alert-danger" role="alert">
                            {{ error }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <!-- Email -->
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email"
                                    v-model="formData.email"
                                    :class="{ 'is-invalid': validationErrors.email }"
                                    required
                                >
                                <div class="invalid-feedback">
                                    {{ validationErrors.email }}
                                </div>
                            </div>

                            <!-- Password -->
                            <div class="mb-4">
                                <label for="password" class="form-label">Password</label>
                                <div class="input-group">
                                    <input 
                                        :type="showPassword ? 'text' : 'password'" 
                                        class="form-control" 
                                        id="password"
                                        v-model="formData.password"
                                        :class="{ 'is-invalid': validationErrors.password }"
                                        required
                                    >
                                    <button 
                                        class="btn btn-outline-secondary" 
                                        type="button"
                                        @click="togglePassword"
                                    >
                                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                    <div class="invalid-feedback">
                                        {{ validationErrors.password }}
                                    </div>
                                </div>
                            </div>

                            <!-- Remember Me -->
                            <div class="mb-4 form-check">
                                <input 
                                    type="checkbox" 
                                    class="form-check-input" 
                                    id="remember"
                                    v-model="formData.remember"
                                >
                                <label class="form-check-label" for="remember">Remember me</label>
                            </div>

                            <!-- Submit Button -->
                            <div class="d-grid mb-4">
                                <button 
                                    type="submit" 
                                    class="btn btn-primary"
                                    :disabled="isLoading"
                                >
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ isLoading ? 'Signing in...' : 'Sign In' }}
                                </button>
                            </div>

                            <!-- Links -->
                            <div class="text-center">
                                <p class="mb-2">
                                    <a href="#" class="text-decoration-none">Forgot your password?</a>
                                </p>
                                <p class="mb-0">
                                    Don't have an account? 
                                    <router-link to="/register" class="text-decoration-none">Sign up</router-link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'Login',

    data() {
        return {
            formData: {
                email: '',
                password: '',
                remember: false
            },
            isLoading: false,
            error: null,
            validationErrors: {},
            showPassword: false,
            authStore: useAuthStore()
        };
    },

    methods: {
        async handleLogin() {
            try {
                this.isLoading = true;
                this.error = null;
                this.validationErrors = {};

                await this.authStore.login(this.formData);
                
                // Redirect to dashboard or previous page
                const redirectPath = this.$route.query.redirect || '/dashboard';
                this.$router.push(redirectPath);
            } catch (error) {
                if (error.response?.status === 422) {
                    // Validation errors
                    this.validationErrors = error.response.data.errors;
                } else if (error.response?.status === 401) {
                    // Invalid credentials
                    this.error = 'Invalid email or password';
                } else {
                    // Other errors
                    this.error = 'An error occurred. Please try again.';
                    console.error('Login error:', error);
                }
            } finally {
                this.isLoading = false;
            }
        },

        togglePassword() {
            this.showPassword = !this.showPassword;
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 1rem;
}

.form-control:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.btn-primary {
    padding: 0.75rem;
    font-weight: 500;
}

.form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}
</style>