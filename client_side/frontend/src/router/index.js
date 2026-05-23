import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/Analytics.vue')
  },
  {
    path: '/products',
    name: 'ProductCatalog',
    component: () => import('@/views/ProductCatalog.vue')
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/payment/:id',
    name: 'PaymentGateway',
    component: () => import('@/views/PaymentGateway.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue')
  },
  {
    path: '/bulk-order-review',
    name: 'BulkOrderReview',
    component: () => import('@/views/BulkOrderReview.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue')
  },
  
  // Protected Routes (require authentication)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderHistory',
    component: () => import('@/views/OrderHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/Wallet.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  
  // Role-Based Dashboards
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/retail',
    name: 'RetailDashboard',
    component: () => import('@/views/Retail/RetailDashboard.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/wholesale',
    name: 'WholesaleDashboard',
    component: () => import('@/views/Wholesale/WholesaleDashboard.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/staff',
    name: 'StaffDashboard',
    component: () => import('@/views/Staff/StaffDashboard.vue'),
    meta: { requiresAuth: true, roles: ['staff'] }
  },
  {
    path: '/agent',
    name: 'AgentDashboard',
    component: () => import('@/views/Agent/AgentDashboard.vue'),
    meta: { requiresAuth: true, roles: ['agent'] }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
    return;
  }
  
  // Check if route has role restrictions
  if (to.meta.roles && auth.isAuthenticated) {
    // Admin can access everything
    if (auth.role === 'admin') {
      next();
      return;
    }
    
    // Check if user's role is allowed
    if (!to.meta.roles.includes(auth.role)) {
      next('/');
      return;
    }
  }
  
  // Special handling for retail/wholesale dashboards - also check tier
  if (to.path === '/retail' && auth.user?.tier !== 'retail' && auth.role !== 'admin') {
    next('/');
    return;
  }
  
  if (to.path === '/wholesale' && auth.user?.tier !== 'wholesale' && auth.role !== 'admin') {
    next('/');
    return;
  }
  
  next();
});

export default router;
