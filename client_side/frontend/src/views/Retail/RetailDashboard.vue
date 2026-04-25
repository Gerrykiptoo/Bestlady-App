<template>
  <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
        Welcome back, {{ auth.user?.business_name || 'Salon Owner' }}!
      </h1>
      <p class="text-gray-500 mt-1">Here's what's happening with your salon business today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Wallet Balance Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition">
            <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p class="text-sm text-gray-500">Wallet Balance</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
        <button @click="$router.push('/wallet')" class="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1 group/btn">
          Top Up 
          <svg class="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Active Orders Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{{ activeOrdersList.length }} active</span>
        </div>
        <p class="text-sm text-gray-500">Active Orders</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeOrdersList.length }}</p>
        
        <!-- Active Orders List (showing up to 3) -->
        <div v-if="activeOrdersList.length > 0" class="mt-3 space-y-2 max-h-40 overflow-y-auto">
          <div 
            v-for="order in activeOrdersList.slice(0, 3)" 
            :key="order.id"
            class="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border-l-4 border-blue-500"
            @click="$router.push(`/orders/${order.id}`)"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xs font-semibold text-gray-700">#{{ order.order_number }}</p>
                <p class="text-[10px] text-gray-500 capitalize">{{ order.status }}</p>
              </div>
              <p class="text-xs font-bold text-primary-600">KES {{ formatPrice(order.total_amount) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="mt-2 text-xs text-gray-500 text-center py-2">No active orders</div>
        
        <button @click="$router.push('/orders')" class="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1">
          View All 
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Low Stock Alerts Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">{{ lowStockCount }} items</span>
        </div>
        <p class="text-sm text-gray-500">Low Stock Alerts</p>
        <p class="text-2xl font-bold text-gray-800">{{ lowStockCount }}</p>
        <button @click="$router.push('/products?alert=low')" class="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1">
          Reorder Now 
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Monthly Spending Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span :class="monthlySpendingTrend > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="text-xs px-2 py-1 rounded-full">
            {{ monthlySpendingTrend > 0 ? '↑' : '↓' }} {{ Math.abs(monthlySpendingTrend) }}%
          </span>
        </div>
        <p class="text-sm text-gray-500">This Month's Spending</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(monthlySpending) }}</p>
        <button class="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1">
          View Analytics 
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: AI Assistant & Analysis -->
      <div class="lg:col-span-2 space-y-8">
        <AIAssistantWidget />

        <!-- Regional Demand Forecast (Shared from Wholesale) -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 rounded-lg text-purple-600">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800">Regional Demand Forecast</h3>
                <p class="text-xs text-gray-500">Market analysis for your branch location</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div v-for="region in regionalDemand" :key="region.code" class="p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-700">{{ region.name }}</span>
                <span :class="[
                  'text-xs px-2 py-1 rounded-full font-bold',
                  region.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500" 
                  :class="region.trend === 'up' ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: region.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Quick Actions & Tips -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div class="space-y-3">
            <button @click="$router.push('/products')" class="w-full bg-primary-50 text-primary-700 p-3 rounded-xl flex items-center gap-3 hover:bg-primary-100 transition group">
              <svg class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Products
            </button>
            <button @click="reorderFavorites" class="w-full bg-blue-50 text-blue-700 p-3 rounded-xl flex items-center gap-3 hover:bg-blue-100 transition group">
              <svg class="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reorder Favorites
            </button>
            <button @click="$router.push('/wallet')" class="w-full bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-3 hover:bg-green-100 transition group">
              <svg class="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Top Up Wallet
            </button>
          </div>
        </div>

        <!-- Smart Tip -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="flex items-center gap-3 mb-3 relative z-10">
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2 animate-pulse">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-800">✨ AI Tip</h3>
          </div>
          <p class="text-sm text-gray-600 relative z-10">{{ aiTip }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders Section -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Orders
        </h2>
        <router-link to="/orders" class="text-sm text-primary-600 hover:underline flex items-center gap-1">
          View All 
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">#{{ order.order_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(order.createdAt) }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-primary-600">KES {{ formatPrice(order.total_amount) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <router-link :to="`/orders/${order.id}`" class="text-primary-600 hover:underline text-sm flex items-center gap-1">
                    Details
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </router-link>
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-2">
                    <svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p class="text-gray-500">No orders yet. Start shopping!</p>
                    <router-link to="/products" class="mt-2 text-primary-600 hover:underline">Browse Products →</router-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import AIAssistantWidget from '@/components/AIAssistantWidget.vue'
import { formatPrice, formatDate } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

// State
const activeOrdersList = ref([])
const lowStockCount = ref(0)
const monthlySpending = ref(0)
const monthlySpendingTrend = ref(0)
const recentOrders = ref([])

// Regional Demand Data (Mocked from wholesale)
const regionalDemand = ref([
  { code: 'NBO', name: 'Nairobi Region', trend: 'up', change: 18, percentage: 85 },
  { code: 'MBS', name: 'Mombasa Region', trend: 'up', change: 12, percentage: 65 },
  { code: 'KSM', name: 'Kisumu Region', trend: 'down', change: 5, percentage: 30 }
]);

// AI Tip based on user activity
const aiTip = computed(() => {
  if (lowStockCount.value > 0) {
    return `⚠️ You have ${lowStockCount.value} low stock item${lowStockCount.value > 1 ? 's' : ''}! Reorder now to avoid running out of your best-sellers.`
  } 
  if (auth.user?.wallet_balance < 1000) {
    return "💰 Your wallet balance is running low. Top up now to enjoy seamless checkout and exclusive discounts."
  }
  if (monthlySpending.value > 5000) {
    return "🏆 You've spent over KES 5,000 this month! Consider our wholesale pricing for even bigger savings on bulk orders."
  }
  return "✨ Based on your purchase history, you might love our new Vitamin C Serum – it's trending with 4.9/5 stars!"
})

// Status badge styling
const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Reorder favorites
const reorderFavorites = async () => {
  toast.info('Fetching your favorite items...', { duration: 2000 })
  // API call to get favorites would go here
  setTimeout(() => {
    router.push('/products?favorites=true')
  }, 1000)
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const [ordersRes, alertsRes] = await Promise.all([
      api.get('/orders?limit=5'),
      api.get('/ai/user/dashboard')
    ])
    
    recentOrders.value = ordersRes.data || []
    lowStockCount.value = alertsRes.data.alerts?.length || 0
    monthlySpending.value = alertsRes.data.spending?.totalSpent || 0
    monthlySpendingTrend.value = alertsRes.data.spending?.trendPercent || 0
    
  } catch (error) {
    console.error('Failed to load dashboard:', error)
    toast.error('Failed to load dashboard data')
  }
}

// Fetch active orders with polling
const fetchActiveOrders = async () => {
  try {
    const { data } = await api.get('/orders?status=pending,processing,dispatched&limit=10')
    activeOrdersList.value = data || []
  } catch (error) {
    console.error('Failed to fetch active orders:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  fetchActiveOrders()
  // Poll active orders every 30 seconds
  setInterval(fetchActiveOrders, 30000)
})
</script>

<style scoped>
/* Smooth fade-in animation for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeInUp 0.4s ease-out forwards;
}

.bg-white:nth-child(1) { animation-delay: 0s; }
.bg-white:nth-child(2) { animation-delay: 0.05s; }
.bg-white:nth-child(3) { animation-delay: 0.1s; }
.bg-white:nth-child(4) { animation-delay: 0.15s; }
</style>