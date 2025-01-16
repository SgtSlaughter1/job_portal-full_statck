src/App.vue
<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  name: 'App',
  
  components: {
    Navbar,
    Footer
  },
  
  setup() {
    const authStore = useAuthStore()
    
    // Initialize auth state when app starts
    authStore.initializeAuth()
    
    return {
      authStore
    }
  }
})
</script>

