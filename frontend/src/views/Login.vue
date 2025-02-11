<template>
    <div class="login-container">
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
        
        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <!-- Add the business image column -->
                <div class="col-md-6 d-none d-md-block">
                    <div class="business-image-container">
                        <img src="@/assets/business.png" alt="Business" class="business-image">
                    </div>
                </div>
                <div class="col-md-6 col-lg-5">
                    <!-- Left side - Login Form -->
                    <div class="login-card">
                        <div class="login-header text-center mb-4">
                            <h1 class="login-title">Welcome Back</h1>
                            <p class="login-subtitle">Sign in to continue to your account</p>
                            <div class="catchphrase">
                                <span class="highlight">Your Future Job Awaits You!</span>
                                <div class="catchphrase-underline"></div>
                            </div>
                        </div>
                        
                        <!-- Error Alert -->
                        <div v-if="error" 
                            class="alert alert-danger alert-dismissible fade show" 
                            role="alert"
                        >
                            {{ error }}
                            <button @click="error = null" type="button" class="btn-close" aria-label="Close"></button>
                        </div>

                        <form @submit.prevent="handleLogin" class="login-form">
                            <!-- Email -->
                            <div class="form-floating mb-3">
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email"
                                    v-model="formData.email"
                                    :class="{ 'is-invalid': validationErrors.email }"
                                    placeholder="name@example.com"
                                    required
                                >
                                <label for="email">Email address</label>
                                <div class="invalid-feedback">
                                    {{ validationErrors.email }}
                                </div>
                            </div>

                            <!-- Password -->
                            <div class="form-floating mb-4">
                                <input 
                                    :type="showPassword ? 'text' : 'password'" 
                                    class="form-control" 
                                    id="password"
                                    v-model="formData.password"
                                    :class="{ 'is-invalid': validationErrors.password }"
                                    placeholder="Enter your password"
                                    required
                                >
                                <label for="password">Password</label>
                                <button 
                                    class="btn btn-link password-toggle"
                                    type="button"
                                    @click="togglePassword"
                                >
                                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </button>
                                <div class="invalid-feedback">
                                    {{ validationErrors.password }}
                                </div>
                            </div>

                            <!-- Remember Me & Forgot Password -->
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input" 
                                        id="remember"
                                        v-model="formData.remember"
                                    >
                                    <label class="form-check-label" for="remember">Remember me</label>
                                </div>
                                <a href="#" class="forgot-password">Forgot password?</a>
                            </div>

                            <!-- Submit Button -->
                            <button 
                                type="submit" 
                                class="btn btn-primary w-100 login-btn"
                                :disabled="isLoading"
                            >
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isLoading ? 'Signing in...' : 'Sign In' }}
                            </button>

                            <!-- Sign Up Link -->
                            <div class="text-center mt-4">
                                <p class="mb-0">
                                    Don't have an account? 
                                    <router-link to="/auth/account-type" class="signup-link">
                                        Create Account
                                    </router-link>
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
            authStore: useAuthStore(),
            formData: {
                email: '',
                password: '',
                remember: false
            },
            isLoading: false,
            error: null,
            validationErrors: {},
            showPassword: false
        };
    },

    methods: {
        resetForm() {
            this.formData = {
                email: '',
                password: '',
                remember: false
            };
            this.error = null;
            this.validationErrors = {};
        },

        async handleLogin() {
            try {
                this.isLoading = true;
                this.error = null;
                this.validationErrors = {};

                await this.authStore.login(this.formData);

                // Handle redirect after successful login
                const redirectPath = this.$route.query.redirect || '/profile';
                await this.$router.push(redirectPath);

            } catch (error) {
                if (error.response?.status === 422) {
                    this.validationErrors = error.response.data.errors;
                } else if (error.response?.status === 401) {
                    this.error = 'Invalid email or password';
                } else {
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
.login-container {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background: linear-gradient(rgba(13, 110, 253, 0.3), rgba(13, 110, 253, 0.3)), url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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

.business-image-container {
    position: relative;
    z-index: 1;
    padding: 2rem;
}

.business-image {
    width: 90%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.container {
    position: relative;
    z-index: 1;
    width: 90%;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
    margin-bottom: 2rem;
}

.login-title {
    font-size: 2rem;
    font-weight: 700;
    color: #0d6efd;
    margin-bottom: 0.5rem;
}

.login-subtitle {
    color: #495057;
    font-size: 1rem;
}

.catchphrase {
    margin-top: 1rem;
    position: relative;
}

.highlight {
    color: #0d6efd;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.catchphrase-underline {
    width: 50%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #0d6efd, transparent);
    margin: 0.5rem auto;
}

.login-form .form-floating {
    position: relative;
}

.form-control {
    border: 1.5px solid #e5e7eb;
    padding: 1rem;
    height: auto;
    font-size: 1rem;
    border-radius: 8px;
    background-color: #f9fafb;
    transition: all 0.2s ease;
}

.form-control:focus {
    background-color: #ffffff;
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 4px rgba(var(--bs-primary-rgb), 0.1);
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    padding: 0;
    z-index: 4;
}

.password-toggle:hover {
    color: var(--bs-primary);
}

.login-btn {
    padding: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.login-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.2);
}

.forgot-password {
    color: var(--bs-primary);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.2s ease;
}

.forgot-password:hover {
    color: var(--bs-primary-dark);
    text-decoration: underline;
}

.signup-link {
    color: var(--bs-primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.signup-link:hover {
    color: var(--bs-primary-dark);
    text-decoration: underline;
}

.form-check-input:checked {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}

.form-check-label {
    font-size: 0.875rem;
    color: #6b7280;
}

.alert {
    border-radius: 8px;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .login-card {
        padding: 1.5rem;
        margin: 1rem;
    }

    .login-title {
        font-size: 1.75rem;
    }
}
</style>