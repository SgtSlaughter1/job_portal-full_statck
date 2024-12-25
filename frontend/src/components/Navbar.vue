<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-navbar px-5">
        <div class="container-fluid">
            <a class="navbar-brand" href="/"> <i class="bi bi-briefcase mx-2"></i>Job Finder</a>
            <button class="btn btn-light d-lg-none" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#mobileNavOffcanvas" aria-controls="mobileNavOffcanvas">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="offcanvas offcanvas-start d-lg-none" data-bs-scroll="true" tabindex="-1" id="mobileNavOffcanvas"
                aria-labelledby="mobileNavOffcanvasLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="mobileNavOffcanvasLabel"><i class="bi bi-briefcase mx-2"></i>Job
                        Finder</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div class="offcanvas-body">
                    <ul class="navbar-nav ms-auto">
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="#about">
                                <i class="bi bi-info-circle"></i> About Us
                            </a>
                        </li> -->
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="#contact">
                                <i class="bi bi-envelope"></i> Contact
                            </a>
                        </li> -->
                        <li class="nav-item" v-if="!isLoggedIn">

                            <router-link class="nav-link" to="/login">
                                <i class="bi bi-box-arrow-in-right"></i> Login
                            </router-link>
                        </li>
                        <li class="nav-item" v-if="!isLoggedIn">

                            <router-link class="nav-link" to="/account-type">
                                <i class="bi bi-person-plus"></i> Register
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/jobs">
                                <i class="bi bi-briefcase"></i> Jobs
                            </router-link>
                        </li>
                        <li class="nav-item" v-if="isLoggedIn">
                            <router-link class="nav-link" to="/profile">
                                <i class="bi bi-person-circle"></i> Profile
                            </router-link>
                        </li>
                        <li class="nav-item" v-if="isLoggedIn">
                            <a class="nav-link" href="#" @click.prevent="logout">
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ms-auto">

                    <!-- <li class="nav-item">
                        <a class="nav-link" href="#about">
                            <i class="bi bi-info-circle"></i> About Us
                        </a>
                    </li> -->
                    <!-- <li class="nav-item">
                        <a class="nav-link" href="#contact">
                            <i class="bi bi-envelope"></i> Contact
                        </a>
                    </li> -->

                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="/login">
                            <i class="bi bi-box-arrow-in-right"></i> Login
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link class="nav-link" to="/account-type">
                            <i class="bi bi-person-plus"></i> Register
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/jobs">
                            <i class="bi bi-briefcase"></i> Jobs
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <router-link class="nav-link" to="/profile">
                            <i class="bi bi-person-circle"></i> Profile
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <a class="nav-link" href="#" @click.prevent="logout">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
        };
    },
    created() {
        window.addEventListener('storage', this.updateLoginStatus);
    },
    beforeDestroy() {
        window.removeEventListener('storage', this.updateLoginStatus);
    },
    methods: {
        updateLoginStatus() {
            this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        },
        logout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            this.isLoggedIn = false;
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.sticky-navbar {
    position: sticky;
    top: 0;
    z-index: 1020;
}
</style>