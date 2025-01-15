src/App.vue
<template>
  <div>
    <Navbar />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <Footer />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  
  components: {
    Navbar,
    Footer
  },

  data() {
    return {
      authStore: useAuthStore()
    };
  },

  created() {
    // Navigation guard
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && !this.authStore.isAuthenticated) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      } else if (to.meta.userType && this.authStore.userType !== to.meta.userType) {
        next('/unauthorized');
      } else {
        next();
      }
    });
  }
};
</script>

