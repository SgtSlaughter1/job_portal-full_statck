<template>
    <div class="container my-5">
        <h2 class="text-center mb-5">Choose Your Account Type</h2>
        
        <div class="row justify-content-center g-4">
            <!-- Job Seeker Card -->
            <div class="col-md-5">
                <div class="account-type-card h-100" @click="selectType('jobseeker')">
                    <div class="card border-0 shadow h-100">
                        <div class="card-body text-center p-4">
                            <div class="icon-wrapper mb-4">
                                <i class="bi bi-person-badge fs-1"></i>
                            </div>
                            <h3 class="card-title mb-3">Job Seeker</h3>
                            <ul class="feature-list text-start">
                                <li>Create your professional profile</li>
                                <li>Browse and apply to jobs</li>
                                <li>Track your applications</li>
                                <li>Get job recommendations</li>
                                <li>Upload resume and portfolio</li>
                            </ul>
                            <button class="btn btn-primary mt-4">
                                Create Job Seeker Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Employer Card -->
            <div class="col-md-5">
                <div class="account-type-card h-100" @click="selectType('employer')">
                    <div class="card border-0 shadow h-100">
                        <div class="card-body text-center p-4">
                            <div class="icon-wrapper mb-4">
                                <i class="bi bi-building fs-1"></i>
                            </div>
                            <h3 class="card-title mb-3">Employer</h3>
                            <ul class="feature-list text-start">
                                <li>Post unlimited job listings</li>
                                <li>Manage applications efficiently</li>
                                <li>Company profile customization</li>
                                <li>Access candidate database</li>
                                <li>Analytics and reporting</li>
                            </ul>
                            <button class="btn btn-primary mt-4">
                                Create Employer Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccountType',
    
    methods: {
        selectType(type) {
            this.$router.push({
                path: '/auth/register',
                query: { type }
            });
        }
    }
};
</script>

<style scoped>
.account-type-card {
    cursor: pointer;
    transition: transform 0.2s;
}

.account-type-card:hover {
    transform: translateY(-5px);
}

.icon-wrapper {
    color: #007bff;
}

.feature-list {
    list-style: none;
    padding-left: 0;
}

.feature-list li {
    margin: 10px 0;
    padding-left: 25px;
    position: relative;
}

.feature-list li::before {
    content: "✓";
    color: #28a745;
    position: absolute;
    left: 0;
}

.card {
    border-radius: 1rem;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
}
</style> 