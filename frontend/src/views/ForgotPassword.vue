<template>
    <div class="forgot-password-container">
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
                <!-- Left side - Image -->
                <div class="col-md-6 d-none d-md-block text-center">
                    <img src="@/assets/forgot.jpg" alt="Forgot Password" class="forgot-image">
                </div>

                <!-- Right side - Form -->
                <div class="col-md-6 col-lg-5">
                    <div class="forgot-password-card">
                        <div class="text-center mb-4">
                            <h1 class="forgot-title">Forgot Password?</h1>
                            <p class="forgot-subtitle">Enter your email to reset your password</p>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                            {{ error }}
                            <button @click="error = null" type="button" class="btn-close" aria-label="Close"></button>
                        </div>

                        <!-- Success Alert -->
                        <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
                            {{ successMessage }}
                            <button @click="successMessage = null" type="button" class="btn-close" aria-label="Close"></button>
                        </div>

                        <form @submit.prevent="handleSubmit" class="forgot-form">
                            <!-- Email -->
                            <div class="form-floating mb-3">
                                <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email"
                                    v-model="email"
                                    :class="{ 'is-invalid': validationErrors.email }"
                                    placeholder="name@example.com"
                                    required
                                >
                                <label for="email">Email address</label>
                                <div class="invalid-feedback">
                                    {{ validationErrors.email }}
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <button 
                                type="submit" 
                                class="btn btn-primary w-100 forgot-btn"
                                :disabled="isLoading"
                            >
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                            </button>

                            <!-- Back to Login -->
                            <div class="text-center mt-4">
                                <router-link to="/auth/login" class="back-link">
                                    <i class="bi bi-arrow-left me-1"></i>
                                    Back to Login
                                </router-link>
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
    name: 'ForgotPassword',
    
    data() {
        return {
            email: '',
            isLoading: false,
            error: null,
            successMessage: null,
            validationErrors: {}
        };
    },

    methods: {
        async handleSubmit() {
            this.isLoading = true;
            this.error = null;
            this.successMessage = null;
            this.validationErrors = {};

            try {
                const authStore = useAuthStore();
                await authStore.sendPasswordResetLink(this.email);
                
                this.successMessage = 'Password reset link has been sent to your email.';
                this.email = ''; // Clear the form
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.validationErrors = error.response.data.errors;
                } else {
                    this.error = error.response?.data?.message || 'An error occurred. Please try again.';
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.forgot-password-container {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background: linear-gradient(rgba(13, 110, 253, 0.3), rgba(13, 110, 253, 0.3)), url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.forgot-image {
    max-width: 80%;
    height: auto;
    border-radius: 15px;
    /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); */
    mix-blend-mode: multiply;
}

.forgot-password-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.forgot-title {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.forgot-subtitle {
    color: #6c757d;
    margin-bottom: 1.5rem;
}

.blob-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.blobBg {
    position: absolute;
    width: 800px;
    height: 800px;
    right: -400px;
    top: -400px;
    opacity: 0.1;
    animation: rotate 20s infinite linear;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.forgot-btn {
    padding: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.back-link {
    color: #0d6efd;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.back-link:hover {
    color: #0b5ed7;
    text-decoration: underline;
}

.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
    color: #0d6efd;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>