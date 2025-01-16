<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-navbar px-5">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <i class="bi bi-briefcase mx-2"></i>Job Finder
            </router-link>
            
            <button class="btn btn-light d-lg-none" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#mobileNavOffcanvas" aria-controls="mobileNavOffcanvas">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Mobile Navigation -->
            <div class="offcanvas offcanvas-start d-lg-none" data-bs-scroll="true" tabindex="-1" id="mobileNavOffcanvas"
                aria-labelledby="mobileNavOffcanvasLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="mobileNavOffcanvasLabel">
                        <i class="bi bi-briefcase mx-2"></i>Job Finder
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div class="offcanvas-body">
                    <ul class="navbar-nav ms-auto">
                        <!-- Public Links -->
                        <li class="nav-item">
                            <router-link class="nav-link" to="/jobs">
                                <i class="bi bi-briefcase"></i> Browse Jobs
                            </router-link>
                        </li>

                        <!-- Guest Links -->
                        <template v-if="!authStore.isAuthenticated">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/auth/login">
                                    <i class="bi bi-box-arrow-in-right"></i> Login
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/auth/account-type">
                                    <i class="bi bi-person-plus"></i> Register
                                </router-link>
                            </li>
                        </template>

                        <!-- Authenticated Links -->
                        <template v-if="authStore.isAuthenticated">
                            <!-- Employer Links -->
                            <template v-if="authStore.isEmployer">
                                <li class="nav-item">
                                    <router-link class="nav-link" to="/jobs/post">
                                        <i class="bi bi-plus-circle"></i> Post Job
                                    </router-link>
                                </li>
                            </template>

                            <!-- Job Seeker Links -->
                            <template v-if="authStore.isJobSeeker">
                                <li class="nav-item">
                                    <router-link class="nav-link" to="/profile/applications">
                                        <i class="bi bi-file-text"></i> My Applications
                                    </router-link>
                                </li>
                            </template>

                            <!-- Common Authenticated Links -->
                            <li class="nav-item">
                                <router-link class="nav-link" to="/profile">
                                    <i class="bi bi-person-circle"></i> Profile
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click.prevent="handleLogout">
                                    <i class="bi bi-box-arrow-right"></i> Logout
                                </a>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>

            <!-- Desktop Navigation -->
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">
                    <!-- Public Links -->
                    <li class="nav-item">
                        <router-link class="nav-link" to="/jobs">
                            <i class="bi bi-briefcase"></i> Browse Jobs
                        </router-link>
                    </li>

                    <!-- Guest Links -->
                    <template v-if="!authStore.isAuthenticated">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/auth/login">
                                <i class="bi bi-box-arrow-in-right"></i> Login
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/auth/account-type">
                                <i class="bi bi-person-plus"></i> Register
                            </router-link>
                        </li>
                    </template>

                    <!-- Authenticated Links -->
                    <template v-if="authStore.isAuthenticated">
                        <!-- Employer Links -->
                        <template v-if="authStore.isEmployer">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/jobs/post">
                                    <i class="bi bi-plus-circle"></i> Post Job
                                </router-link>
                            </li>
                        </template>

                        <!-- Job Seeker Links -->
                        <template v-if="authStore.isJobSeeker">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/profile/applications">
                                    <i class="bi bi-file-text"></i> My Applications
                                </router-link>
                            </li>
                        </template>

                        <!-- Common Authenticated Links -->
                        <li class="nav-item">
                            <router-link class="nav-link" to="/profile">
                                <i class="bi bi-person-circle"></i> Profile
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="handleLogout">
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </a>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Navbar',
    
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        
        return {
            authStore,
            router
        };
    },
    
    computed: {
        isLoggedIn() {
            return this.authStore.isAuthenticated;
        },
        
        userRole() {
            return this.authStore.userRole;
        }
    },
    
    methods: {
        async handleLogout() {
            try {
                await this.authStore.logout();
                this.router.push('/auth/login');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    }
});
</script>

<style scoped>
.navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-weight: 600;
    color: #007bff;
}

.nav-link {
    font-weight: 500;
    padding: 0.5rem 1rem;
    transition: color 0.2s ease;
}

.nav-link:hover {
    color: #007bff;
}

.nav-link i {
    margin-right: 0.5rem;
}

@media (max-width: 991.98px) {
    .offcanvas {
        width: 280px;
    }
    
    .offcanvas-body .nav-link {
        padding: 0.75rem 1rem;
    }
}
</style>