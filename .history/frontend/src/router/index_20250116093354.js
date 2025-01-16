import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
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

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      },
      {
        path: 'account-type',
        name: 'AccountType',
        component: AccountType
      }
    ]
  },
  {
    path: '/jobs',
    children: [
      {
        path: '',
        name: 'JobListings',
        component: JobListings
      },
      {
        path: ':id',
        name: 'JobDetails',
        component: JobDetails,
        props: true
      },
      {
        path: 'post',
        name: 'PostJob',
        component: PostJob,
        meta: { 
          requiresAuth: true, 
          userType: 'employer' 
        }
      }
    ]
  },
  {
    path: '/profile',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Profile',
        component: Dashboard
      },
      {
        path: 'edit',
        name: 'EditProfile',
        component: EditProfile
      },
      {
        path: 'applications',
        name: 'JobApplications',
        component: JobApplications,
        meta: { userType: 'jobseeker' }
      }
    ]
  },
  {
    path: '/jobs/:id/apply',
    name: 'ApplicationForm',
    component: ApplicationForm,
    meta: {
      requiresAuth: true,
      userType: 'jobseeker'
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Check if route requires specific user type
  if (to.meta.userType && authStore.userType !== to.meta.userType) {
    next('/unauthorized');
    return;
  }

  // Handle redirect after login
  if (to.path === '/auth/login' && authStore.isAuthenticated) {
    next('/profile');
    return;
  }

  next();
});

export default router