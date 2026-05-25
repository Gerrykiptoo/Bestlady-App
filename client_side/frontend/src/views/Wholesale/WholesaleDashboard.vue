<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Page hero -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Wholesale Partner Dashboard</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="text-3xl font-black text-white">
              Welcome back, {{ auth.user?.business_name || 'Wholesale Partner' }}
            </h1>
            <p class="text-white/70 mt-1 text-sm">Manage your bulk supply chain and track orders in real-time.</p>
          </div>
          <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-white">Wholesale Account</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8 space-y-8">

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Credit Limit Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition">
            <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span class="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{{ usedCreditPercent }}% Used</span>
        </div>
        <p class="text-sm text-gray-500">Available Credit</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(creditLimit - usedCredit) }}</p>
        <div class="mt-2">
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div class="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" :style="{ width: usedCreditPercent + '%' }"></div>
          </div>
        </div>
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

      <!-- Bulk Savings Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Wholesale Tier</span>
        </div>
        <p class="text-sm text-gray-500">Monthly Savings</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(savingsThisMonth) }}</p>
        <button class="mt-3 text-sm text-primary-600 hover:underline flex items-center gap-1">
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
            <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
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
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- AI Optimizer Widget (Matching Retail Style) -->
        <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-amber-200 rounded-full blur-2xl opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="flex items-center justify-between mb-4 relative z-10">
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-2">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="font-bold text-xl text-gray-800">AI Purchaser Optimizer</h3>
            </div>
            <button @click="refreshAIInsights" class="text-xs text-amber-700 font-bold hover:underline" :disabled="isRefreshingAI">
              {{ isRefreshingAI ? 'Refreshing...' : 'Refresh Insights ↻' }}
            </button>
          </div>
          <div class="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-4 relative z-10">
            <p class="text-amber-900 font-medium italic">"{{ aiRecommendation }}"</p>
          </div>
          
          <div v-if="suggestedOptimization" class="bg-white rounded-xl p-4 mb-4 border border-amber-100 animate-fade-in">
             <div class="flex justify-between items-center mb-2">
               <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Suggested Order Improvement</span>
               <span class="text-xs font-bold text-green-600">Save {{ suggestedOptimization.savingsPercent }}%</span>
             </div>
             <p class="text-sm text-gray-700 mb-3">{{ suggestedOptimization.description }}</p>
             <button @click="applyOptimization" class="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Apply Suggested Bulk Order
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
              <h3 class="font-bold text-lg text-gray-800">Regional Demand Forecast</h3>
            </div>
            <button @click="fetchDashboardData" class="text-xs text-primary-600 hover:rotate-180 transition-transform duration-500">
              Refresh Insights ↻
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="region in regionalDemand" :key="region.code" class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-gray-700">{{ region.name }}</span>
                <span :class="region.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'" class="text-xs font-bold px-2 py-1 rounded-full">
                  {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  class="h-2 rounded-full transition-all duration-1000" 
                  :class="region.trend === 'up' ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: region.percentage + '%' }"
                ></div>
              </div>
              <p class="text-[10px] text-gray-400 mt-2 text-right">Relative demand intensity: {{ region.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Bulk Upload -->
        <div class="bg-white rounded-2xl shadow-md p-6 border-2 border-primary-50">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Bulk CSV Order
          </h3>
          <div 
            class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer group"
            @click="triggerFileUpload"
          >
            <div v-if="uploadState === 'uploading'" class="animate-pulse">
                <svg class="h-10 w-10 text-primary-500 mx-auto mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p class="text-sm font-bold text-primary-600">Uploading {{ uploadProgress }}%</p>
            </div>
            <div v-else>
                <svg class="h-10 w-10 text-gray-300 mx-auto mb-2 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs text-gray-500">Drag & Drop or Click to Upload</p>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept=".csv" @change="handleFileUpload" />
          </div>
          <button @click="downloadTemplate" class="w-full mt-4 text-xs text-primary-600 hover:underline flex items-center justify-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download CSV Template
          </button>
        </div>

        <!-- Live Fleet Tracking -->
        <div class="bg-white rounded-2xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Live Fleet
            </h3>
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <div class="space-y-4">
            <div v-for="fleet in activeFleet" :key="fleet.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div class="flex items-center gap-3">
                <div :class="fleet.status === 'delivering' ? 'bg-green-500' : 'bg-blue-500'" class="w-2 h-2 rounded-full"></div>
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ fleet.name }}</p>
                  <p class="text-[10px] text-gray-400">ETA: {{ fleet.eta }}</p>
                </div>
              </div>
              <span class="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full uppercase">{{ fleet.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden mt-8">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 class="font-bold text-lg flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Wholesale Order History
        </h3>
        <router-link to="/orders" class="text-sm text-primary-600 font-medium hover:underline">View All Records →</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order #</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm font-bold">#{{ order.order_number }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
              <td class="px-6 py-4 text-sm font-bold text-primary-600">KES {{ formatPrice(order.total_amount) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <router-link :to="`/orders/${order.id}`" class="text-primary-600 hover:text-primary-800 text-sm font-bold">Details</router-link>
              </td>
            </tr>
            <tr v-if="recentOrders.length === 0">
               <td colspan="5" class="px-6 py-12 text-center text-gray-500">No recent orders found</td>
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
    const { data } = await api.get('/ai/insights/refresh');
    aiRecommendation.value = data.recommendation || 'Stock up on Hair Extensions; demand in Nairobi is peaking next week.';
    suggestedOptimization.value = data.suggestion || {
      description: 'Increase bulk order for "Radiance Shine" products by 20% to unlock an additional 5% tier discount.',
      savingsPercent: 5,
      items: []
    };
    toast.success('AI Insights updated!');
  } catch (error) {
    console.error('AI refresh failed:', error);
    toast.error('Failed to refresh AI insights');
  } finally {
    isRefreshingAI.value = false;
  }
};

const applyOptimization = async () => {
  try {
    toast.info('Applying optimization to your cart...');
    // In a real app, this would add specific items to cart or modify existing ones
    // For now we simulate the action
    setTimeout(() => {
      toast.success('Optimization applied! Bulk discounts added to cart.');
    }, 1000);
  } catch (error) {
    toast.error('Failed to apply optimization');
  }
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