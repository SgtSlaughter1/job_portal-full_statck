<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="success-icon">✓</div>
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <BaseButton @click="handleClose" class="mt-3">{{ buttonText }}</BaseButton>
        </div>
    </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';

export default {
    name: 'SuccessModal',
    components: {
        BaseButton
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'register', // 'register' or 'login'
            validator: (value) => ['register', 'login'].includes(value)
        }
    },
    computed: {
        title() {
            return this.type === 'register' ? 'Registration Successful!' : 'Login Successful!';
        },
        message() {
            return this.type === 'register' 
                ? 'Your account has been created successfully.'
                : 'Welcome back! You have been logged in successfully.';
        },
        buttonText() {
            return this.type === 'register' ? 'Continue to Login' : 'Continue to Dashboard';
        }
    },
    emits: ['close'],
    methods: {
        handleClose() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    width: 90%;
}

.success-icon {
    background-color: #28a745;
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    margin: 0 auto 1rem;
}

h3 {
    color: #28a745;
    margin-bottom: 1rem;
}
</style>