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
    name: 'JobApplication',
    component: ApplicationForm,
    props: true,
    meta: {
      requiresAuth: true,
      userType: 'jobseeker'
    },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        next({
          name: 'Login',
          query: { 
            redirect: to.fullPath,
            message: 'Please login to apply for this job'
          }
        });
      } else if (authStore.userType !== 'jobseeker') {
        next({
          name: 'JobSeekerRegister',
          query: { 
            message: 'Please register as a job seeker to apply for jobs'
          }
        });
      } else {
        next();
      }
    }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userType = authStore.userType

  // Handle auth required routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
    return
  }

  // Handle user type specific routes
  if (to.meta.userType && to.meta.userType !== userType) {
    next({ name: 'Profile' })
    return
  }

  // Redirect authenticated users from auth pages
  if (isAuthenticated && to.path.startsWith('/auth')) {
    next({ name: 'Profile' })
    return
  }

  // Redirect to home after logout
  if (to.name === 'Login' && !isAuthenticated && from.name === 'Profile') {
    next({ name: 'Home' })
    return
  }

  // Redirect to profile after login
  if (to.name === 'Dashboard' && isAuthenticated) {
    next({ name: 'Profile' })
    return
  }

  next()
})

export default router