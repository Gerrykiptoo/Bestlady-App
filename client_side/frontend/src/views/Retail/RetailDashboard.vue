<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Page hero -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Retail Partner Dashboard</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="text-3xl font-black text-white">
              Welcome back, {{ auth.user?.business_name || auth.user?.username || 'Salon Owner' }}
            </h1>
            <p class="text-white/70 mt-1 text-sm">Here's what's happening with your business today.</p>
          </div>
          <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-white capitalize">{{ auth.user?.tier || 'Retail' }} Partner</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8 space-y-8">

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <span :class="monthlySpendingTrend > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="text-xs px-2 py-1 rounded-full font-bold">
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
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- AI Optimizer Widget -->
        <div class="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-2xl p-6 border border-primary-200 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full blur-2xl opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="flex items-center justify-between mb-4 relative z-10">
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full p-2">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="font-bold text-xl text-gray-800">AI Shopping Assistant</h3>
            </div>
            <button @click="refreshAIInsights" class="text-xs text-primary-700 font-bold hover:underline" :disabled="isRefreshingAI">
              {{ isRefreshingAI ? 'Refreshing...' : 'Refresh Insight ↻' }}
            </button>
          </div>
          <div class="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-4 relative z-10">
            <p class="text-primary-900 font-medium italic">"{{ aiRecommendation }}"</p>
          </div>
          
          <div v-if="suggestedOptimization" class="bg-white rounded-xl p-4 mb-4 border border-primary-100 animate-fade-in relative z-10">
             <div class="flex justify-between items-center mb-2">
               <span class="text-xs font-bold text-primary-600 uppercase tracking-wider">Smart Reorder Suggestion</span>
               <span class="text-xs font-bold text-green-600">Save {{ suggestedOptimization.savingsPercent }}%</span>
             </div>
             <p class="text-sm text-gray-700 mb-3">{{ suggestedOptimization.description }}</p>
             <button @click="applyOptimization" class="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Apply Suggestion to Cart
             </button>
          </div>
        </div>

        <!-- Regional Demand -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-purple-100 rounded-lg text-purple-600">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="font-bold text-lg text-gray-800">Regional Demand Analysis</h3>
            </div>
            <button @click="fetchDashboardData" class="text-xs text-primary-600 font-bold">Update ↻</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="region in regionalDemand" :key="region.code" class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-gray-700">{{ region.name }}</span>
                <span :class="region.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded-full">
                  {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  class="h-2 rounded-full transition-all duration-1000" 
                  :class="region.trend === 'up' ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: region.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
            <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div class="space-y-3">
            <button @click="$router.push('/products')" class="w-full bg-primary-50 text-primary-700 p-3 rounded-xl flex items-center gap-3 hover:bg-primary-100 transition group font-bold">
              <svg class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Shop
            </button>
            <button @click="reorderFavorites" class="w-full bg-blue-50 text-blue-700 p-3 rounded-xl flex items-center gap-3 hover:bg-blue-100 transition group font-bold">
              <svg class="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reorder Favorites
            </button>
            <button @click="$router.push('/wallet')" class="w-full bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-3 hover:bg-green-100 transition group font-bold">
              <svg class="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Top Up Wallet
            </button>
          </div>
        </div>

        <!-- Smart Tip -->
        <div class="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pro Tip
            </h3>
            <p class="text-sm text-purple-100">{{ aiTip }}</p>
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
          Recent Activity
        </h2>
        <router-link to="/orders" class="text-sm text-primary-600 font-bold hover:underline flex items-center gap-1">
          View History →
        </router-link>
      </div>
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order #</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition cursor-pointer" @click="$router.push(`/orders/${order.id}`)">
                <td class="px-6 py-4 text-sm font-bold text-gray-800">#{{ order.order_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(order.createdAt) }}</td>
                <td class="px-6 py-4 text-sm font-bold text-primary-600">KES {{ formatPrice(order.total_amount) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <router-link :to="`/orders/${order.id}`" class="text-primary-600 hover:text-primary-800 text-sm font-bold underline">Details</router-link>
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500 font-medium">No recent orders yet. Start shopping!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </div><!-- end container-custom -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { formatPrice, formatDate } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'
import { getSocket } from '@/services/socket'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

// State
const activeOrdersList = ref([])
const lowStockCount = ref(0)
const monthlySpending = ref(0)
const monthlySpendingTrend = ref(0)
const recentOrders = ref([])
const regionalDemand = ref([])
const aiRecommendation = ref('Analyzing your purchase history for smart suggestions...')
const isRefreshingAI = ref(false)
const suggestedOptimization = ref(null)
let pollTimer = null

// AI Tip based on user activity
const aiTip = computed(() => {
  if (lowStockCount.value > 0) {
    return `You have ${lowStockCount.value} items low on stock! Reorder now to avoid missing out on sales.`
  }
  if (auth.user?.wallet_balance < 1000) {
    return "Balance is low. Top up now for faster checkout and exclusive loyalty points!"
  }
  return "Trending: BestLady Matte Lipsticks are flying off the shelves in your area. Grab them while stocks last!"
})

// Status badge styling
const getStatusClass = (status) => {
  const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase';
  switch (status) {
    case 'pending': return `${base} bg-yellow-100 text-yellow-700`;
    case 'processing': return `${base} bg-blue-100 text-blue-700`;
    case 'dispatched': return `${base} bg-purple-100 text-purple-700`;
    case 'delivered': return `${base} bg-green-100 text-green-700`;
    case 'cancelled': return `${base} bg-red-100 text-red-700`;
    default: return `${base} bg-gray-100 text-gray-700`;
  }
}

const reorderFavorites = async () => {
  toast.info('Fetching your favorites...')
  setTimeout(() => {
    router.push('/products?favorites=true')
  }, 800)
}

const fetchDashboardData = async () => {
  try {
    const [ordersRes, activeRes, aiRes] = await Promise.all([
      api.get('/orders?limit=5'),
      api.get('/orders?status=pending,processing,dispatched&limit=10'),
      api.get('/ai/user/dashboard')
    ])
    
    recentOrders.value = ordersRes.data || []
    activeOrdersList.value = activeRes.data || []
    
    if (aiRes.data) {
        lowStockCount.value = aiRes.data.alerts?.length || aiRes.data.lowStockCount || 0
        monthlySpending.value = aiRes.data.spending?.totalSpent || aiRes.data.monthlySpending || 0
        monthlySpendingTrend.value = aiRes.data.spending?.trendPercent || 5
        
        if (aiRes.data.demandInsights) {
            regionalDemand.value = aiRes.data.demandInsights.slice(0, 3).map(item => ({
                code: item.region,
                name: item.regionName || item.region,
                trend: item.trend || 'up',
                change: item.changePercent || 10,
                percentage: item.percentage || 50
            }))
        }
        
        if (aiRes.data.recommendations?.length > 0) {
            aiRecommendation.value = aiRes.data.recommendations[0].message
        }
    }
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
}

const refreshAIInsights = async () => {
  isRefreshingAI.value = true;
  try {
    const { data } = await api.get('/ai/insights/refresh');
    aiRecommendation.value = data.recommendation || 'Based on local trends, neon colors are trending in your region.';
    suggestedOptimization.value = data.suggestion || {
      description: 'Add 3 more "Natural Glow" kits to your cart to qualify for a 10% bundle discount!',
      savingsPercent: 10
    };
    toast.success('Insights updated!');
  } catch (error) {
    toast.error('AI refresh failed');
  } finally {
    isRefreshingAI.value = false;
  }
};

const applyOptimization = async () => {
  if (!suggestedOptimization.value) return;
  const cart = useCartStore();
  
  toast.info('Applying AI optimizations to your cart...');
  
  suggestedOptimization.value.items.forEach(item => {
    cart.addItem(item.product, item.discountedPrice, item.quantity);
  });
  
  setTimeout(() => {
    toast.success('Cart updated with suggested bundle discounts!');
    router.push('/checkout');
  }, 800);
};

const setupSocketListeners = () => {
  const socket = getSocket()
  if (!socket) return

  socket.on('orderUpdate', (data) => {
    toast.info(`Order #${data.order_number} is now ${data.status}`)
    fetchDashboardData()
  })
  
  socket.on('walletUpdate', (data) => {
    auth.updateUser({ wallet_balance: data.balance })
    toast.success(`Wallet updated! New balance: KES ${formatPrice(data.balance)}`)
  })
}

onMounted(() => {
  fetchDashboardData()
  setupSocketListeners()
  pollTimer = setInterval(fetchDashboardData, 60000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  const socket = getSocket()
  if (socket) {
    socket.off('orderUpdate')
    socket.off('walletUpdate')
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>