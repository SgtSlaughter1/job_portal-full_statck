<!-- Applications Manager View -->
<template>
  <div class="applications-manager container py-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-file-earmark-person"></i> Job Applications</h2>
      <div class="search-filter">
        <input
          type="text"
          v-model="searchQuery"
          class="form-control"
          placeholder="Search applications..."
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Applications Table -->
    <div v-if="!isLoading" class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th @click="sortBy('job_title')">
                  Job Title
                  <i :class="getSortIcon('job_title')"></i>
                </th>
                <th @click="sortBy('applicant_name')">
                  Applicant
                  <i :class="getSortIcon('applicant_name')"></i>
                </th>
                <th @click="sortBy('applied_date')">
                  Applied Date
                  <i :class="getSortIcon('applied_date')"></i>
                </th>
                <th @click="sortBy('status')">
                  Status
                  <i :class="getSortIcon('status')"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in paginatedApplications" :key="application.id">
                <td>{{ application.job_title }}</td>
                <td>{{ application.applicant_name }}</td>
                <td>{{ formatDate(application.applied_date) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="viewApplication(application)"
                      title="View Details"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      v-if="application.status === 'pending'"
                      class="btn btn-sm btn-success"
                      @click="handleApplication(application.id, 'accepted')"
                      title="Accept Application"
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button
                      v-if="application.status === 'pending'"
                      class="btn btn-sm btn-danger"
                      @click="handleApplication(application.id, 'rejected')"
                      title="Reject Application"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="5" class="text-center">No applications found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                Previous
              </a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Application Details Modal -->
    <div class="modal fade" id="applicationModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Application Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedApplication">
            <div class="row">
              <div class="col-md-6">
                <h6>Job Details</h6>
                <p><strong>Title:</strong> {{ selectedApplication.job_title }}</p>
                <p><strong>Department:</strong> {{ selectedApplication.job_department }}</p>
                <p><strong>Location:</strong> {{ selectedApplication.job_location }}</p>
              </div>
              <div class="col-md-6">
                <h6>Applicant Details</h6>
                <p><strong>Name:</strong> {{ selectedApplication.applicant_name }}</p>
                <p><strong>Email:</strong> {{ selectedApplication.applicant_email }}</p>
                <p><strong>Phone:</strong> {{ selectedApplication.applicant_phone }}</p>
              </div>
              <div class="col-12 mt-3">
                <h6>Cover Letter</h6>
                <p>{{ selectedApplication.cover_letter }}</p>
              </div>
              <div class="col-12 mt-3">
                <h6>Resume</h6>
                <a :href="selectedApplication.resume_url" target="_blank" class="btn btn-outline-primary">
                  <i class="bi bi-file-earmark-pdf"></i> View Resume
                </a>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useEmployerStore } from '@/stores/employerStore';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'ApplicationsManager',
  
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'applied_date',
      sortDirection: 'desc',
      selectedApplication: null,
      applicationModal: null
    };
  },

  computed: {
    store() {
      return useEmployerStore();
    },

    isLoading() {
      return this.store.getLoadingStatus;
    },

    error() {
      return this.store.getError;
    },

    applications() {
      return this.store.getApplications;
    },

    filteredApplications() {
      let filtered = [...this.applications];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(app => 
          app.job_title.toLowerCase().includes(query) ||
          app.applicant_name.toLowerCase().includes(query) ||
          app.status.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let compareA = a[this.sortField];
        let compareB = b[this.sortField];

        if (typeof compareA === 'string') {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }

        if (compareA < compareB) return this.sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    },

    paginatedApplications() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredApplications.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
    }
  },

  mounted() {
    this.loadApplications();
    this.applicationModal = new Modal(document.getElementById('applicationModal'));
  },

  methods: {
    async loadApplications() {
      try {
        await this.store.fetchDashboardData();
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    },

    handleSearch() {
      this.currentPage = 1;
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },

    getSortIcon(field) {
      if (this.sortField !== field) return 'bi bi-arrow-down-up';
      return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
    },

    getStatusBadgeClass(status) {
      const classes = {
        pending: 'badge bg-warning',
        accepted: 'badge bg-success',
        rejected: 'badge bg-danger'
      };
      return classes[status] || 'badge bg-secondary';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    viewApplication(application) {
      this.selectedApplication = application;
      this.applicationModal.show();
    },

    async handleApplication(applicationId, status) {
      try {
        await this.store.handleApplication(applicationId, status);
        await this.loadApplications();
      } catch (error) {
        console.error('Error handling application:', error);
      }
    }
  }
});
</script>

<style scoped>
.applications-manager {
  min-height: calc(100vh - 100px);
}

.search-filter {
  width: 300px;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal-body h6 {
  color: #666;
  margin-bottom: 15px;
}

.badge {
  font-size: 0.9em;
  padding: 6px 12px;
}
</style>
