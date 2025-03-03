<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">My Job Applications</h2>
        
        <!-- Loading State -->
        <div v-if="jobSeekerStore.getLoadingStatus" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="jobSeekerStore.getError" class="alert alert-danger" role="alert">
          {{ jobSeekerStore.getError }}
        </div>

        <!-- No Applications -->
        <div v-else-if="!applications.length" class="alert alert-info" role="alert">
          You haven't applied to any jobs yet. 
          <router-link to="/jobs" class="alert-link">Browse available jobs</router-link>
        </div>

        <!-- Applications List -->
        <div v-else class="row">
          <div class="col-12 mb-4">
            <!-- Filter Controls -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="btn-group">
                <button 
                  v-for="status in ['all', 'pending', 'accepted', 'rejected']" 
                  :key="status"
                  class="btn" 
                  :class="[
                    selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'
                  ]"
                  @click="selectedStatus = status"
                >
                  {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                </button>
              </div>
              <div class="d-flex align-items-center">
                <label class="me-2">Sort by:</label>
                <select v-model="sortBy" class="form-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            </div>

            <!-- Applications Cards -->
            <div class="row">
              <div v-for="application in filteredApplications" 
                   :key="application.id" 
                   class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h5 class="card-title mb-0">{{ application.job.title }}</h5>
                      <span :class="getStatusBadgeClass(application.status)">
                        {{ application.status }}
                      </span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">
                      {{ application.job.employer.company_name }}
                    </h6>
                    <p class="card-text">
                      <small class="text-muted">
                        Applied on: {{ new Date(application.created_at).toLocaleDateString() }}
                      </small>
                    </p>
                    <div class="mt-3">
                      <router-link 
                        :to="{ name: 'JobDetails', params: { id: application.job.id }}" 
                        class="btn btn-outline-primary btn-sm me-2"
                      >
                        View Job
                      </router-link>
                      <button 
                        v-if="application.status === 'pending'"
                        @click="withdrawApplication(application.id)"
                        class="btn btn-outline-danger btn-sm"
                        :disabled="withdrawingId === application.id"
                      >
                        <span v-if="withdrawingId === application.id" class="spinner-border spinner-border-sm me-1"></span>
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobSeekerStore } from '@/stores/jobSeekerStore';

export default {
    name: 'JobApplications',
    data() {
        return {
            jobSeekerStore: null,
            selectedStatus: 'all',
            sortBy: 'newest',
            withdrawingId: null
        };
    },
    computed: {
        // Get applications from store
        applications() {
            return this.jobSeekerStore ? this.jobSeekerStore.getApplications : [];
        },

        // Filter and sort applications
        filteredApplications() {
            let filtered = [...this.applications];
            
            // Apply status filter
            if (this.selectedStatus !== 'all') {
                filtered = filtered.filter(app => app.status === this.selectedStatus);
            }
            
            // Apply sorting
            switch (this.sortBy) {
                case 'newest':
                    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'oldest':
                    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    break;
                case 'company':
                    filtered.sort((a, b) => a.job.employer.company_name.localeCompare(b.job.employer.company_name));
                    break;
            }
            
            return filtered;
        }
    },
    methods: {
        // Get status badge class
        getStatusBadgeClass(status) {
            const classes = {
                pending: 'badge bg-warning',
                accepted: 'badge bg-success',
                rejected: 'badge bg-danger'
            };
            return classes[status] || 'badge bg-secondary';
        },

        // Withdraw application
        async withdrawApplication(applicationId) {
            try {
                this.withdrawingId = applicationId;
                await this.jobSeekerStore.withdrawApplication(applicationId);
            } catch (error) {
                console.error('Failed to withdraw application:', error);
            } finally {
                this.withdrawingId = null;
            }
        },

        // Load applications
        async loadApplications() {
            if (!this.applications.length) {
                await this.jobSeekerStore.fetchDashboardData();
            }
        }
    },
    created() {
        // Initialize store
        this.jobSeekerStore = useJobSeekerStore();

        // Fetch dashboard data on component creation
        this.loadApplications();
    }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.badge {
  text-transform: capitalize;
}

.btn-group .btn {
  text-transform: capitalize;
}
</style>
