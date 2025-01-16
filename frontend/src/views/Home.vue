<template>
    <div>
        <!-- Hero Section -->
        <section class="hero-section py-5 bg-primary text-white">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 col-12">
                    <h1 class="display-5 fw-bold mb-4">"Unlock Your Future: The Career You Deserve Awaits!"</h1>
                    <p class="lead mb-4">
                        "Explore endless opportunities with leading companies around the globe. Start your journey to success today—your dream job is just a step away."
                    </p>
                    <div class="search-box bg-white p-2 rounded-pill shadow-lg">
                        <div class="input-group">
                            <input type="text" class="form-control border-0" placeholder="Search jobs by title, company, or keywords...">
                            <BaseButton class="rounded-pill px-4">
                                Search Jobs
                            </BaseButton>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 d-none d-lg-block">
                    <img src="/images/job.png" alt="Job Search" class="img-fluid">
                </div>
            </div>
        </div>
    </section>

        <!-- Featured Jobs Section -->
        <section class="featured-jobs py-5">
            <div class="container">
                <h2 class="text-center mb-5">Featured Jobs</h2>
                
                <!-- Loading State -->
                <div v-if="jobStore.isLoading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="jobStore.hasError" class="alert alert-danger" role="alert">
                    {{ jobStore.hasError }}
                </div>

                <!-- Jobs Grid -->
                <div v-else class="row g-4">
                    <div v-for="job in featuredJobs" :key="job.id" class="col-md-6 col-lg-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <h5 class="card-title text-primary mb-0">{{ job.title }}</h5>
                                    <span :class="getJobTypeClass(job.type)" class="badge">
                                        {{ job.type }}
                                    </span>
                                </div>
                                <h6 class="text-muted mb-3">{{ job.employer?.company_name }}</h6>
                                
                                <div class="mb-3">
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="bi bi-geo-alt me-2"></i>
                                        {{ job.location }}
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-cash me-2"></i>
                                        {{ formatSalary(job.salary) }}
                                    </div>
                                </div>

                                <router-link 
                                    :to="{ name: 'JobDetails', params: { id: job.id }}" 
                                    class="btn btn-outline-primary w-100"
                                >
                                    View Details
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <router-link to="/jobs" class="btn btn-primary">
                        View All Jobs
                    </router-link>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <HowItWorks />

        <!-- Trusted Companies -->
        <TrustedCompanies />
    </div>
</template>

<script>

import { useJobStore } from '@/stores/jobs';
import HowItWorks from '@/components/HowItWorks.vue';
import TrustedCompanies from '@/components/TrustedCompanies.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
    name: 'Home',
    
    components: {
        HowItWorks,
        TrustedCompanies,
        BaseButton
    },

    data() {
        return {
            jobStore: useJobStore()
        };
    },

    computed: {
        featuredJobs() {
            return this.jobStore.getJobs.slice(0, 3);
        }
    },

    methods: {
        getJobTypeClass(type) {
            if (!type) return 'bg-secondary';
            
            const classes = {
                'full-time': 'bg-success',
                'part-time': 'bg-info',
                'contract': 'bg-warning',
                'remote': 'bg-primary',
                'freelance': 'bg-info'
            };
            return classes[type.toLowerCase()] || 'bg-secondary';
        },

        formatSalary(salary) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(salary);
        }
    },

    async mounted() {
        await this.jobStore.fetchJobs();
    }
};
</script>

<style scoped>


.card {
    transition: transform 0.2s;
    border-radius: 0.5rem;
}

.card:hover {
    transform: translateY(-5px);
}

.badge {
    font-size: 0.8rem;
    padding: 0.5em 1em;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
}

.featured-jobs {
    background-color: #fff;
}
</style>