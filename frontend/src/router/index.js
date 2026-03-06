import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'ProductCatalog',
    component: () => import('@/views/ProductCatalog.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/user/dashboard',
    name: 'RetailDashboard',
    component: () => import('@/views/Retail/RetailDashboard.vue'),
    meta: { requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/wholesale',
    name: 'WholesaleDashboard',
    component: () => import('@/views/Wholesale/WholesaleDashboard.vue'),
    meta: { requiresAuth: true, roles: ['wholesale'] }
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

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    next('/');
  } else {
    next();
  }
});

export default router;
