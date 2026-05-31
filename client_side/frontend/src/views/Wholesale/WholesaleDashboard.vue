<template>
  <div class="min-h-screen" style="background: #0d1b35;">

    <!-- Navy command header -->
    <div style="background: linear-gradient(135deg, #0a1628 0%, #0d2142 50%, #0f2d5a 100%); position: relative; overflow: hidden; border-bottom: 1px solid rgba(99,179,237,0.1);">
      <div style="position:absolute;top:-80px;right:-80px;width:320px;height:320px;border-radius:50%;background:rgba(99,179,237,0.04);"></div>
      <div style="position:absolute;bottom:-60px;left:5%;width:200px;height:200px;border-radius:50%;background:rgba(129,140,248,0.04);"></div>
      <div class="container-custom relative z-10 py-12">
        <p class="text-cyan-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Wholesale Partner Hub</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-5 justify-between">
          <div>
            <h1 class="font-serif text-4xl font-bold text-white leading-tight">
              {{ auth.user?.business_name || 'Wholesale Partner' }}
            </h1>
            <p class="text-slate-400 mt-2 text-sm">Supply chain, bulk orders, fleet tracking — all in one view.</p>
          </div>
          <div class="flex items-center gap-2.5 border rounded-2xl px-4 py-2.5" style="background: rgba(255,255,255,0.05); border-color: rgba(99,179,237,0.2);">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-cyan-200">Wholesale Account</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-10 space-y-8">

    <!-- Stats Cards — dark navy -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <!-- Credit Limit -->
      <div class="rounded-2xl p-6 border transition-all duration-300 hover:border-cyan-500/40" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(99,179,237,0.1);">
            <svg class="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-cyan-400 border px-2.5 py-1 rounded-full" style="border-color: rgba(99,179,237,0.3); background: rgba(99,179,237,0.08);">{{ usedCreditPercent }}% Used</span>
        </div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Credit</p>
        <p class="font-serif text-2xl font-bold text-white">KES {{ formatPrice(creditLimit - usedCredit) }}</p>
        <div class="mt-3">
          <div class="w-full rounded-full h-1" style="background: rgba(255,255,255,0.1);">
            <div class="h-1 rounded-full transition-all duration-500 bg-cyan-400" :style="{ width: usedCreditPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Active Orders -->
      <div class="rounded-2xl p-6 border transition-all duration-300 hover:border-indigo-400/40" style="background: #0f2040; border-color: rgba(129,140,248,0.15);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(129,140,248,0.1);">
            <svg class="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-indigo-400 border px-2.5 py-1 rounded-full" style="border-color: rgba(129,140,248,0.3); background: rgba(129,140,248,0.08);">{{ activeOrdersList.length }} active</span>
        </div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Orders</p>
        <p class="font-serif text-2xl font-bold text-white">{{ activeOrdersList.length }}</p>
        <div v-if="activeOrdersList.length > 0" class="mt-3 space-y-1.5 max-h-28 overflow-y-auto">
          <div v-for="order in activeOrdersList.slice(0, 3)" :key="order.id"
            class="flex justify-between items-center p-2 rounded-lg cursor-pointer transition border-l-2 border-indigo-400"
            style="background: rgba(129,140,248,0.06);"
            @click="$router.push(`/orders/${order.id}`)">
            <div>
              <p class="text-xs font-bold text-slate-300">#{{ order.order_number }}</p>
              <p class="text-[10px] text-slate-500 capitalize">{{ order.status }}</p>
            </div>
            <p class="text-xs font-bold text-cyan-400">KES {{ formatPrice(order.total_amount) }}</p>
          </div>
        </div>
        <button @click="$router.push('/orders')" class="mt-3 text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition">
          View All
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Bulk Savings -->
      <div class="rounded-2xl p-6 border transition-all duration-300 hover:border-emerald-400/40" style="background: #0f2040; border-color: rgba(52,211,153,0.15);">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(52,211,153,0.1);">
            <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span class="text-xs font-bold text-emerald-400 border px-2.5 py-1 rounded-full" style="border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.08);">Wholesale Tier</span>
        </div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Savings</p>
        <p class="font-serif text-2xl font-bold text-white">KES {{ formatPrice(savingsThisMonth) }}</p>
        <button class="mt-3 text-sm text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition">
          View Savings
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Wallet Balance Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition">
            <svg class="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Wallet Balance</p>
        <p class="font-serif text-2xl font-bold text-white">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
        <button @click="$router.push('/wallet')" class="mt-3 text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition">
          Top Up
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

        <!-- AI Optimizer — dark card -->
        <div class="rounded-2xl border overflow-hidden" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
          <div class="px-6 py-4 border-b flex items-center justify-between" style="border-color: rgba(99,179,237,0.1); background: rgba(99,179,237,0.05);">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center bg-cyan-600">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="font-serif font-bold text-lg text-white">Bulk Order Optimizer</h3>
            </div>
            <button @click="refreshAIInsights" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition" :disabled="isRefreshingAI">
              {{ isRefreshingAI ? 'Loading…' : 'Refresh ↻' }}
            </button>
          </div>
          <div class="p-6">
            <div class="border-l-2 border-cyan-500 pl-4 py-1 mb-5">
              <p class="text-base text-slate-300 italic leading-relaxed">"{{ aiRecommendation }}"</p>
            </div>
            <div v-if="suggestedOptimization" class="rounded-xl p-4 border" style="background: rgba(99,179,237,0.07); border-color: rgba(99,179,237,0.2);">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Bulk Order Suggestion</span>
                <span class="text-xs font-bold text-emerald-400">Save {{ suggestedOptimization.savingsPercent }}%</span>
              </div>
              <p class="text-sm text-slate-400 mb-3">{{ suggestedOptimization.description }}</p>
              <button @click="applyOptimization" class="w-full py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90" style="background: linear-gradient(135deg, #0e7490, #1d4ed8);">
                Apply Bulk Order →
              </button>
            </div>
          </div>
        </div>

        <!-- Regional Demand — dark bars -->
        <div class="rounded-2xl border p-6" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-serif font-bold text-lg text-white">Regional Demand Forecast</h3>
            <button @click="fetchDashboardData" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition">Update ↻</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="region in regionalDemand" :key="region.code"
              class="p-4 rounded-xl border transition"
              style="background: rgba(255,255,255,0.03); border-color: rgba(99,179,237,0.1);">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-slate-300">{{ region.name }}</span>
                <span :class="region.trend === 'up' ? 'text-emerald-400' : 'text-red-400'" class="text-xs font-bold">
                  {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
                </span>
              </div>
              <div class="w-full rounded-full h-1.5 mt-2" style="background: rgba(255,255,255,0.08);">
                <div class="h-1.5 rounded-full transition-all duration-700"
                  :style="{ width: region.percentage + '%', background: region.trend === 'up' ? '#34d399' : '#f87171' }">
                </div>
              </div>
              <p class="text-[10px] text-slate-600 mt-2 text-right">{{ region.percentage }}% demand intensity</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">

        <!-- Bulk CSV Upload -->
        <div class="rounded-2xl border p-6" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
          <h3 class="font-serif font-bold text-lg text-white mb-5 flex items-center gap-2">
            <svg class="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Bulk CSV Order
          </h3>
          <div class="rounded-xl p-6 text-center cursor-pointer transition border-2 border-dashed hover:border-cyan-400"
            style="border-color: rgba(99,179,237,0.2);" @click="triggerFileUpload">
            <div v-if="uploadState === 'uploading'">
              <svg class="h-10 w-10 text-cyan-400 mx-auto mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p class="text-sm font-bold text-cyan-400">Uploading {{ uploadProgress }}%</p>
            </div>
            <div v-else>
              <svg class="h-10 w-10 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-xs text-slate-500">Click to upload CSV</p>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept=".csv" @change="handleFileUpload" />
          </div>
          <button @click="downloadTemplate" class="w-full mt-4 text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-1 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download CSV Template
          </button>
        </div>

        <!-- Live Fleet Tracking -->
        <div class="rounded-2xl border p-6" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-serif font-bold text-lg text-white">Live Fleet</h3>
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
          </div>
          <div class="space-y-3">
            <div v-for="fleet in activeFleet" :key="fleet.id"
              class="flex items-center justify-between p-3 rounded-xl transition border"
              style="background: rgba(255,255,255,0.03); border-color: rgba(99,179,237,0.1);">
              <div class="flex items-center gap-3">
                <div :class="fleet.status === 'delivering' ? 'bg-emerald-400' : 'bg-cyan-400'" class="w-2 h-2 rounded-full"></div>
                <div>
                  <p class="text-sm font-bold text-slate-300">{{ fleet.name }}</p>
                  <p class="text-[10px] text-slate-600">ETA: {{ fleet.eta }}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-cyan-400 px-2 py-1 rounded-full uppercase border" style="border-color: rgba(99,179,237,0.3);">{{ fleet.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order History — dark table -->
    <div class="rounded-2xl border overflow-hidden" style="background: #0f2040; border-color: rgba(99,179,237,0.15);">
      <div class="px-6 py-5 border-b flex justify-between items-center" style="border-color: rgba(99,179,237,0.1);">
        <h3 class="font-serif font-bold text-lg text-white">Wholesale Order History</h3>
        <router-link to="/orders" class="text-sm text-cyan-400 hover:text-cyan-300 font-bold transition">View All →</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr style="background: rgba(255,255,255,0.03);">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order #</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id"
              class="border-t transition"
              style="border-color: rgba(99,179,237,0.07);"
              :style="''" @mouseover="e => e.currentTarget.style.background='rgba(99,179,237,0.04)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
              <td class="px-6 py-4 text-sm font-bold text-slate-300">#{{ order.order_number }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(order.createdAt) }}</td>
              <td class="px-6 py-4 text-sm font-bold text-cyan-400">KES {{ formatPrice(order.total_amount) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">{{ order.status }}</span>
              </td>
              <td class="px-6 py-4">
                <router-link :to="`/orders/${order.id}`" class="text-cyan-400 hover:text-cyan-300 text-sm font-bold">Details</router-link>
              </td>
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="5" class="px-6 py-14 text-center text-slate-600 font-medium">No recent orders found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    </div><!-- end container-custom -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import api from '@/services/api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useToast } from 'vue-toast-notification';
import { getSocket } from '@/services/socket';

const auth = useAuthStore();
const toast = useToast();

const creditLimit = computed(() => parseFloat(auth.user?.credit_limit || 0));
const usedCredit = ref(0);
const usedCreditPercent = computed(() => {
  if (creditLimit.value === 0) return 0;
  return Math.min(Math.round((usedCredit.value / creditLimit.value) * 100), 100);
});

const activeOrdersList = ref([]);
const recentOrders = ref([]);
const savingsThisMonth = ref(0);
const lowStockCount = ref(0);
const aiRecommendation = ref('Analyzing bulk ordering patterns for your business...');
const isRefreshingAI = ref(false);
const suggestedOptimization = ref(null);

const regionalDemand = ref([
  { code: 'NBO', name: 'Nairobi', percentage: 85, trend: 'up', change: 12 },
  { code: 'MBS', name: 'Mombasa', percentage: 65, trend: 'up', change: 8 },
  { code: 'KSM', name: 'Kisumu', percentage: 45, trend: 'down', change: 3 }
]);

const activeFleet = ref([
  { id: 1, name: 'Truck KDB 123A', eta: '10 mins', status: 'delivering' },
  { id: 2, name: 'Van KDC 456B', eta: '25 mins', status: 'loading' }
]);

const fetchDashboardData = async () => {
  try {
    const [activeRes, recentRes, aiRes] = await Promise.all([
      api.get('/orders?status=pending,processing,dispatched&limit=5'),
      api.get('/orders?limit=10'),
      api.get('/ai/user/dashboard')
    ]);

    activeOrdersList.value = activeRes.data || [];
    recentOrders.value = recentRes.data || [];
    
    // Calculate used credit from active orders
    usedCredit.value = activeOrdersList.value.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    
    if (aiRes.data) {
       if (aiRes.data.demandInsights) {
         regionalDemand.value = aiRes.data.demandInsights.slice(0, 3).map(item => ({
            code: item.region,
            name: item.regionName || item.region,
            percentage: item.percentage || 50,
            trend: item.trend || 'up',
            change: item.changePercent || 0
         }));
       }
       if (aiRes.data.recommendations?.length > 0) {
          aiRecommendation.value = aiRes.data.recommendations[0].message;
       }
       lowStockCount.value = aiRes.data.lowStockCount || 0;
       savingsThisMonth.value = aiRes.data.monthlySavings || 0;
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
};

const refreshAIInsights = async () => {
  isRefreshingAI.value = true;
  try {
    const cartStore = useCartStore();
    // Send first 6 cart items so the optimizer applies wholesale-tier discounts to them
    const cartItems = cartStore.items.slice(0, 6).map(i => ({
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity
    }));

    const { data } = await api.post('/ai/bulk-optimize', { cartItems });

    const cartOpt  = data.cartOptimized || [];
    const recs     = data.recommendations || [];
    const allItems = [...cartOpt, ...recs];

    if (allItems.length === 0) {
      aiRecommendation.value = 'Place your first wholesale order to unlock AI-powered bulk purchase recommendations!';
      suggestedOptimization.value = null;
    } else {
      aiRecommendation.value = cartOpt.length > 0
        ? cartOpt[0].reasoning
        : (recs[0]?.reasoning || `Bulk optimizer found ${recs.length} reorder opportunities.`);

      const totalBase  = allItems.reduce((s, r) => s + (r.basePrice * r.recommendedQuantity), 0);
      const savingsPct = data.tierInfo?.discountPercent || (totalBase > 0 ? Math.round((allItems.reduce((s, r) => s + (r.totalSavings || 0), 0) / totalBase) * 100) : 0);

      const cartNote = cartOpt.length > 0 ? `${cartOpt.length} cart item${cartOpt.length > 1 ? 's' : ''} discounted` : '';
      const recNote  = recs.length > 0 ? `${recs.length} bulk reorder${recs.length > 1 ? 's' : ''}` : '';
      const parts    = [cartNote, recNote].filter(Boolean).join(' + ');

      suggestedOptimization.value = {
        description: savingsPct > 0
          ? `${parts} — save ${savingsPct}% with your ${data.tierInfo?.tier || 'wholesale'} tier.`
          : `${parts} based on velocity & order history.`,
        savingsPercent: savingsPct,
        totalCartSavings: data.totalCartSavings || 0,
        items: allItems
          .filter(r => r.stockUrgency !== 'out_of_stock')
          .map(r => ({
            product_id:    r.productId,
            name:          r.productName,
            price:         r.basePrice,
            discountedPrice: r.discountedPrice,
            discountPercent: r.discountPercent,
            quantity:      r.recommendedQuantity,
            image_url:     r.productImage,
            isCartItem:    r.isCartItem || false
          }))
      };
    }
    const savedMsg = data.totalCartSavings > 0
      ? `Cart optimized! Saving KES ${Math.round(data.totalCartSavings)} on your current items.`
      : 'Bulk insights refreshed!';
    toast.success(savedMsg);
  } catch {
    toast.error('Could not refresh bulk insights. Try again.');
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

  toast.success(`${items.length} bulk item${items.length > 1 ? 's' : ''} added to cart with wholesale discounts!`);
  setTimeout(() => router.push('/cart'), 700);
};

const triggerFileUpload = () => {
  const input = document.querySelector('input[type="file"]');
  input.click();
};

const uploadState = ref('idle');
const uploadProgress = ref(0);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadState.value = 'uploading';
  uploadProgress.value = 0;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const interval = setInterval(() => {
      if (uploadProgress.value < 90) uploadProgress.value += 10;
    }, 100);

    await api.post('/orders/bulk', formData);
    
    clearInterval(interval);
    uploadProgress.value = 100;
    toast.success('Bulk order processed successfully!');
    fetchDashboardData();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Bulk upload failed');
  } finally {
    setTimeout(() => {
      uploadState.value = 'idle';
      uploadProgress.value = 0;
    }, 2000);
  }
};

const downloadTemplate = () => {
  const csvContent = "data:text/csv;charset=utf-8,product_id,quantity,branch_code\nPRD001,100,NBO01\nPRD002,50,MBS02";
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "wholesale_bulk_template.csv");
  document.body.appendChild(link);
  link.click();
};

const getStatusClass = (status) => {
  const base = 'px-2 py-1 rounded-full text-[10px] font-bold uppercase';
  switch (status) {
    case 'pending': return `${base} bg-yellow-100 text-yellow-700`;
    case 'processing': return `${base} bg-blue-100 text-blue-700`;
    case 'dispatched': return `${base} bg-purple-100 text-purple-700`;
    case 'delivered': return `${base} bg-green-100 text-green-700`;
    case 'cancelled': return `${base} bg-red-100 text-red-700`;
    default: return `${base} bg-gray-100 text-gray-700`;
  }
};

// Real-time updates
const setupSocketListeners = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.on('orderUpdate', (data) => {
    toast.info(`Order #${data.order_number} status updated to ${data.status}`);
    fetchDashboardData();
  });

  socket.on('walletUpdate', (data) => {
    auth.updateUser({ wallet_balance: data.balance });
    toast.success(`Wallet updated! New balance: KES ${formatPrice(data.balance)}`);
  });
};

onMounted(() => {
  fetchDashboardData();
  setupSocketListeners();
});
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