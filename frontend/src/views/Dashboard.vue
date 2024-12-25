<template>
    <div class="profile-container">
        <h2 class="profile-title">User Profile</h2>
        <div class="profile-info">
            <div v-if="user.role === 'employer'">
                <h3>Company Details:</h3>
                <p><strong>Company Name:</strong> {{ companyDetails.name }}</p>
                <p><strong>Company Email:</strong> {{ companyDetails.email }}</p>
                <p><strong>Company Phone:</strong> {{ companyDetails.phone }}</p>
                <p><strong>Company Size:</strong> {{ companyDetails.companySize }}</p>
                <p><strong>Company Industry:</strong> {{ companyDetails.industry }}</p>
                <p><strong>Located At:</strong> {{ companyDetails.location }}</p>
                <h3>Registered Job Seekers:</h3>
                <ul>
                    <li v-for="jobSeeker in jobSeekers" :key="jobSeeker.id">
                        {{ jobSeeker.name }} - {{ jobSeeker.email }}
                    </li>
                </ul>
            </div>
            <div v-else-if="user.role === 'seeker'">
                <h3>Applications Submitted:</h3>
                <ul>
                    <li v-for="application in applications" :key="application.id">
                        {{ application.position }} - {{ application.company }}
                    </li>
                </ul>
                <h3>Your Details:</h3>
                <p><strong>Experience:</strong> {{ userDetails.experience }}</p>
                <p><strong>Skills:</strong> {{ userDetails.skills.join(', ') }}</p>
                <p><strong>Phone:</strong> {{ userDetails.phone }}</p>
            </div>
        </div>
        <router-link to="/edit-profile" class="btn btn-primary">Edit Profile</router-link>
        {{ edit_2 }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: '',
                email: '',
                joinedDate: '',
                role: ''
            },
            companyDetails: {
                name: '',
                email: '',
                phone: '',
                companySize: '',
                industry: '',
                location: ''
            },
            jobSeekers: [],
            applications: [],
            userDetails: {
                experience: '',
                skills: [],
                phone: ''
            }
        };
    },
    created() {
        this.loadUserProfile();
        this.loadAdditionalData();
    },
    methods: {
        loadUserProfile() {
            const existingData = JSON.parse(localStorage.getItem('userData')) || [];
            const loggedInUser = existingData.find(user => user.name === localStorage.getItem('username'));
            if (loggedInUser) {
                this.user = {
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    joinedDate: loggedInUser.joinedDate,
                    role: loggedInUser.role
                };
                if (this.user.role === 'seeker') {
                    this.userDetails = {
                        experience: loggedInUser.experience || 'N/A',
                        skills: loggedInUser.skills ? loggedInUser.skills.split(',').map(skill => skill.trim()) : [],
                        phone: loggedInUser.phone || 'N/A'
                    };
                } else if (this.user.role === 'employer') {
                    this.companyDetails = {
                        name: loggedInUser.name || 'N/A',
                        email: loggedInUser.email || 'N/A',
                        phone: loggedInUser.phone || 'N/A',
                        companySize: loggedInUser.companySize || 'N/A',
                        industry: loggedInUser.industry || 'N/A',
                        location: loggedInUser.location || 'N/A'
                    };
                }
            }
        },
        loadAdditionalData() {
            if (this.user.role === 'employer') {
                this.jobSeekers = [
                    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
                    { id: 2, name: 'Bob Brown', email: 'bob@example.com' }
                ];
            } else if (this.user.role === 'job seeker') {
                this.applications = [
                    { id: 1, position: 'Software Engineer', company: 'Tech Corp' },
                    { id: 2, position: 'Product Manager', company: 'Business Inc' }
                ];
            }
        }
    }
}
</script>

<style scoped>
.profile-container {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
}

.profile-title {
    text-align: center;
    margin-bottom: 20px;
}

.profile-info {
    margin-bottom: 20px;
}
</style>
