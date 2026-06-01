<template>
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div class="container-custom">
      <div class="flex items-center gap-2 sm:gap-4 h-16">

        <!-- Back / Forward navigation arrows -->
        <div class="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button @click="goBack" title="Go back" aria-label="Go back"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 active:scale-90 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button @click="goForward" title="Go forward" aria-label="Go forward"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 active:scale-90 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 flex items-center gap-2 group">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0" style="background: var(--brand-gradient)">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"/></svg>
          </div>
          <span class="font-serif font-bold text-lg sm:text-xl tracking-tight brand-text">BestLady</span>
          <span class="hidden sm:inline text-[9px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full tracking-wider">AI</span>
        </router-link>

        <!-- Search bar (desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-2 relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search 500+ beauty products..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            @keyup.enter="search"
          />
        </div>

        <!-- Spacer -->
        <div class="flex-1 md:hidden"></div>

        <!-- Desktop nav links -->
        <div class="hidden lg:flex items-center gap-1">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-all"
            :class="{ 'text-primary-700 bg-primary-50': $route.path === link.to }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"/>
            </svg>
            {{ link.label }}
          </router-link>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 rounded-xl text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span v-if="cartTotal > 0" class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-secondary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
              {{ cartTotal > 99 ? '99+' : cartTotal }}
            </span>
          </router-link>

          <!-- Authenticated user menu -->
          <div v-if="auth.isAuthenticated" class="relative" ref="menuRef">
            <button @click="showMenu = !showMenu" class="flex items-center gap-2 p-1 rounded-xl hover:bg-primary-50 transition-all">
              <div class="relative">
                <img
                  v-if="auth.user?.avatar_url"
                  :src="auth.user.avatar_url"
                  alt="Avatar"
                  class="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
                  @error="handleAvatarError"
                />
                <div v-else class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-primary-200" style="background: var(--brand-gradient)">
                  {{ initials }}
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <span class="hidden xl:block text-sm font-semibold text-gray-700 max-w-[120px] truncate">{{ displayName }}</span>
              <svg class="hidden xl:block w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': showMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <transition name="dropdown">
              <div v-if="showMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <!-- User header -->
                <div class="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-100">
                  <p class="font-bold text-gray-800 truncate">{{ displayName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold capitalize">{{ auth.user?.tier || 'retail' }}</span>
                    <span class="text-xs text-primary-600 font-medium">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</span>
                  </div>
                </div>
                <!-- Menu items -->
                <div class="py-1">
                  <router-link v-for="item in menuItems" :key="item.to" :to="item.to" @click="showMenu = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon"/>
                    </svg>
                    {{ item.label }}
                  </router-link>
                  <hr class="my-1 border-gray-100">
                  <button @click="logout" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Guest buttons -->
          <div v-else class="flex items-center gap-2">
            <router-link to="/login" class="hidden sm:inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800 px-4 py-2 rounded-xl hover:bg-primary-50 transition-all">
              Log In
            </router-link>
            <router-link to="/register" class="btn-primary text-sm px-4 py-2">
              Sign Up
            </router-link>
          </div>

          <!-- Mobile menu toggle -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all">
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile search -->
    <div class="md:hidden px-4 pb-3">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search products..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-primary-400 outline-none" @keyup.enter="search" />
      </div>
    </div>

    <!-- Mobile nav menu -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-3 space-y-1">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-all"
          >
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"/>
            </svg>
            {{ link.label }}
          </router-link>
          <div v-if="!auth.isAuthenticated" class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-3">
            <router-link to="/login" class="text-center py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl text-sm font-bold">Log In</router-link>
            <router-link to="/register" class="btn-primary text-center py-2.5 text-sm">Sign Up</router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/formatters'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const showMenu = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const menuRef = ref(null)

const cartTotal = computed(() => cart.totalItems)
const displayName = computed(() => auth.user?.nickname || auth.user?.username || 'User')
const initials = computed(() => (auth.user?.username || 'U').charAt(0).toUpperCase())

const navLinks = [
  { to: '/',         icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
  { to: '/products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',                                                                                                          label: 'Products' },
  { to: '/about',    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                          label: 'About' },
  { to: '/blog',     icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',         label: 'Blog' },
]

const menuItems = computed(() => {
  const base = [
    { to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
    { to: '/orders',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'My Orders' },
    { to: '/wallet',    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Wallet' },
    { to: '/profile',   icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Profile' },
  ]
  if (auth.role === 'admin') base.push({ to: '/admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', label: 'Admin Panel' })
  if (auth.role === 'staff') base.push({ to: '/staff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Staff Portal' })
  if (auth.role === 'agent') base.push({ to: '/agent', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Agent Portal' })
  return base
})

const search = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value.trim() } })
    searchQuery.value = ''
    mobileMenuOpen.value = false
  }
}

// Browser-style back / forward navigation
const goBack = () => router.back()
const goForward = () => router.forward()

const logout = () => {
  auth.logout()
  router.push('/')
  showMenu.value = false
}

const handleAvatarError = (e) => { e.target.src = '/default-avatar.png' }

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) showMenu.value = false
}

onMounted(() => {
  if (auth.isAuthenticated) {
    auth.refreshUserData().catch(err => { if (err.response?.status === 401) auth.logout() })
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; max-height: 500px; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
</style>
