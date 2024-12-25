<template>
    <button :class="buttonClass" @click="handleClick">
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
        }
    },
    methods: {
        handleClick(event) {
            this.onClick(event);
        }
    }
}
</script>

<style scoped>
/* You can add additional styles here if needed */
</style> 