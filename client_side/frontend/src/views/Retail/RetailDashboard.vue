<template>
  <div class="min-h-screen" style="background: #faf9f7;">

    <!-- Boutique hero banner -->
    <div style="background: linear-gradient(135deg, #4a0e2b 0%, #7e1d4a 45%, #9c2c5c 100%); position: relative; overflow: hidden;">
      <!-- Decorative circles -->
      <div style="position:absolute;top:-60px;right:-60px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
      <div style="position:absolute;bottom:-40px;left:10%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.03);"></div>
      <div class="container-custom relative z-10 py-12">
        <p class="text-rose-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">Retail Partner Studio</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-5 justify-between">
          <div>
            <h1 class="font-serif text-4xl font-bold text-white leading-tight">
              {{ auth.user?.business_name || auth.user?.username || 'My Studio' }}
            </h1>
            <p class="text-rose-200/80 mt-2 text-sm">Your beauty business at a glance — orders, stock, savings.</p>
          </div>
          <div class="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-white capitalize">{{ auth.user?.tier || 'Retail' }} Partner</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-10 space-y-8">

    <!-- Stat Cards — editorial grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <!-- Wallet Balance -->
      <div class="bg-white rounded-2xl border border-[#ede9e3] p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: #fdf2f8;">
            <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">Wallet</span>
        </div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Available Balance</p>
        <p class="font-serif text-2xl font-bold text-gray-900">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
        <button @click="$router.push('/wallet')" class="mt-3 text-sm text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 group/btn transition">
          Top Up
          <svg class="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Active Orders -->
      <div class="bg-white rounded-2xl border border-[#ede9e3] p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{{ activeOrdersList.length }} active</span>
        </div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Orders</p>
        <p class="font-serif text-2xl font-bold text-gray-900">{{ activeOrdersList.length }}</p>
        <div v-if="activeOrdersList.length > 0" class="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
          <div v-for="order in activeOrdersList.slice(0, 3)" :key="order.id"
            class="flex justify-between items-center p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-rose-50 transition border-l-2 border-blue-400"
            @click="$router.push(`/orders/${order.id}`)">
            <div>
              <p class="text-xs font-bold text-gray-700">#{{ order.order_number }}</p>
              <p class="text-[10px] text-gray-400 capitalize">{{ order.status }}</p>
            </div>
            <p class="text-xs font-bold text-rose-600">KES {{ formatPrice(order.total_amount) }}</p>
          </div>
        </div>
        <button @click="$router.push('/orders')" class="mt-3 text-sm text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition">
          View All
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Low Stock Alerts -->
      <div class="bg-white rounded-2xl border border-[#ede9e3] p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50">
            <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">{{ lowStockCount }} items</span>
        </div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Low Stock Alerts</p>
        <p class="font-serif text-2xl font-bold text-gray-900">{{ lowStockCount }}</p>
        <button @click="$router.push('/products?alert=low')" class="mt-3 text-sm text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition">
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
          <span :class="monthlySpendingTrend > 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-red-700 bg-red-50 border border-red-100'" class="text-xs px-2.5 py-1 rounded-full font-bold border">
            {{ monthlySpendingTrend > 0 ? '↑' : '↓' }} {{ Math.abs(monthlySpendingTrend) }}%
          </span>
        </div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Monthly Spend</p>
        <p class="font-serif text-2xl font-bold text-gray-900">KES {{ formatPrice(monthlySpending) }}</p>
        <button class="mt-3 text-sm text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition">
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
      <div class="lg:col-span-2 space-y-7">

        <!-- AI Insight Card — editorial pull-quote style -->
        <div class="rounded-2xl border border-[#ede9e3] overflow-hidden" style="background: #fff;">
          <div class="px-6 py-4 border-b border-[#ede9e3] flex items-center justify-between" style="background: #fdf2f8;">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-600">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="font-serif font-bold text-lg text-gray-900">Your Beauty Advisor</h3>
            </div>
            <button @click="refreshAIInsights" class="text-xs text-rose-700 font-bold hover:text-rose-900 transition" :disabled="isRefreshingAI">
              {{ isRefreshingAI ? 'Loading…' : 'Refresh ↻' }}
            </button>
          </div>
          <div class="p-6">
            <blockquote class="border-l-4 border-rose-300 pl-5 py-1 mb-5">
              <p class="text-base text-gray-700 italic leading-relaxed">"{{ aiRecommendation }}"</p>
            </blockquote>
            <div v-if="suggestedOptimization" class="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-rose-700 uppercase tracking-wider">Smart Reorder</span>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Save {{ suggestedOptimization.savingsPercent }}%</span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ suggestedOptimization.description }}</p>
              <button @click="applyOptimization" class="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-md" style="background: linear-gradient(135deg, #9c2c5c, #7e1d4a);">
                Apply to Cart →
              </button>
            </div>
          </div>
        </div>

        <!-- Regional Demand — horizontal bars -->
        <div class="bg-white rounded-2xl border border-[#ede9e3] p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-serif font-bold text-lg text-gray-900">Demand by Region</h3>
            <button @click="fetchDashboardData" class="text-xs text-rose-600 hover:text-rose-800 font-bold transition">Update ↻</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="region in regionalDemand" :key="region.code" class="p-4 rounded-xl border border-[#ede9e3] hover:border-rose-200 transition">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-gray-700">{{ region.name }}</span>
                <span :class="region.trend === 'up' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-700 bg-red-50 border-red-100'" class="text-xs font-bold px-2 py-0.5 rounded-full border">
                  {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div class="h-1.5 rounded-full transition-all duration-700"
                  :style="{ width: region.percentage + '%', background: region.trend === 'up' ? '#be185d' : '#ef4444' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">

        <!-- Quick Actions — editorial button list -->
        <div class="bg-white rounded-2xl border border-[#ede9e3] p-6">
          <h3 class="font-serif font-bold text-lg text-gray-900 mb-5">Quick Actions</h3>
          <div class="space-y-2.5">
            <button @click="$router.push('/products')" class="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[#ede9e3] hover:border-rose-200 hover:bg-rose-50 transition group text-left">
              <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-200 transition">
                <svg class="h-4 w-4 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span class="text-sm font-bold text-gray-700 group-hover:text-rose-800">Browse the Shop</span>
            </button>
            <button @click="reorderFavorites" class="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[#ede9e3] hover:border-blue-200 hover:bg-blue-50 transition group text-left">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                <svg class="h-4 w-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span class="text-sm font-bold text-gray-700 group-hover:text-blue-800">Reorder Favourites</span>
            </button>
            <button @click="$router.push('/wallet')" class="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[#ede9e3] hover:border-emerald-200 hover:bg-emerald-50 transition group text-left">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition">
                <svg class="h-4 w-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span class="text-sm font-bold text-gray-700 group-hover:text-emerald-800">Top Up Wallet</span>
            </button>
          </div>
        </div>

        <!-- Business Insight — pulled quote card -->
        <div class="rounded-2xl p-6 text-white relative overflow-hidden" style="background: linear-gradient(135deg, #4a0e2b 0%, #7e1d4a 80%);">
          <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
          <p class="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3">Studio Insight</p>
          <p class="text-sm text-rose-100 leading-relaxed relative z-10">{{ aiTip }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders — editorial list -->
    <div>
      <div class="flex justify-between items-center mb-5">
        <h2 class="font-serif text-xl font-bold text-gray-900">Recent Orders</h2>
        <router-link to="/orders" class="text-sm text-rose-600 hover:text-rose-800 font-bold transition">View All →</router-link>
      </div>
      <div class="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead style="background: #fdf2f8;">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#ede9e3]">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-rose-50/30 transition cursor-pointer" @click="$router.push(`/orders/${order.id}`)">
                <td class="px-6 py-4 text-sm font-bold text-gray-900">#{{ order.order_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
                <td class="px-6 py-4 text-sm font-bold text-rose-700">KES {{ formatPrice(order.total_amount) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">{{ order.status }}</span>
                </td>
                <td class="px-6 py-4">
                  <router-link :to="`/orders/${order.id}`" class="text-rose-600 hover:text-rose-900 text-sm font-bold">Details</router-link>
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="px-6 py-14 text-center text-gray-400 font-medium">Your first order is just a click away.</td>
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
    const { data } = await api.post('/ai/bulk-optimize');
    const recs = data.recommendations || [];

    if (recs.length === 0) {
      aiRecommendation.value = 'Place your first order to unlock personalized AI recommendations and loyalty discounts!';
      suggestedOptimization.value = null;
    } else {
      aiRecommendation.value = recs[0].reasoning || `We have ${recs.length} smart reorder suggestions for you.`;

      const totalSavings = recs.reduce((s, r) => s + (r.totalSavings || 0), 0);
      const totalBase    = recs.reduce((s, r) => s + (r.basePrice * r.recommendedQuantity), 0);
      const savingsPct   = totalBase > 0 ? Math.round((totalSavings / totalBase) * 100) : (data.tierInfo?.discountPercent || 0);

      suggestedOptimization.value = {
        description: `${recs.length} product${recs.length > 1 ? 's' : ''} ready to reorder${savingsPct > 0 ? ` — save ${savingsPct}% with your ${data.tierInfo?.tier || 'loyalty'} discount` : ' based on your purchase history'}.`,
        savingsPercent: savingsPct,
        items: recs
          .filter(r => r.stockUrgency !== 'out_of_stock')
          .map(r => ({
            product_id: r.productId,
            name: r.productName,
            price: r.basePrice,
            discountedPrice: r.discountedPrice,
            discountPercent: r.discountPercent,
            quantity: r.recommendedQuantity,
            image_url: r.productImage
          }))
      };
    }
    toast.success('Insights refreshed!');
  } catch {
    toast.error('Could not refresh AI insights. Try again.');
  } finally {
    isRefreshingAI.value = false;
  }
};

const applyOptimization = async () => {
  const items = suggestedOptimization.value?.items;
  if (!items?.length) return;

  const cart = useCartStore();
  items.forEach(item => {
    cart.addDiscountedItem({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      discountedPrice: item.discountedPrice,
      discountPercent: item.discountPercent,
      quantity: item.quantity
    });
  });

  toast.success(`${items.length} item${items.length > 1 ? 's' : ''} added to cart with AI discounts!`);
  setTimeout(() => router.push('/cart'), 700);
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