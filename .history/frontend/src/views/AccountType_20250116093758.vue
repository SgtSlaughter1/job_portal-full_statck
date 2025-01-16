<template>
    <div class="account-type-selection">
        <router-link 
            :to="{ path: '/auth/register', query: { type: 'jobseeker' }}" 
            class="account-option">
            <!-- Job Seeker option content -->
        </router-link>

        <router-link 
            :to="{ path: '/auth/register', query: { type: 'employer' }}" 
            class="account-option">
            <!-- Employer option content -->
        </router-link>
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