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
            <!-- Header Section -->
            <!-- <div class="card mb-4 border-0 shadow-sm">
                <div class="card-body">
                    <h1 class="card-title text-primary mb-3">{{ job.jobTitle }}</h1>
                    <div class="company-info mb-3">
                        <h5 class="text-muted">{{ job.company }}</h5>
                    </div>
                    <div class="badges mb-3">
                        <span class="badge bg-info me-2">
                            <i class="bi bi-geo-alt"></i> {{ job.location }}
                        </span>
                        <span class="badge bg-success">{{ job.pay }}</span>
                    </div>
                </div>
            </div> -->

            <!-- Details Section -->
            <div class="row">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body">
                            <h4 class="mb-4">Job Description</h4>
                            <p>{{ job.description }}</p>

                            <h4 class="mb-3 mt-4">Requirements</h4>
                            <ul>
                                <li v-for="(req, index) in job.requirements" :key="index">
                                    {{ req }}
                                </li>
                            </ul>

                            <h4 class="mb-3 mt-4">Responsibilities</h4>
                            <ul>
                                <li v-for="(resp, index) in job.responsibilities" :key="index">
                                    {{ resp }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <h4 class="mb-3">Job Overview</h4>
                            <div class="mb-3">
                                <p><strong>Employment Type:</strong> {{ job.employmentType }}</p>
                                <p><strong>Experience Level:</strong> {{ job.experienceLevel }}</p>
                                <p><strong>Posted Date:</strong> {{ job.postedDate }}</p>
                            </div>
                            <BaseButton @click="applyNow" class="w-100 mb-2">Apply Now</BaseButton>
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
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobs';
import BaseButton from '@/components/BaseButton.vue';

export default {
    name: 'JobDetails',
    components: {
        BaseButton
    },
    props: {
        id: {
            type: [Number, String],
            required: true
        }
    },
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const jobStore = useJobStore();

        const job = computed(() => jobStore.getCurrentJob);

        const getJobTypeClass = (type) => {
            const classes = {
                'full-time': 'bg-success',
                'part-time': 'bg-info',
                'contract': 'bg-warning'
            };
            return classes[type.toLowerCase()] || 'bg-secondary';
        };

        const formatSalary = (salary) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(salary);
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const applyNow = () => {
            const isLoggedIn = !!localStorage.getItem('username'); // Check if user is logged in
            if (isLoggedIn) {
                router.push({ path: '/apply', query: { jobId: props.id } }); // Navigate to application form
            } else {
                router.push('/login'); // Redirect to login page
            }
        };

        onMounted(async () => {
            const jobId = props.id || route.params.id;
            if (!jobId) {
                router.push('/jobs');
                return;
            }
            
            await jobStore.fetchJobById(jobId);
            if (!jobStore.getCurrentJob && !jobStore.isLoading) {
                router.push('/jobs');
            }
        });

        onBeforeUnmount(() => {
            jobStore.clearCurrentJob();
        });

        return {
            jobStore,
            job,
            getJobTypeClass,
            formatSalary,
            formatDate,
            applyNow
        };
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
