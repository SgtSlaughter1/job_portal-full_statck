<template>
    <div class="job-listings container my-5">
        <h2 class="text-center mb-4">Available Job Opportunities</h2>

        <div class="search-box bg-white p-2 rounded-pill shadow-lg mb-4">
            <div class="input-group align-items-center">
                <select v-model="searchField" class="form-select border-0 w-auto">
                    <option value="all">All Fields</option>
                    <option value="jobTitle">Job Title</option>
                    <option value="company">Company</option>
                    <option value="location">Location</option>
                </select>
                <input type="text" class="form-control border-0" :placeholder="getPlaceholder" v-model="search"
                    @input="filterJobs">
                <BaseButton class="rounded-pill px-4">
                    Search Jobs
                </BaseButton>
            </div>
        </div>

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

        <!-- No Results -->
        <div v-else-if="filteredJobs.length === 0" class="text-center mt-5">
            <h3>No jobs found</h3>
            <p class="text-muted">Try adjusting your search criteria</p>
        </div>

        <!-- Job Cards -->
        <div v-else class="row g-4">
            <div v-for="job in filteredJobs" :key="job.jobTitle" class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 rounded">
                    <div class="card-body">
                        <h5 class="card-title text-primary">{{ job.jobTitle }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ job.company }}</h6>

                        <div class="mb-3">
                            <span class="badge bg-info me-2">
                                <i class="bi bi-geo-alt"></i> {{ job.location }}
                            </span>
                            <span class="badge bg-success mt-3">
                                 {{ job.pay }}
                            </span>
                        </div>

                        <p class="card-text">{{ job.description }}</p>

                        <BaseButton @click="viewJobDetails(job)" class="w-40 btn-primary">
                            View Details
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useJobStore } from '@/stores/jobs'
import BaseButton from '@/components/BaseButton.vue'

export default {
    name: 'JobListings',

    components: {
        BaseButton
    },

    data() {
        return {
            jobStore: useJobStore(),
            search: '',
            searchField: 'all'
        }
    },

    created() {
        this.jobStore.fetchJobs()
    },

    computed: {
        filteredJobs() {
            if (!this.search) return this.jobStore.getJobs;

            const query = this.search.toLowerCase();
            return this.jobStore.getJobs.filter(job => {
                if (this.searchField === 'all') {
                    return job.jobTitle.toLowerCase().includes(query) ||
                        job.location.toLowerCase().includes(query) ||
                        job.company.toLowerCase().includes(query);
                }
                return job[this.searchField].toLowerCase().includes(query);
            });
        },
        getPlaceholder() {
            switch (this.searchField) {
                case 'jobTitle':
                    return 'Search by job title...';
                case 'company':
                    return 'Search by company name...';
                case 'location':
                    return 'Search by location...';
                default:
                    return 'Search jobs by title, company, or location...';
            }
        }
    },

    methods: {
        viewJobDetails(job) {
            this.$router.push(`/jobs/${job.id}`);
        },

        scrollToTop() {
            window.scrollTo(0, 0);
        }
    },
    
    mounted() {
        this.scrollToTop();
    },
}
</script>

<style scoped>
.search-box {
    max-width: 100%;
    margin: 20px auto;
}

.search-box .form-control:focus {
    box-shadow: none;
    border-color: #007bff;
}

.search-box .form-select {
    max-width: 150px;
    margin-right: 10px;
}

.search-box .form-select:focus {
    box-shadow: none;
    border-color: #007bff;
}

.card {
    transition: transform 0.2s ease-in-out;
    border-radius: 10px;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.badge {
    font-size: 0.9rem;
    padding: 0.5em 0.8em;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
}

.card-subtitle {
    font-size: 1rem;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}
</style>
