<template>
    <button 
        :class="buttonClass" 
        @click="handleClick"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'BaseButton',
    
    props: {
        buttonClass: {
            type: String,
            default: 'btn btn-primary'
        },
        onClick: {
            type: Function,
            default: () => {}
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        handleClick(event) {
            if (!this.disabled) {
                this.$emit('click', event);
                this.onClick(event);
            }
        }
    }
};
</script>

<style scoped>
/* You can add additional styles here if needed */
</style> 