<template>
    <div class="modal fade" id="jobDetailsModal" tabindex="-1" aria-labelledby="jobDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="jobDetailsModalLabel">Job Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <!-- Loading State -->
                <div v-if="isLoading" class="modal-body text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="modal-body">
                    <div class="alert alert-danger" role="alert">
                        {{ error }}
                    </div>
                </div>

                <!-- Job Details -->
                <div v-else-if="job" class="modal-body">
                    <!-- Job Title and Basic Info -->
                    <div class="mb-4">
                        <h3 class="mb-3">{{ job.title }}</h3>
                        <div class="d-flex flex-wrap gap-3 text-muted">
                            <div><i class="bi bi-building me-2"></i>{{ job.employer?.company_name }}</div>
                            <div><i class="bi bi-geo-alt me-2"></i>{{ job.location }}</div>
                            <div><i class="bi bi-clock me-2"></i>{{ job.type }}</div>
                            <div><i class="bi bi-currency-dollar me-2"></i>{{ formatSalary(job.salary) }}</div>
                        </div>
                    </div>

                    <!-- Experience Level -->
                    <div class="mb-4">
                        <h5 class="mb-2">Experience Level</h5>
                        <p>{{ formatExperienceLevel(job.experience_level) }}</p>
                    </div>

                    <!-- Job Description -->
                    <div class="mb-4">
                        <h5 class="mb-2">Description</h5>
                        <p class="text-justify">{{ job.description }}</p>
                    </div>

                    <!-- Requirements -->
                    <div v-if="job.requirements?.length" class="mb-4">
                        <h5 class="mb-2">Requirements</h5>
                        <ul class="list-unstyled">
                            <li v-for="(req, index) in job.requirements" :key="index" class="mb-2">
                                <i class="bi bi-check-circle-fill text-success me-2"></i>{{ req }}
                            </li>
                        </ul>
                    </div>

                    <!-- Responsibilities -->
                    <div v-if="job.responsibilities?.length" class="mb-4">
                        <h5 class="mb-2">Responsibilities</h5>
                        <ul class="list-unstyled">
                            <li v-for="(resp, index) in job.responsibilities" :key="index" class="mb-2">
                                <i class="bi bi-arrow-right-circle-fill text-primary me-2"></i>{{ resp }}
                            </li>
                        </ul>
                    </div>

                    <!-- Benefits -->
                    <div v-if="job.benefits?.length" class="mb-4">
                        <h5 class="mb-2">Benefits</h5>
                        <ul class="list-unstyled">
                            <li v-for="(benefit, index) in job.benefits" :key="index" class="mb-2">
                                <i class="bi bi-gift-fill text-info me-2"></i>{{ benefit }}
                            </li>
                        </ul>
                    </div>

                    <!-- Application Deadline -->
                    <div class="mb-4">
                        <h5 class="mb-2">Application Deadline</h5>
                        <p><i class="bi bi-calendar-event me-2"></i>{{ formatDate(job.deadline) }}</p>
                    </div>

                    <!-- Job Status -->
                    <div class="mb-4">
                        <span :class="getStatusBadgeClass(job.status)">
                            {{ job.status ? (job.status.charAt(0).toUpperCase() + job.status.slice(1)) : 'Status not available' }}
                        </span>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button 
                        v-if="!isEmployer && job?.status === 'open'" 
                        type="button" 
                        class="btn btn-primary"
                        @click="applyForJob"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { useAuthStore } from '@/stores/auth';
import { useJobStore } from '@/stores/jobs';
import { ref, onMounted, computed } from 'vue';

export default {
    name: 'JobDetailsModal',
    
    props: {
        job: {
            type: Object,
            required: true
        }
    },

    setup(props) {
        const modal = ref(null);
        const authStore = useAuthStore();
        const jobStore = useJobStore();

        const isEmployer = computed(() => authStore.isEmployer);
        const isLoading = computed(() => jobStore.isLoading);
        const error = computed(() => jobStore.error);

        onMounted(() => {
            modal.value = new Modal(document.getElementById('jobDetailsModal'));
        });

        const show = () => {
            modal.value?.show();
        };

        const hide = () => {
            modal.value?.hide();
        };

        const formatDate = (date) => {
            if (!date) return 'No deadline set';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatSalary = (salary) => {
            if (!salary) return 'Not specified';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(salary);
        };

        const formatExperienceLevel = (level) => {
            const levels = {
                'entry': 'Entry Level',
                'mid': 'Mid Level',
                'senior': 'Senior Level',
                'lead': 'Lead'
            };
            return levels[level] || level || 'Not specified';
        };

        const getStatusBadgeClass = (status) => {
            if (!status) return 'badge bg-secondary';
            const classes = {
                'open': 'badge bg-success',
                'closed': 'badge bg-danger',
                'draft': 'badge bg-secondary',
                'archived': 'badge bg-warning',
                'pending': 'badge bg-info'
            };
            return classes[status.toLowerCase()] || 'badge bg-secondary';
        };

        const applyForJob = async () => {
            try {
                hide();
                if (props.job?.id) {
                    await jobStore.fetchJobById(props.job.id);
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        return {
            modal,
            isEmployer,
            isLoading,
            error,
            show,
            hide,
            formatDate,
            formatSalary,
            formatExperienceLevel,
            getStatusBadgeClass,
            applyForJob
        };
    }
};
</script>

<style scoped>
.modal-dialog {
    max-width: 800px;
}

.text-justify {
    text-align: justify;
}

.badge {
    font-size: 0.9rem;
    padding: 0.5em 1em;
}

.modal-body {
    max-height: calc(100vh - 210px);
    overflow-y: auto;
}
</style>
