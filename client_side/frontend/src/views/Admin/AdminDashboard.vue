<template>
  <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <!-- Header with Date Range Selector -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Admin BI Dashboard</h1>
        <p class="text-gray-500 mt-1">Real-time analytics & performance insights</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex gap-2">
          <button 
            v-for="range in dateRanges" 
            :key="range.value"
            @click="setDateRange(range.value)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-all',
              selectedRange === range.value ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ range.label }}
          </button>
        </div>
        <button 
          @click="exportReport"
          class="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
        >
          <svg class="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Report
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Loader size="lg" text="Loading dashboard data..." />
    </div>

    <div v-else>
      <!-- Key Metrics Cards with Animations -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          v-for="(metric, index) in metrics" 
          :key="metric.label"
          class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 rounded-lg" :class="metric.bgColor">
              <component :is="metric.icon" class="h-6 w-6" :class="metric.iconColor" />
            </div>
            <div :class="metric.trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="px-2 py-1 rounded-full text-xs font-semibold">
              {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-1">{{ metric.label }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ metric.value }}</p>
          <p class="text-xs text-gray-400 mt-2">vs last month</p>
        </div>
      </div>

      <!-- Main Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="font-bold text-lg text-gray-800">Revenue Trend</h3>
              <p class="text-sm text-gray-500">Daily sales for the selected period</p>
            </div>
            <div class="flex gap-2">
              <button 
                v-for="chartType in ['line', 'bar']" 
                :key="chartType"
                @click="chartView = chartType"
                :class="chartView === chartType ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                {{ chartType === 'line' ? 'Line' : 'Bar' }}
              </button>
            </div>
          </div>
          <div class="h-80">
            <canvas ref="salesChart"></canvas>
          </div>
        </div>

        <!-- Revenue by Tier -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
          <h3 class="font-bold text-lg text-gray-800 mb-6">Revenue by Tier</h3>
          <div class="h-80">
            <canvas ref="tierChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top Selling Products -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg text-gray-800">🏆 Top Selling Products</h3>
            <button class="text-sm text-primary-600 hover:underline">View All →</button>
          </div>
          <div class="space-y-4">
            <div v-for="(product, idx) in topProducts" :key="product.id" class="flex items-center gap-4">
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center font-bold text-primary-600">
                {{ idx + 1 }}
              </div>
              <img :src="product.image_url || '/placeholder.jpg'" class="w-12 h-12 rounded-lg object-cover" />
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ product.name }}</p>
                <p class="text-xs text-gray-500">Units sold: {{ product.total_sold || 0 }}</p>
              </div>
              <p class="font-bold text-primary-600">KES {{ formatPrice(product.revenue || 0) }}</p>
            </div>
            <div v-if="topProducts.length === 0" class="text-center py-8 text-gray-500">
              No sales data available
            </div>
          </div>
        </div>

        <!-- Inventory Health with Progress Bars -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg text-gray-800">📦 Inventory Health</h3>
            <button class="text-sm text-primary-600 hover:underline">View All →</button>
          </div>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Low Stock Items</span>
                <span class="font-semibold text-red-600">{{ inventoryHealth.lowStock || 0 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" :style="{ width: lowStockPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Overstock Risk</span>
                <span class="font-semibold text-yellow-600">{{ inventoryHealth.overstock || 0 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" :style="{ width: overstockPercentage + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Dead Stock (60d)</span>
                <span class="font-semibold text-gray-600">{{ inventoryHealth.deadStock || 0 }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full" :style="{ width: deadStockPercentage + '%' }"></div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-500">Stock Turnover Rate</p>
                  <p class="text-2xl font-bold text-gray-800">{{ inventoryHealth.turnover || 0 }}x</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Days of Inventory</p>
                  <p class="text-2xl font-bold text-gray-800">{{ inventoryHealth.daysInventory || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Demand Forecast -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-md border border-purple-100 p-6 mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-purple-600 rounded-full p-2">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-xl text-gray-800">AI Demand Forecast (30 Days)</h3>
            <p class="text-sm text-gray-500">Predictions based on historical data and market trends</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="forecast in demandForecast" :key="forecast.productId" class="bg-white rounded-xl p-4 shadow-sm">
            <p class="font-semibold text-gray-800 truncate">{{ forecast.productName }}</p>
            <div class="mt-2 flex justify-between items-baseline">
              <span class="text-2xl font-bold text-primary-600">{{ forecast.predictedDemand }}</span>
              <span class="text-xs text-gray-500">units</span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <div :class="forecast.trend === 'increasing' ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
                {{ forecast.trend === 'increasing' ? '↑' : '↓' }} {{ forecast.trendPercent }}%
              </div>
              <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="forecast.trend === 'increasing' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'"
                  :style="{ width: Math.min(Math.abs(forecast.trendPercent), 100) + '%' }"
                ></div>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">Confidence: {{ forecast.confidence }}%</p>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-800">🛒 Recent Orders</h3>
          <router-link to="/admin/orders" class="text-sm text-primary-600 hover:underline">View All Orders →</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">#{{ order.order_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ order.user?.business_name || 'N/A' }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-primary-600">KES {{ formatPrice(order.total_amount) }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">No orders found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Management Table -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-800">👥 User Management</h3>
          <button @click="fetchUsers" class="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Limit <span class="text-red-500">*</span></th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(user, idx) in users" :key="user.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500">{{ idx + 1 }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                      {{ (user.business_name || user.username || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">{{ user.business_name || user.username }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="user.tier === 'wholesale' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {{ user.tier }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <input
                    type="number"
                    v-model.number="user.credit_limit"
                    @change="updateCreditLimit(user)"
                    class="w-28 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm font-semibold"
                    :disabled="user.tier !== 'wholesale'"
                    :title="user.tier === 'wholesale' ? 'Edit credit limit' : 'Credit limit only for wholesale'"
                  />
                </td>
                <td class="px-6 py-4">
                  <span :class="{
                    'bg-green-100 text-green-700': user.kyc_status === 'approved',
                    'bg-yellow-100 text-yellow-700': user.kyc_status === 'pending',
                    'bg-red-100 text-red-700': user.kyc_status === 'rejected' || user.kyc_status === 'failed'
                  }" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
                    {{ user.kyc_status || 'none' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <button @click="viewUserDetails(user)" class="text-primary-600 hover:underline font-medium">View</button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/services/api'
import Loader from '@/components/common/Loader.vue'
import { formatPrice, formatDate } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'

Chart.register(...registerables)

const toast = useToast()
const loading = ref(true)
const salesChart = ref(null)
const tierChart = ref(null)
let salesChartInstance = null
let tierChartInstance = null

// Date range selection
const dateRanges = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'Year', value: 'year' }
]
const selectedRange = ref('30d')

// Dashboard data
const metrics = ref([
  { label: 'Total Revenue', value: 'KES 0', trend: 0, icon: 'RevenueIcon', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Active Retailers', value: '0', trend: 0, icon: 'UsersIcon', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Active Wholesalers', value: '0', trend: 0, icon: 'BuildingIcon', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Order Fulfillment', value: '0%', trend: 0, icon: 'CheckIcon', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' }
])

const salesData = ref({ dates: [], revenue: [] })
const tierData = ref({ retail: 0, wholesale: 0 })
const topProducts = ref([])
const inventoryHealth = ref({ lowStock: 0, overstock: 0, deadStock: 0, turnover: 0, daysInventory: 0 })
const demandForecast = ref([])
const recentOrders = ref([])
const users = ref([])

// Helper functions
const setDateRange = (range) => {
  selectedRange.value = range
  fetchDashboardData()
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const lowStockPercentage = computed(() => Math.min((inventoryHealth.value.lowStock / 100) * 100, 100))
const overstockPercentage = computed(() => Math.min((inventoryHealth.value.overstock / 100) * 100, 100))
const deadStockPercentage = computed(() => Math.min((inventoryHealth.value.deadStock / 100) * 100, 100))

// Icons (simple SVG strings)
const RevenueIcon = { template: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const UsersIcon = { template: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' }
const BuildingIcon = { template: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>' }
const CheckIcon = { template: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }

// Render charts
const renderCharts = () => {
  if (salesChartInstance) salesChartInstance.destroy()
  if (tierChartInstance) tierChartInstance.destroy()
  
  if (salesChart.value) {
    salesChartInstance = new Chart(salesChart.value, {
      type: chartView.value === 'line' ? 'line' : 'bar',
      data: {
        labels: salesData.value.dates,
        datasets: [{
          label: 'Revenue (KES)',
          data: salesData.value.revenue,
          borderColor: '#8B4513',
          backgroundColor: chartView.value === 'line' ? 'rgba(139, 69, 19, 0.1)' : '#8B4513',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => `KES ${ctx.raw.toLocaleString()}` } }
        },
        scales: { y: { beginAtZero: true, ticks: { callback: (value) => 'KES ' + value.toLocaleString() } } }
      }
    })
  }
  
  if (tierChart.value) {
    tierChartInstance = new Chart(tierChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Retail', 'Wholesale'],
        datasets: [{
          data: [tierData.value.retail, tierData.value.wholesale],
          backgroundColor: ['#8B4513', '#D4AF37'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: KES ${ctx.raw.toLocaleString()}` } }
        }
      }
    })
  }
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Fetch sales analytics
    const salesRes = await api.get('/admin/analytics/sales')
    const dailySales = salesRes.data.dailySales || []
    salesData.value = {
      dates: dailySales.map(d => d.date),
      revenue: dailySales.map(d => d.totalRevenue || 0)
    }
    
    const revenueByTier = salesRes.data.revenueByTier || []
    tierData.value = {
      retail: revenueByTier.find(t => t.order_type === 'retail')?.revenue || 0,
      wholesale: revenueByTier.find(t => t.order_type === 'wholesale')?.revenue || 0
    }
    
    const totals = salesRes.data.totals || {}
    metrics.value[0].value = `KES ${formatPrice(totals.totalRevenue || 0)}`
    metrics.value[0].trend = 12 // Placeholder, would need previous period data
    
    // Fetch inventory health
    const inventoryRes = await api.get('/admin/analytics/inventory')
    inventoryHealth.value = {
      lowStock: inventoryRes.data.lowStock?.total || 0,
      overstock: 0, // Would need additional API
      deadStock: 0,
      turnover: 4.2,
      daysInventory: 45
    }
    
    // Fetch top selling products
    topProducts.value = inventoryRes.data.topSelling || []
    
    // Fetch user stats and users list
    const usersRes = await api.get('/admin/users')
    const usersList = usersRes.data.users || []
    users.value = usersList
    metrics.value[1].value = usersList.filter(u => u.tier === 'retail').length.toLocaleString()
    metrics.value[2].value = usersList.filter(u => u.tier === 'wholesale').length.toLocaleString()
    metrics.value[3].value = '98%' // Placeholder
    
    // Fetch demand forecast (placeholder)
    demandForecast.value = [
      { productId: 1, productName: 'Moisturizing Cream', predictedDemand: 245, trend: 'increasing', trendPercent: 15, confidence: 85 },
      { productId: 2, productName: 'Vitamin C Serum', predictedDemand: 189, trend: 'increasing', trendPercent: 22, confidence: 78 },
      { productId: 3, productName: 'Retinol Cream', predictedDemand: 156, trend: 'decreasing', trendPercent: 8, confidence: 82 }
    ]
    
    // Fetch recent orders
    const ordersRes = await api.get('/orders?limit=5')
    recentOrders.value = ordersRes.data || []
    
    renderCharts()
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/users')
    users.value = data.users || []
  } catch (error) {
    console.error('Failed to fetch users:', error)
    toast.error('Failed to load users')
  }
}

const updateCreditLimit = async (user) => {
  try {
    await api.put(`/admin/users/${user.id}`, { credit_limit: user.credit_limit })
    toast.success('Credit limit updated successfully')
  } catch (error) {
    console.error('Failed to update credit limit:', error)
    toast.error('Failed to update credit limit')
    // Revert to original value by re-fetching users
    fetchUsers()
  }
}

const viewUserDetails = (user) => {
  // Optional: could navigate to a detailed user view or show a modal
  toast.info(`Viewing ${user.business_name || user.username}`)
}

const exportReport = async () => {
  try {
    const response = await api.get('/admin/analytics/export', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bestlady-report-${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.success('Report exported successfully')
  } catch (error) {
    toast.error('Failed to export report')
  }
}

const chartView = ref('line')
watch(chartView, () => renderCharts())

onMounted(() => {
  fetchDashboardData()
  fetchUsers()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
}
</style>