<template>
    <div class="container my-5">
        <div v-if="jobStore.isLoading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else-if="!job" class="text-center">
            <h3>Job not found</h3>
            <BaseButton @click="$router.push('/jobs')" class="mt-3">Back to Jobs</BaseButton>
        </div>

        <div v-else class="job-details">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h2 class="text-primary mb-2">{{ job.title }}</h2>
                                    <h5 class="text-muted mb-3">{{ job.employer?.company_name }}</h5>
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="bi bi-geo-alt me-2"></i>
                                        {{ job.location || 'Location not specified' }}
                                    </div>
                                    <div class="d-flex align-items-center mb-2">
                                        <i class="bi bi-cash me-2"></i>
                                        {{ formatSalary(job.salary) }}
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-clock me-2"></i>
                                        Posted: {{ formatDate(job.created_at) }}
                                    </div>
                                </div>
                                <span :class="getJobTypeClass(job.type)" class="badge">
                                    {{ job.type || 'Not specified' }}
                                </span>
                            </div>

                            <h4 class="mb-3">Job Description</h4>
                            <p class="mb-4 job-description">{{ job.description || 'No description available' }}</p>

                            <div v-if="job.requirements?.length" class="mb-4">
                                <h4 class="mb-3">Requirements</h4>
                                <ul class="list-unstyled">
                                    <li v-for="(req, index) in job.requirements" :key="index" class="mb-2">
                                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                                        {{ req }}
                                    </li>
                                </ul>
                            </div>

                            <div v-if="job.responsibilities?.length" class="mb-4">
                                <h4 class="mb-3">Responsibilities</h4>
                                <ul class="list-unstyled">
                                    <li v-for="(resp, index) in job.responsibilities" :key="index" class="mb-2">
                                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                                        {{ resp }}
                                    </li>
                                </ul>
                            </div>

                            <div v-if="job.benefits?.length" class="mb-4">
                                <h4 class="mb-3">Benefits</h4>
                                <ul class="list-unstyled">
                                    <li v-for="(benefit, index) in job.benefits" :key="index" class="mb-2">
                                        <i class="bi bi-gift-fill text-primary me-2"></i>
                                        {{ benefit }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm sticky-top" style="top: 2rem;">
                        <div class="card-body">
                            <h4 class="mb-3">Quick Apply</h4>
                            <div v-if="!authStore.isAuthenticated" class="alert alert-info mb-3">
                                Please login to apply for this job
                            </div>
                            <div v-else-if="authStore.userType === 'employer'" class="alert alert-warning mb-3">
                                Employers cannot apply for jobs
                            </div>
                            <BaseButton 
                                @click="handleApplyClick" 
                                class="w-100 mb-2"
                                :disabled="isApplyDisabled"
                            >
                                {{ buttonText }}
                            </BaseButton>
                            <BaseButton @click="$router.push('/jobs')" variant="outline" class="w-100">
                                Back to Jobs
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useJobStore } from '@/stores/jobs';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
import BaseButton from '@/components/BaseButton.vue';

export default {
    name: 'JobDetails',
    components: {
        BaseButton
    },

    data() {
        return {
            jobStore: useJobStore(),
            authStore: useAuthStore(),
            applicationStore: useApplicationStore(),
            error: null,
            isLoading: false
        };
    },

    computed: {
        // Get current job details
        job() {
            return this.jobStore.getCurrentJob;
        },

        // Check if user has already applied
        hasApplied() {
            if (!this.job?.id || !this.authStore.isAuthenticated || this.authStore.userType !== 'jobseeker') {
                return false;
            }
            return this.applicationStore.hasAppliedForJob(this.job.id);
        },

        // Get button text based on state
        buttonText() {
            if (this.isLoading) return 'Loading...';
            if (!this.authStore.isAuthenticated) return 'Login to Apply';
            if (this.authStore.userType === 'employer') return 'Employers Cannot Apply';
            if (this.hasApplied) return 'Already Applied';
            return 'Apply Now';
        },

        // Check if apply button should be disabled
        isApplyDisabled() {
            return this.isLoading || 
                   this.authStore.userType === 'employer' || 
                   this.hasApplied ||
                   !this.job;
        }
    },

    methods: {
        // Get CSS class for job type badge
        getJobTypeClass(type) {
            if (!type) return 'bg-secondary';
            
            const typeClasses = {
                'full-time': 'bg-success',
                'part-time': 'bg-info',
                'contract': 'bg-warning'
            };
            return typeClasses[type.toLowerCase()] || 'bg-secondary';
        },

        // Format salary with currency
        formatSalary(salary) {
            if (!salary) return 'Salary not specified';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(salary);
        },

        // Format date in a readable format
        formatDate(date) {
            if (!date) return 'Date not specified';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        // Handle apply button click
        async handleApplyClick() {
            try {
                if (!this.authStore.isAuthenticated) {
                    // Store current URL for redirect after login
                    const returnUrl = `/jobs/${this.job.id}`;
                    this.$router.push({
                        name: 'Login',
                        query: { 
                            redirect: returnUrl,
                            message: 'Please login to apply for this job'
                        }
                    });
                    return;
                }

                if (this.authStore.userType !== 'jobseeker') {
                    this.$router.push({
                        name: 'JobSeekerRegister',
                        query: { 
                            message: 'Please register as a job seeker to apply for jobs'
                        }
                    });
                    return;
                }

                if (this.hasApplied) {
                    return;
                }

                // Navigate to application form
                this.$router.push({
                    name: 'JobApplication',
                    params: { id: this.job.id }
                });
            } catch (error) {
                console.error('Error handling apply click:', error);
                this.error = 'Failed to process your request. Please try again.';
            }
        },

        // Load initial data
        async loadData() {
            try {
                this.isLoading = true;
                this.error = null;

                // Fetch job details
                await this.jobStore.fetchJobById(this.$route.params.id);

                // If job not found, redirect to jobs page
                if (!this.job && !this.jobStore.isLoading) {
                    this.$router.push('/jobs');
                    return;
                }

                // If user is a job seeker, fetch their applications
                if (this.authStore.isAuthenticated && this.authStore.userType === 'jobseeker') {
                    await this.applicationStore.fetchApplications();
                }
            } catch (error) {
                console.error('Error loading job details:', error);
                this.error = 'Failed to load job details. Please try again.';
            } finally {
                this.isLoading = false;
            }
        }
    },

    // Lifecycle hooks
    async created() {
        if (!this.$route.params.id) {
            this.$router.push('/jobs');
            return;
        }
        await this.loadData();
    },

    beforeUnmount() {
        this.jobStore.clearCurrentJob();
    }
};
</script>

<style scoped>
.job-details {
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    border-radius: 10px;
}

.badge {
    font-size: 0.9rem;
    padding: 0.5em 1em;
}

ul {
    padding-left: 1.5rem;
}

li {
    margin-bottom: 0.5rem;
}
</style>