<template>
  <div class="container py-5">
    <div class="text-center">
      <h1 class="display-1">401</h1>
      <h2 class="mb-4">Unauthorized Access</h2>
      <p class="lead mb-4">
        You don't have permission to access this page.
      </p>
      <router-link to="/" class="btn btn-primary">
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized'
}
</script> 