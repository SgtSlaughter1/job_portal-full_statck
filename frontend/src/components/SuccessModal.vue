<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <div class="success-icon">
                <i class="bi" :class="iconClass"></i>
            </div>
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="mt-4 d-flex justify-content-center gap-2">
                <BaseButton @click="handleClose" variant="success">{{ buttonText }}</BaseButton>
                <BaseButton 
                    v-if="secondaryAction"
                    @click="handleSecondaryAction" 
                    variant="outline-secondary"
                >
                    {{ secondaryButtonText }}
                </BaseButton>
            </div>
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
            default: 'register',
            validator: (value) => [
                'register',
                'employer-register',
                'jobseeker-register',
                'login',
                'job-post',
                'job-application',
                'profile-update',
                'job-delete',
                'application-withdraw'
            ].includes(value)
        }
    },
    computed: {
        iconClass() {
            const icons = {
                'register': 'bi-person-check',
                'employer-register': 'bi-building-check',
                'jobseeker-register': 'bi-person-check',
                'login': 'bi-box-arrow-in-right',
                'job-post': 'bi-briefcase-fill',
                'job-application': 'bi-file-earmark-check',
                'profile-update': 'bi-person-gear',
                'job-delete': 'bi-trash-check',
                'application-withdraw': 'bi-file-earmark-x'
            };
            return icons[this.type] || 'bi-check-lg';
        },
        title() {
            const titles = {
                'register': 'Registration Successful!',
                'employer-register': 'Employer Registration Successful!',
                'jobseeker-register': 'Job Seeker Registration Successful!',
                'login': 'Login Successful!',
                'job-post': 'Job Posted Successfully!',
                'job-application': 'Application Submitted!',
                'profile-update': 'Profile Updated!',
                'job-delete': 'Job Deleted Successfully',
                'application-withdraw': 'Application Withdrawn'
            };
            return titles[this.type] || 'Success!';
        },
        message() {
            const messages = {
                'register': 'Your account has been created successfully.',
                'employer-register': 'Your employer account has been created successfully. You can now post jobs and manage applications.',
                'jobseeker-register': 'Your job seeker account has been created successfully. You can now browse and apply for jobs.',
                'login': 'Welcome back! You have been logged in successfully.',
                'job-post': 'Your job posting has been published and is now visible to potential candidates.',
                'job-application': 'Your application has been submitted successfully. The employer will review it shortly.',
                'profile-update': 'Your profile changes have been saved successfully.',
                'job-delete': 'The job posting has been removed from the platform.',
                'application-withdraw': 'Your application has been withdrawn successfully.'
            };
            return messages[this.type] || 'Operation completed successfully.';
        },
        buttonText() {
            const buttons = {
                'register': 'Continue to Login',
                'employer-register': 'Continue to Login',
                'jobseeker-register': 'Continue to Login',
                'login': 'Go to Dashboard',
                'job-post': 'View Job Posting',
                'job-application': 'View My Applications',
                'profile-update': 'Back to Profile',
                'job-delete': 'Back to Jobs',
                'application-withdraw': 'Browse More Jobs'
            };
            return buttons[this.type] || 'Continue';
        },
        secondaryAction() {
            return ['job-post', 'job-application'].includes(this.type);
        },
        secondaryButtonText() {
            const buttons = {
                'job-post': 'Post Another Job',
                'job-application': 'Continue Browsing'
            };
            return buttons[this.type] || '';
        }
    },
    emits: ['close', 'secondary-action'],
    methods: {
        handleClose() {
            this.$emit('close');
        },
        handleSecondaryAction() {
            this.$emit('secondary-action');
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    font-size: 1.5rem;
    margin: 0 auto 1rem;
    transition: transform 0.3s ease;
}

.success-icon:hover {
    transform: scale(1.1);
}

h3 {
    color: #28a745;
    margin-bottom: 1rem;
    font-weight: 600;
}

p {
    color: #6c757d;
    line-height: 1.5;
    margin-bottom: 0;
}
</style>