import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import AccountType from '@/views/AccountType.vue'
import JobListings from '@/views/JobListings.vue'
import JobDetails from '@/views/JobDetails.vue'
import Dashboard from '@/views/Dashboard.vue'
import ApplicationForm from '@/views/ApplicationForm.vue'
import JobApplications from '@/views/JobApplications.vue'
import PostJob from '@/views/PostJob.vue'
import EditProfile from '@/views/EditProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Dashboard
    },
    {
      path: '/edit-profile',
      name: 'EditProfile',
      component: EditProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/account-type',
      name: 'AccountType',
      component: AccountType
    },
    {
      path: '/jobs',
      name: 'JobListings',
      component: JobListings
    },
    {
      path: '/jobs/create',
      name: 'PostJob',
      component: PostJob,
      meta: { requiresAuth: true, userType: 'employer' }
    },
    {
      path: '/jobs/:id',
      name: 'JobDetails',
      component: JobDetails,
      props: true
    },
    {
      path: '/apply',
      name: 'ApplicationForm',
      component: ApplicationForm
    },
    {
      path: '/applications',
      name: 'JobApplications',
      component: JobApplications,
      meta: { requiresAuth: true, userType: 'jobseeker' }
    },
    {
      path: '/jobs/:id/apply',
      name: 'ApplicationForm',
      component: () => import('@/views/ApplicationForm.vue'),
      meta: {
        requiresAuth: true,
        userType: 'jobseeker'
      }
    }
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Store the intended destination
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } 
  // Check if route requires specific user type
  else if (to.meta.userType && authStore.userType !== to.meta.userType) {
    next('/unauthorized');
  }
  else {
    next();
  }
});

export default router