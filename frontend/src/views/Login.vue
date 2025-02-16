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

        <!-- Add the business image column -->
    
                    <!-- <div class="business-image-wrapper">
                        <img src="@/assets/business.png" alt="Business" class="business-image">
                    </div>
         -->
        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <div class="col-md-6 d-none d-md-block">
                    <div class="business-image-wrapper">
                        <img src="@/assets/business.png" alt="Business" class="business-image" width="75%">
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
                                <router-link 
                                    to="/forgot-password" 
                                    class="text-decoration-none"
                                >
                                    Forgot Password?
                                </router-link>
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
    background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.3)), url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}

.blob-container {
    position: absolute;
    top: 0;
    left: 0;
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
    max-width: 1200px;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.1), 
        0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
}

.business-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;


}

.business-image {
    max-width: 100%;

    object-fit: contain;
}

.login-header {
    text-align: center;
    padding: 2rem 2rem 1rem;
 
}

.login-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0d6efd;
    margin-bottom: 0.5rem;
    letter-spacing: -1px;
}

.login-subtitle {
    color: #6c757d;
    font-size: 1rem;
    margin-bottom: 1rem;
}

.catchphrase {
    margin-top: 1rem;
    position: relative;
}

.highlight {
    color: #0d6efd;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.catchphrase-underline {
    width: 50%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #0d6efd, transparent);
    margin: 0.5rem auto;
}

.login-form {
    padding: 0 2rem 2rem;
}

.form-floating {
    margin-bottom: 1.5rem;
}

.form-control {
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 1rem;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    background-color: white;
}

.password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6c757d;
    z-index: 5;
    transition: color 0.2s ease;
}

.password-toggle:hover {
    color: #0d6efd;
}

.login-btn {
    padding: 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
}

.signup-link {
    color: #0d6efd;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
}

.signup-link:hover {
    color: #0a58ca;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .login-card {
        margin: 1rem;
        border-radius: 15px;
    }

    .login-title {
        font-size: 2rem;
    }

    .login-form {
        padding: 0 1.5rem 1.5rem;
    }
}
</style>