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
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Applications Table -->
    <div v-if="!loading" class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applicant</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in paginatedApplications" :key="application.id">
                <td>{{ application.job?.title }}</td>
                <td>{{ application.job_seeker?.name }}</td>
                <td>{{ formatDate(application.created_at) }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <span :class="getStatusBadgeClass(application.status)">
                      {{ application.status }}
                    </span>
                    
                    <!-- Only show for employers with pending applications -->
                    <div v-if="application.status === 'pending'" class="ms-2">
                      <button 
                        class="btn btn-sm btn-success me-1" 
                        @click="handleApplicationStatus(application, 'accepted')"
                        title="Accept Application"
                      >
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-danger" 
                        @click="handleApplicationStatus(application, 'rejected')"
                        title="Reject Application"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
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
                <h6 class="mb-3">Job Details</h6>
                <p><strong>Job Title:</strong> {{ getApplicationDetails(selectedApplication).title }}</p>
                <p><strong>Company:</strong> {{ getApplicationDetails(selectedApplication).company }}</p>
                <p><strong>Industry:</strong> {{ selectedApplication.job?.employer?.industry || 'N/A' }}</p>
                <p><strong>Location:</strong> {{ selectedApplication.job?.employer?.location || 'N/A' }}</p>
                <p><strong>Created Date:</strong> {{ selectedApplication.job?.created_date || 'N/A' }}</p>
                <p><strong>Deadline:</strong> {{ selectedApplication.job?.deadline_date || 'N/A' }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="mb-3">Applicant Details</h6>
                <p><strong>Name:</strong> {{ selectedApplication.job_seeker?.name || 'N/A' }}</p>
                <p><strong>Email:</strong> {{ selectedApplication.job_seeker?.email || 'N/A' }}</p>
                <p><strong>Applied Date:</strong> {{ formatDate(selectedApplication.created_at) || 'N/A' }}</p>
                <p><strong>Status:</strong> <span :class="getStatusBadgeClass(selectedApplication.status)">{{ selectedApplication.status }}</span></p>
              </div>
              <div class="col-12 mt-3">
                <h6>Cover Letter</h6>
                <p>{{ selectedApplication.cover_letter }}</p>
              </div>
              <div class="col-12 mt-3">
                <div v-if="selectedApplication.resume_url || (selectedApplication.job_seeker && selectedApplication.job_seeker.resume_url) || (selectedApplication.jobSeeker && selectedApplication.jobSeeker.resume_url)" class="mt-3">
                  <button 
                    @click="viewResume(selectedApplication)" 
                    class="btn btn-outline-primary"
                  >
                    <i class="bi bi-file-earmark-pdf"></i> View Resume
                  </button>
                  <p v-if="resumeError" class="text-danger mt-2 alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ resumeError }}
                  </p>
                </div>
                <div v-else class="mt-3 text-warning alert alert-warning">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  No resume available for this application.
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Notes Modal -->
    <div class="modal fade" id="applicationNotesModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update Application Status</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="employerNotes">Notes:</label>
              <textarea class="form-control" id="employerNotes" v-model="employerNotes" rows="5"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="confirmStatusUpdate">Update Status</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useApplicationStore } from '@/stores/applications';
import { mapActions, mapState, mapGetters } from 'pinia';
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'ApplicationsManager',
  
  setup() {
    const applicationStore = useApplicationStore();
    return { applicationStore };
  },

  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      selectedApplication: null,
      applicationModal: null,
      searchTimeout: null,
      statusFilter: '',
      currentApplication: null,
      statusToUpdate: null,
      employerNotes: '',
      isDebug: true,
      resumeError: null
    };
  },

  computed: {
    store() {
      return this.applicationStore;
    },

    ...mapState(useApplicationStore, [
      'loading',
      'error'
    ]),
    ...mapGetters(useApplicationStore, [
      'getApplications'
    ]),

    applications() {
      const apps = this.store.applications;
      return Array.isArray(apps) ? apps : (apps?.data || []);
    },

    filteredApplications() {
      const apps = this.applications;

      return apps.filter(application => {
        const searchTerm = this.searchQuery.toLowerCase();
        
        if (application.job) {
          return (
            (application.job.title || '').toLowerCase().includes(searchTerm) ||
            (application.status || '').toLowerCase().includes(searchTerm)
          );
        } else if (application.jobSeeker) {
          return (
            (application.jobSeeker.name || '').toLowerCase().includes(searchTerm) ||
            (application.job?.title || '').toLowerCase().includes(searchTerm) ||
            (application.status || '').toLowerCase().includes(searchTerm)
          );
        }

        return false;
      });
    },

    paginatedApplications() {
      const filtered = this.filteredApplications;
      const start = (this.currentPage - 1) * 10; 
      const end = start + 10;
      return filtered.slice(start, end);
    },

    totalPages() {
      const filtered = this.filteredApplications;
      return Math.ceil(filtered.length / 10); 
    }
  },

  methods: {
    ...mapActions(useApplicationStore, ['fetchApplications']),

    async loadApplications() {
      try {
        this.store.error = null;

        await this.store.fetchApplications(this.currentPage, {
          status: this.statusFilter,
          search: this.searchQuery
        });
      } catch (error) {
        this.store.error = error.message || 'Failed to load applications. Please try again.';
        console.error('Applications load error:', error);
      }
    },

    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadApplications();
      }, 300);
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadApplications();
      }
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
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    getApplicationDetails(application) {
      if (application.job) {
        return {
          title: application.job.title,
          company: application.job.employer?.company_name || 'Unknown Company'
        };
      }
      
      if (application.jobSeeker) {
        return {
          title: application.jobSeeker.name,
          company: application.job?.title || 'Unknown Job'
        };
      }

      return { title: 'Unknown', company: 'Unknown' };
    },

    getResumeUrl(application) {
      // Check direct resume_url first
      let resumeUrl = application.resume_url || 
        application.job_seeker?.resume_url || 
        application.jobSeeker?.resume_url;

      // If URL is relative, prepend the base URL
      if (resumeUrl && resumeUrl.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        resumeUrl = `${baseUrl}${resumeUrl}`;
      }

      return resumeUrl;
    },

    viewResume(application) {
      // Reset any previous error state
      this.resumeError = null;

      // Retrieve resume URL
      const resumeUrl = this.getResumeUrl(application);

      // Validate resume URL
      if (!resumeUrl) {
        this.resumeError = 'No resume available for this application.';
        console.warn('Resume URL not found');
        return;
      }

      try {
        // Attempt to open resume in a new tab
        const newWindow = window.open(resumeUrl, '_blank');

        // Fallback for browsers blocking window.open
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.warn('Direct window open failed, attempting alternative method');
          
          // Fetch and create blob URL as a fallback
          fetch(resumeUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.blob();
            })
            .then(blob => {
              const pdfUrl = URL.createObjectURL(blob);
              window.open(pdfUrl, '_blank');
            })
            .catch(error => {
              console.error('Resume fetch error:', error);
              this.resumeError = 'Failed to load resume. Please try downloading manually.';
            });
        }
      } catch (error) {
        console.error('Resume view error:', error);
        this.resumeError = 'Unable to open resume. Please contact support.';
      }
    },

    viewApplication(application) {
      this.selectedApplication = application;
      this.resumeError = null; // Reset any previous errors

      console.log('Selected Application:', JSON.parse(JSON.stringify(application)));
      console.log('Resume URL:', 
        application.resume_url || 
        (application.job_seeker ? application.job_seeker.resume_url : 'Not found') ||
        (application.jobSeeker ? application.jobSeeker.resume_url : 'Not found')
      );

      if (!this.applicationModal) {
        this.applicationModal = new Modal(document.getElementById('applicationModal'));
      }
      this.applicationModal.show();
    },

    async handleApplication(applicationId, status) {
      try {
        await this.store.handleApplication(applicationId, status);
        await this.loadApplications();
      } catch (error) {
        console.error('Error handling application:', error);
      }
    },

    async handleApplicationStatus(application, status) {
      try {
        // Confirm status change
        const confirmMessage = `Are you sure you want to ${status} this application?`;
        if (!confirm(confirmMessage)) {
          return;
        }

        // Open notes modal for additional context
        this.currentApplication = application;
        this.statusToUpdate = status;
        
        // Show notes modal using imported Modal
        const modalElement = document.getElementById('applicationNotesModal');
        const notesModal = new Modal(modalElement);
        notesModal.show();
      } catch (error) {
        console.error('Error preparing application status update:', error);
      }
    },

    async confirmStatusUpdate() {
      try {
        // Validate notes if needed
        await this.store.updateApplicationStatus(
          this.currentApplication.id, 
          this.statusToUpdate, 
          this.employerNotes
        );

        // Close the notes modal
        const notesModal = Modal.getInstance(document.getElementById('applicationNotesModal'));
        notesModal.hide();

        // Reset notes and current application
        this.employerNotes = '';
        this.currentApplication = null;
        this.statusToUpdate = null;

        // Optional: Show success message
        this.$toast.success('Application status updated successfully');
      } catch (error) {
        // Show error message
        this.$toast.error(error.message || 'Failed to update application status');
      }
    },

    async applyForJob(jobId) {
      try {
        this.loading = true;
        this.error = null;

        // Create FormData object
        const formData = new FormData();
        formData.append('job_id', jobId);
        
        // Add cover letter if provided
        if (this.coverLetter) {
          formData.append('cover_letter', this.coverLetter);
        }
        
        // Add resume file
        if (this.resumeFile) {
          formData.append('resume', this.resumeFile);
        } else {
          throw new Error('Please select a resume file');
        }

        // Submit application
        const response = await jobSeekerApi.applyForJob(formData);
        
        // Show success message
        this.$toast.success('Application submitted successfully');
        
        // Refresh applications list
        await this.fetchApplications();
        
        return response.data;
      } catch (error) {
        console.error('Application submission failed:', error);
        
        // Show error message
        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Failed to submit application';
          
        this.$toast.error(errorMessage);
        this.error = errorMessage;
        
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.loadApplications();
    this.applicationModal = new Modal(document.getElementById('applicationModal'));
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
