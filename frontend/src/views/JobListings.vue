<template>
    <div class="container my-5">
        <!-- Search and Filter Section -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search jobs..." v-model="searchQuery"
                        @input="handleSearch">
                    <button class="btn btn-primary" type="button" @click="handleSearch">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="selectedType" @change="handleSearch">
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" v-model="selectedLocation" @change="handleSearch">
                    <option value="">All Locations</option>
                    <option v-for="location in locations" :key="location" :value="location">
                        {{ location }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="jobStore.isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="jobStore.hasError" class="alert alert-danger" role="alert">
            {{ jobStore.hasError }}
        </div>

        <!-- No Jobs Found -->
        <div v-else-if="!jobStore.getFilteredJobs.length" class="text-center my-5">
            <h3>No jobs found</h3>
            <p class="text-muted">Try adjusting your search criteria</p>
        </div>

        <!-- Jobs List -->
        <div v-else class="row g-4">
            <div v-for="job in jobStore.getFilteredJobs" :key="job.id" class="col-md-6 col-lg-4">
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
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-cash me-2"></i>
                                {{ formatSalary(job.salary) }}
                            </div>
                            <div class="d-flex align-items-center">
                                <i class="bi bi-clock me-2"></i>
                                Posted: {{ formatDate(job.created_at) }}
                            </div>
                        </div>

                        <p class="card-text text-muted">
                            {{ truncateText(job.description, 100) }}
                        </p>
                    </div>
                    <div class="card-footer bg-white border-0 pt-0">
                        <router-link 
                            :to="{ 
                                name: 'JobDetails', 
                                params: { 
                                    id: job.id ? job.id.toString() : '' 
                                }
                            }" 
                            class="btn btn-primary w-100"
                            v-if="job.id"
                        >
                            View Details
                        </router-link>
                        <button 
                            v-else 
                            class="btn btn-primary w-100" 
                            disabled
                        >
                            Job Details Unavailable
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="jobStore.getFilteredJobs.length > itemsPerPage" class="d-flex justify-content-center mt-5">
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li class="page-item" :class="{ disabled: jobStore.getCurrentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(jobStore.getCurrentPage - 1)">
                            Previous
                        </a>
                    </li>
                    <li v-for="page in jobStore.getTotalPages" :key="page" class="page-item"
                        :class="{ active: page === jobStore.getCurrentPage }">
                        <a class="page-link" href="#" @click.prevent="changePage(page)">
                            {{ page }}
                        </a>
                    </li>
                    <li class="page-item" :class="{ disabled: jobStore.getCurrentPage === jobStore.getTotalPages }">
                        <a class="page-link" href="#" @click.prevent="changePage(jobStore.getCurrentPage + 1)">
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import { useJobStore } from '@/stores/jobs';

export default {
    name: 'JobListings',

    data() {
        return {
            jobStore: useJobStore(),
            searchQuery: '',
            selectedType: '',
            selectedLocation: '',
            searchTimeout: null,
            itemsPerPage: 9
        };
    },

    computed: {
        locations() {
            return Array.from(new Set(this.jobStore.getJobs.map(job => job.location)));
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
            if (!salary) return 'Salary not specified';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(salary);
        },

        formatDate(date) {
            if (!date) return 'Date not specified';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        truncateText(text, length = 150) {
            if (!text) return '';
            return text.length > length ? text.slice(0, length) + '...' : text;
        },

        async handleSearch() {
            try {
                console.log('Search params:', {
                    query: this.searchQuery,
                    type: this.selectedType,
                    location: this.selectedLocation
                });
                
                await this.jobStore.fetchJobs(1, {
                    search: this.searchQuery,
                    type: this.selectedType,
                    location: this.selectedLocation
                });
            } catch (error) {
                console.error('Search error:', error);
            }
        },

        async changePage(page) {
            if (page < 1 || page > this.jobStore.getTotalPages) return;
            
            try {
                await this.jobStore.fetchJobs(page, {
                    search: this.searchQuery,
                    type: this.selectedType,
                    location: this.selectedLocation
                });
            } catch (error) {
                console.error('Page change failed:', error);
            }
        }
    },

    watch: {
        'selectedType'(newValue) {
            this.handleSearch();
        },
        'selectedLocation'(newValue) {
            this.handleSearch();
        }
    },

    async mounted() {
        try {
            await this.jobStore.fetchJobs();
        } catch (error) {
            console.error('Initial fetch failed:', error);
        }
    },

    beforeUnmount() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }
};
</script>

<style scoped>
.badge {
    font-size: 0.8rem;
    padding: 0.5em 1em;
}

.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

.page-link {
    color: var(--bs-primary);
}

.page-item.active .page-link {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);
}
</style>