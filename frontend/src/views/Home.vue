<template>
    <section class="hero-section py-5 bg-primary text-white">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 col-12">
                    <h1 class="display-5 fw-bold mb-4">"Unlock Your Future: The Career You Deserve Awaits!"</h1>
                    <p class="lead mb-4">
                        "Explore endless opportunities with leading companies around the globe. Start your journey to success today—your dream job is just a step away."
                    </p>
                    <div class="search-box bg-white p-2 rounded-pill shadow-lg">
                        <div class="input-group">
                            <input type="text" class="form-control border-0" placeholder="Search jobs by title, company, or keywords...">
                            <BaseButton class="rounded-pill px-4">
                                Search Jobs
                            </BaseButton>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 d-none d-lg-block">
                    <img src="/images/job.png" alt="Job Search" class="img-fluid">
                </div>
            </div>
        </div>
    </section>

    <section class="job-listings my-5">
        <h2>Featured Job Openings</h2>
        <div class="row justify-content-center">
            <div v-for="job in featuredJobs" :key="job.jobTitle" class="col-md-4 col-12 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">{{ job.jobTitle }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{ job.company }}</h6>
                        <div class="mb-3">
                            <span class="badge bg-info me-2">{{ job.location }}</span>
                            <span class="badge bg-success">{{ job.pay }}</span>
                        </div>
                        <p class="card-text">{{ job.description }}</p>
                        <BaseButton @click="viewJobDetails(job)" class="w-40 btn-primary">
                            View Details
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <HowItWorks/>

    <TrustedCompanies/>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import HowItWorks from '@/components/HowItWorks.vue';
import TrustedCompanies from '@/components/TrustedCompanies.vue';
import { useJobStore } from '@/stores/jobs';

export default {
    components: {
        BaseButton,
        TrustedCompanies,
        HowItWorks,
    },
    data() {
        return {
            jobStore: useJobStore()
        }
    },
    computed: {
        featuredJobs() {
            return this.jobStore.getJobs.slice(0, 3);
        }
    },

    methods: {
        viewJobDetails(job) {
            this.$router.push(`/jobs/${job.id}`);
        }
    },
    created() {
        this.jobStore.fetchJobs();
    }
}
</script>

<style scoped>
.hero-section {
    overflow: hidden;
    background: linear-gradient(135deg, #4a90e2 0%, #2c3e50 100%);

}


.search-box {
    max-width: 100%;
    margin: 20px auto;
}

.search-box .form-control:focus {
    box-shadow: none;
    border-color: #007bff;
}

.job-listings {
    margin: 40px 0;
    width: 90%;
    margin: 0 auto;
}

.job-listings h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5rem;
    color: #007bff;
}

.card {
    margin: 15px;
    border: none;
    border-radius: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.card-body {
    padding: 20px;
}

.card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
}

.card-text {
    color: #555;
    font-size: 0.9rem;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    padding: 10px 20px;
    border-radius: 25px;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
    transform: scale(1.05);
}

</style>