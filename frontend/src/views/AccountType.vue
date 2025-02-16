<template>
    <div class="account-type-container">
        <!-- Add the SVG blob background -->
        <div class="blob-container">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="blobBg">
                <path
                    fill="#0d6efd"
                    d="M66.2,-49.1C81.5,-33.5,86.8,-6.2,79.8,15.6C72.7,37.5,53.3,53.9,30.9,65.1C8.5,76.2,-16.9,81.9,-36.2,73.3C-55.5,64.7,-68.8,41.7,-70.8,19.9C-72.8,-2,-63.6,-22.7,-49.9,-37.8C-36.2,-53,-18.1,-62.7,3.6,-65.6C25.4,-68.5,50.8,-64.6,66.2,-49.1Z"
                    transform="translate(100 100)"
                />
            </svg>
        </div>

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
.account-type-container {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background: linear-gradient(rgba(13, 110, 253, 0.3), rgba(13, 110, 253, 0.3)), url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.blob-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.blobBg {
    position: absolute;
    width: 800px;
    height: 800px;
    right: -400px;
    top: -400px;
    opacity: 0.1;
    animation: rotate 20s infinite linear;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.account-type-card {
    cursor: pointer;
    transition: transform 0.2s;
    width: 70%;
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