<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="container-custom">
      <div class="flex justify-between items-center h-20">
        <!-- Logo with Animation -->
        <router-link to="/" class="flex items-center space-x-2 group">
          <div class="relative">
            <span class="text-3xl font-black bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">BestLady</span>
            <span class="absolute -top-1 -right-6 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full animate-pulse-slow">AI</span>
          </div>
          <span class="text-xs bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 px-2 py-1 rounded-full animate-float">✨ AI-Powered</span>
        </router-link>

        <!-- Search Bar with Animation -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full group">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search 500+ beauty products..."
              class="w-full px-5 py-2.5 pl-12 border-2 border-gray-200 rounded-full focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all duration-300 group-hover:shadow-md"
              @keyup.enter="search"
            />
            <svg class="absolute left-4 top-3 h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Navigation Icons with Badges -->
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium flex items-center gap-1">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </router-link>
          
          <router-link to="/products" class="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium flex items-center gap-1">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Products
          </router-link>
          
          <router-link to="/dashboard" class="text-gray-600 hover:text-primary-600 transition-colors duration-300 font-medium flex items-center gap-1">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analysis
          </router-link>
          
          <!-- Cart with Animation -->
          <router-link to="/cart" class="relative group">
            <div class="relative">
              <svg class="h-7 w-7 text-gray-600 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartTotal > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {{ cartTotal > 99 ? '99+' : cartTotal }}
              </span>
            </div>
          </router-link>

          <!-- User Menu with Avatar -->
          <div v-if="auth.isAuthenticated" class="relative">
            <button @click="showMenu = !showMenu" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                {{ auth.user?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <span class="hidden md:inline text-sm font-medium text-gray-700">{{ auth.user?.username }}</span>
              <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <transition name="fade">
              <div v-if="showMenu" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="font-semibold text-gray-800">{{ auth.user?.business_name }}</p>
                  <p class="text-xs text-gray-500">{{ auth.user?.email }}</p>
                  <p class="text-xs text-primary-600 mt-1">Wallet: KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
                </div>
                <router-link to="/dashboard" class="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                  <svg class="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </router-link>
                <router-link to="/orders" class="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                  <svg class="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders
                </router-link>
                <router-link to="/wallet" class="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                  <svg class="h-5 w-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Wallet
                </router-link>
                <hr class="my-1">
                <button @click="logout" class="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </transition>
          </div>
          
          <div v-else class="flex space-x-3">
            <router-link to="/login" class="px-5 py-2 border-2 border-primary-600 text-primary-600 rounded-full hover:bg-primary-50 transition-all duration-300 font-medium">
              Login
            </router-link>
            <router-link to="/register" class="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium">
              Sign Up Free
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
        <div class="px-4 py-3 space-y-2">
          <router-link to="/products" class="block px-3 py-2 rounded-lg hover:bg-gray-50">Products</router-link>
          <router-link to="/cart" class="block px-3 py-2 rounded-lg hover:bg-gray-50">Cart</router-link>
          <router-link to="/dashboard" class="block px-3 py-2 rounded-lg hover:bg-gray-50">Dashboard</router-link>
          <hr>
          <router-link to="/login" class="block px-3 py-2 text-primary-600 font-semibold">Login</router-link>
          <router-link to="/register" class="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center">Sign Up</router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/formatters'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const showMenu = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const cartTotal = computed(() => cart.totalItems)

const search = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } })
  }
}

const logout = () => {
  auth.logout()
  router.push('/')
  showMenu.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style><!-- Add this inside the nav links section -->
<router-link to="/analytics" class="text-slate-600 hover:text-primary px-3 py-2 text-sm font-bold transition">Analytics</router-link>
