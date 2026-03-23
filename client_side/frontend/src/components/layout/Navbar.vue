<template>
  <nav class="bg-white border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
            <span class="text-2xl font-black text-primary tracking-tighter italic">BestLady</span>
            <span class="hidden md:inline-block px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase tracking-widest border border-secondary/20">AI-Powered</span>
          </router-link>
          
          <div class="hidden md:ml-8 md:flex md:space-x-8">
            <router-link to="/products" class="text-slate-600 hover:text-primary px-3 py-2 text-sm font-bold transition">Products</router-link>
            <router-link v-if="auth.isAuthenticated" to="/dashboard" class="text-slate-600 hover:text-primary px-3 py-2 text-sm font-bold transition">Dashboard</router-link>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-slate-500 hover:text-primary transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cart.itemCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full border-2 border-white">
              {{ cart.itemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="auth.isAuthenticated" class="flex items-center gap-4 border-l pl-4">
            <div class="hidden lg:block text-right">
              <p class="text-xs font-black text-slate-900 leading-tight uppercase tracking-tighter">{{ auth.user?.username }}</p>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{{ auth.user?.role }} <span v-if="auth.user?.tier">| {{ auth.user?.tier }}</span></p>
            </div>
            <button @click="handleLogout" class="p-2 text-slate-400 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          <div v-else class="flex items-center gap-3">
            <router-link to="/login" class="text-sm font-bold text-slate-600 hover:text-primary transition">Login</router-link>
            <router-link to="/login" class="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition">Join Now</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>
