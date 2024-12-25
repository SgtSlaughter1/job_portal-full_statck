<template>
    <div class="features-page">
        <h2 class="text-center mb-5">Choose Your Account Type</h2>
        <section class="features row my-5">
            <div class="col-md-5 col-12 text-center mb-4">
                <div class="feature-card">
                    <div class="icon-wrapper mb-4">👤</div>
                    <h3>For Job Seekers</h3>
                    <ul class="feature-list">
                        <li>Create your professional profile</li>
                        <li>Upload your resume and portfolio</li>
                        <li>Apply to jobs with one click</li>
                        <li>Track your job applications</li>
                    </ul>
                    <BaseButton @click="goToRegister('seeker')" class="mt-3">Create Job Seeker Account</BaseButton>
                </div>
            </div>
            <div class="col-md-5 col-12 text-center mb-4">
                <div class="feature-card">
                    <div class="icon-wrapper mb-4">🏢</div>
                    <h3>For Employers</h3>
                    <ul class="feature-list">
                        <li>Post unlimited job listings</li>
                        <li>Access candidate database</li>
                        <li>Manage applications efficiently</li>
                        <li>Company profile customization</li>
                    </ul>
                    <BaseButton @click="goToRegister('employer')" class="mt-3">Create Employer Account</BaseButton>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import { useRouter } from 'vue-router';

export default {
    name: 'AccountType',
    components: {
        BaseButton
    },
    setup() {
        const router = useRouter();

        const goToRegister = (type) => {
            router.push({
                path: '/register',
                query: { type }
            });
        };

        return {
            goToRegister
        };
    },
    methods: {
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
.features-page {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.features {
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 30px;
    margin: 40px auto;
}

.feature-card {
    border: none;
    border-radius: 10px;
    padding: 40px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

h3 {
    font-size: 1.75rem;
    margin-bottom: 20px;
    color: #007bff;
}

p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 30px;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
    text-align: left;
}

.feature-list li {
    margin: 10px 0;
    padding-left: 25px;
    position: relative;
}

.feature-list li::before {
    content: "✓";
    color: #007bff;
    position: absolute;
    left: 0;
}

.icon-wrapper {
    font-size: 3rem;
}
</style> 