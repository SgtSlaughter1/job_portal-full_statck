<template>
    <div class="dashboard-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <!-- Dashboard Content -->
        <div v-if="!isLoading && profile" class="container py-4">
            <!-- Welcome Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card welcome-card">
                        <div class="card-body">
                            <h2 class="card-title">
                                <i class="bi bi-person-circle me-2"></i>
                                Welcome, {{ userRole === 'employer' ? profile.company_name : profile.name }}!
                            </h2>
                            <p class="card-text text-muted">
                                Member since {{ formatDate(profile.created_at) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-3" v-for="(value, key) in dashboardStats" :key="key">
                    <div class="card stat-card h-100">
                        <div class="card-body text-center">
                            <i :class="getStatIcon(key)" class="bi fs-1 mb-2"></i>
                            <h5 class="card-title text-capitalize">{{ formatStatTitle(key) }}</h5>
                            <p class="card-text display-6">{{ value }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card profile-card">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">
                                <i class="bi" :class="userRole === 'employer' ? 'bi-building' : 'bi-person'"></i>
                                {{ userRole === 'employer' ? 'Company Profile' : 'Profile' }}
                            </h3>
                            <button class="btn btn-light btn-sm" @click="$router.push('/edit-profile')">
                                Edit Profile
                            </button>
                        </div>
                        <div class="card-body">
                            <!-- Employer Profile -->
                            <div v-if="userRole === 'employer'" class="row">
                                <div class="col-md-6">
                                    <p><strong>Company Name:</strong> {{ profile.company_name }}</p>
                                    <p><strong>Industry:</strong> {{ profile.industry }}</p>
                                    <p><strong>Location:</strong> {{ profile.location }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Email:</strong> {{ profile.email }}</p>
                                    <p><strong>Phone:</strong> {{ profile.phone }}</p>
                                    <p><strong>Website:</strong> {{ profile.website || 'Not provided' }}</p>
                                </div>
                                <div class="col-12 mt-3">
                                    <p><strong>Description:</strong></p>
                                    <p>{{ profile.company_description }}</p>
                                </div>
                            </div>

                            <!-- Job Seeker Profile -->
                            <div v-else class="row">
                                <div class="col-md-6">
                                    <p><strong>Name:</strong> {{ profile.name }}</p>
                                    <p><strong>Email:</strong> {{ profile.email }}</p>
                                    <p><strong>Phone:</strong> {{ profile.phone }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Education:</strong> {{ profile.education_level }}</p>
                                    <p><strong>Experience:</strong> {{ profile.experience_years }} years</p>
                                    <p><strong>Location:</strong> {{ profile.location }}</p>
                                </div>
                                <div class="col-12 mt-3">
                                    <p><strong>Skills:</strong></p>
                                    <div class="d-flex flex-wrap gap-2">
                                        <span v-for="skill in profile.skills" :key="skill" class="badge bg-secondary">
                                            {{ skill }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Items Section (Jobs/Applications) -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">
                                <i class="bi" :class="userRole === 'employer' ? 'bi-briefcase' : 'bi-file-earmark-text'"></i>
                                {{ userRole === 'employer' ? 'Posted Jobs' : 'My Applications' }}
                            </h3>
                            <div class="d-flex gap-2">
                                <!-- Search Input -->
                                <input 
                                    type="text" 
                                    v-model="searchQuery" 
                                    class="form-control form-control-sm" 
                                    :placeholder="userRole === 'employer' ? 'Search jobs...' : 'Search applications...'"
                                    @input="handleSearch"
                                >
                                <!-- Filter Dropdown -->
                                <select 
                                    v-model="filterStatus" 
                                    class="form-select form-select-sm" 
                                    style="width: auto;"
                                    @change="handleFilter"
                                >
                                    <option value="">All Status</option>
                                    <option v-for="status in statusOptions" :key="status" :value="status">
                                        {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                                    </option>
                                </select>
                                <!-- New Job Button (for employers) -->
                                <button 
                                    v-if="userRole === 'employer'"
                                    class="btn btn-light btn-sm"
                                    @click="$router.push('/jobs/create')"
                                >
                                    <i class="bi bi-plus-lg"></i> New Job
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <!-- Items Table -->
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th @click="sortBy('title')" class="sortable">
                                                {{ userRole === 'employer' ? 'Job Title' : 'Position' }}
                                                <i class="bi" :class="getSortIcon('title')"></i>
                                            </th>
                                            <th @click="sortBy('created_at')" class="sortable">
                                                Date
                                                <i class="bi" :class="getSortIcon('created_at')"></i>
                                            </th>
                                            <th @click="sortBy('status')" class="sortable">
                                                Status
                                                <i class="bi" :class="getSortIcon('status')"></i>
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in paginatedItems" :key="item.id">
                                            <td>{{ item.title }}</td>
                                            <td>{{ formatDate(item.created_at) }}</td>
                                            <td>
                                                <span :class="getStatusBadgeClass(item.status)">
                                                    {{ item.status }}
                                                </span>
                                            </td>
                                            <td>
                                                <div class="btn-group">
                                                    <button 
                                                        class="btn btn-sm btn-outline-primary"
                                                        @click="viewDetails(item)"
                                                    >
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                    <button 
                                                        v-if="userRole === 'employer'"
                                                        class="btn btn-sm btn-outline-secondary"
                                                        @click="editItem(item)"
                                                    >
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        class="btn btn-sm btn-outline-danger"
                                                        @click="confirmDelete(item)"
                                                    >
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="paginatedItems.length === 0">
                                            <td colspan="4" class="text-center py-4">
                                                No items found
                                            </td>
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
                                        :class="{ active: currentPage === page }"
                                    >
                                        <a class="page-link" href="#" @click.prevent="changePage(page)">
                                            {{ page }}
                                        </a>
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
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this {{ userRole === 'employer' ? 'job' : 'application' }}?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteItem">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useEmployerStore } from '@/stores/employerStore';
import { useJobSeekerStore } from '@/stores/jobSeekerStore';
import { useAuthStore } from '@/stores/auth';
import { Modal } from 'bootstrap';

export default defineComponent({
    name: 'Dashboard',
    
    data() {
        return {
            deleteModal: null,
            itemToDelete: null,
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'created_at',
            sortDirection: 'desc',
            searchQuery: '',
            filterStatus: '',
            statusOptions: ['open', 'closed', 'pending', 'approved', 'rejected']
        };
    },

    computed: {
        store() {
            return this.userRole === 'employer' ? useEmployerStore() : useJobSeekerStore();
        },
        
        authStore() {
            return useAuthStore();
        },
        
        userRole() {
            return this.authStore.userType;
        },
        
        profile() {
            return this.store.getProfile;
        },
        
        isLoading() {
            return this.store.getLoadingStatus;
        },
        
        error() {
            return this.store.getError;
        },
        
        dashboardStats() {
            return this.store.dashboardStats;
        },
        
        filteredItems() {
            let items = this.store.getItems || [];
            
            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                items = items.filter(item => 
                    item.title?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query)
                );
            }
            
            // Apply status filter
            if (this.filterStatus) {
                items = items.filter(item => item.status === this.filterStatus);
            }
            
            // Apply sorting
            items.sort((a, b) => {
                const aValue = a[this.sortField];
                const bValue = b[this.sortField];
                
                if (this.sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            
            return items;
        },
        
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredItems.slice(start, start + this.itemsPerPage);
        },
        
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        }
    },

    watch: {
        userRole: {
            immediate: true,
            handler(newRole) {
                if (newRole) {
                    this.loadDashboardData();
                }
            }
        }
    },

    mounted() {
        this.deleteModal = new Modal(document.getElementById('deleteModal'));
    },

    methods: {
        async loadDashboardData() {
            try {
                await this.store.fetchDashboardData();
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                // If unauthorized, let the API interceptor handle the redirect
            }
        },
        
        handleSearch() {
            this.currentPage = 1;
        },
        
        handleFilter() {
            this.currentPage = 1;
        },
        
        sortBy(field) {
            if (field === this.sortField) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortDirection = 'asc';
            }
        },
        
        getSortIcon(field) {
            if (field !== this.sortField) return 'bi-arrow-down-up';
            return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
        },
        
        getStatIcon(key) {
            const icons = {
                totalJobs: 'bi-briefcase',
                activeJobs: 'bi-check-circle',
                totalApplications: 'bi-file-earmark-text',
                pendingApplications: 'bi-hourglass-split',
                approvedApplications: 'bi-check-square',
                rejectedApplications: 'bi-x-square'
            };
            return icons[key] || 'bi-graph-up';
        },
        
        formatStatTitle(key) {
            return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        },
        
        getStatusBadgeClass(status) {
            const classes = {
                open: 'bg-success',
                closed: 'bg-danger',
                pending: 'bg-warning',
                approved: 'bg-success',
                rejected: 'bg-danger'
            };
            return `badge ${classes[status] || 'bg-secondary'}`;
        },
        
        formatDate(date) {
            if (!date) return '';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        
        viewDetails(item) {
            const route = this.userRole === 'employer' 
                ? `/jobs/${item.id}` 
                : `/applications/${item.id}`;
            this.$router.push(route);
        },
        
        editItem(item) {
            const route = this.userRole === 'employer'
                ? `/jobs/${item.id}/edit`
                : `/applications/${item.id}/edit`;
            this.$router.push(route);
        },
        
        confirmDelete(item) {
            this.itemToDelete = item;
            this.deleteModal.show();
        },
        
        async deleteItem() {
            if (!this.itemToDelete) return;
            
            try {
                if (this.userRole === 'employer') {
                    await this.store.deleteJob(this.itemToDelete.id);
                } else {
                    await this.store.withdrawApplication(this.itemToDelete.id);
                }
                
                this.deleteModal.hide();
                this.itemToDelete = null;
                
                // Refresh dashboard data
                await this.loadDashboardData();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    }
});
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.welcome-card {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
}

.stat-card {
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.sortable {
    cursor: pointer;
}

.sortable:hover {
    background-color: #f8f9fa;
}

.btn-group .btn {
    padding: 0.25rem 0.5rem;
}

.table th {
    white-space: nowrap;
}

.badge {
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .stat-card {
        margin-bottom: 1rem;
    }
    
    .table-responsive {
        font-size: 0.875rem;
    }
}
</style>
