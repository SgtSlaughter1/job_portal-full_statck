
<template>
    <section class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">How It Works</h2>
            <div class="row g-4">
                <div v-for="(step, index) in steps" :key="index" class="col-md-6 col-lg-3"
                    @click="handleStepClick(step.title)" 
                    :class="{ 'cursor-pointer': step.title === 'Create Account' || step.title === 'Search Jobs' }">
                    <div class="step-card text-center p-4 bg-white rounded-3 shadow-sm h-100">
                        <div class="step-icon display-4 mb-3">{{ step.icon }}</div>
                        <h4 class="step-title mb-3">{{ step.title }}</h4>
                        <p class="text-muted mb-0">{{ step.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleStepClick = (title) => {
    if (title === 'Create Account') {
        router.push('/account-type');
    }
    if (title === 'Search Jobs') {
        router.push('/jobs');
    }
};

const steps = [
    {
        icon: '👤',
        title: 'Create Account',
        description: 'Sign up as a job seeker or employer in minutes'
    },
    {
        icon: '🔍',
        title: 'Search Jobs',
        description: 'Browse thousands of jobs from top companies'
    },
    {
        icon: '📝',
        title: 'Apply Easily',
        description: 'Quick apply with your profile and resume'
    },
    {
        icon: '🎯',
        title: 'Track your application',
        description: 'Land your dream job and start your new career'
    }
]
</script>

<style scoped>
.step-card {
    transition: transform 0.2s;
}

.step-card:hover {
    transform: translateY(-5px);
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer .step-card:hover {
    background-color: #f8f9fa;
    border: 1px solid #007bff;
}
</style>