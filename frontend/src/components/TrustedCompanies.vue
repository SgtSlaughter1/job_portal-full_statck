<script setup>
const companies = [
    { name: 'Google', logo: '/images/companies/Google-Logo.png' },
    { name: 'Microsoft', logo: '/images/companies/microsoft log.png' },
    { name: 'Apple', logo: '/images/companies/apple.png' },
    { name: 'Amazon', logo: '/images/companies/Amazon_logo.svg.png' },
    { name: 'Meta', logo: '/images/companies/Meta-Logo.png' },
    { name: 'Netflix', logo: '/images/companies/netflix.png' }
]
</script>

<template>
    <section class="py-5">
        <div class="container">
            <h2 class="text-center mb-5 text-primary">Trusted by Leading Companies</h2>
            <div class="row align-items-center justify-content-center">
                <div v-for="company in companies" :key="company.name" class="col-4 col-md-4 mb-4">
                    <img :src="company.logo" :alt="company.name" class="img-fluid company-logo">
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>

section {
    width: 70%;
    margin: 0 auto;
}

.row {
    width: 60%;
    margin: 0 auto;
    justify-content: center;
    display: flex;
    flex-wrap: nowrap;
}
.company-logo {
    max-height: 50px;
    object-fit: contain;
    margin: 0 10px;
}

</style>