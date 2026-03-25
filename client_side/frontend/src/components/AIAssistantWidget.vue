<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-purple-100 transition-all duration-300 hover:shadow-2xl">
    <!-- Animated Background Elements -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
    <div class="absolute bottom-0 left-0 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
    
    <!-- Header with Animated Icon -->
    <div class="flex items-center gap-3 mb-6 relative z-10">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-50 animate-pulse"></div>
        <div class="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2.5 shadow-lg animate-float">
          <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      <div>
        <h3 class="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">AI Assistant</h3>
        <p class="text-xs text-gray-500">Powered by BestLady AI</p>
      </div>
    </div>
    
    <!-- Loading State with Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded-xl mb-3 shimmer"></div>
        <div class="h-16 bg-gray-200 rounded-xl mb-3 shimmer"></div>
        <div class="h-24 bg-gray-200 rounded-xl shimmer"></div>
      </div>
    </div>
    
    <div v-else class="space-y-5">
      <!-- Spending Insights with Mini Chart -->
      <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer" @click="viewSpendingDetails">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Spent (Last 30 Days)
            </p>
            <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(spending.totalSpent) }}</p>
          </div>
          <div :class="spending.trend === 'increasing' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            {{ spending.trend === 'increasing' ? '↑' : '↓' }} {{ Math.abs(spending.trendPercent) }}%
          </div>
        </div>
        
        <!-- Mini Progress Bar -->
        <div class="mt-3">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Spending Trend</span>
            <span>{{ spending.trend === 'increasing' ? 'Higher than usual' : 'Lower than usual' }}</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              class="h-1.5 rounded-full transition-all duration-700"
              :class="spending.trend === 'increasing' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'"
              :style="{ width: Math.min(Math.abs(spending.trendPercent), 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Low Stock Alerts with Emergency Action -->
      <div v-if="alerts.length" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-200 rounded-full blur-2xl opacity-30"></div>
        <div class="flex items-center gap-2 mb-3 relative z-10">
          <div class="bg-yellow-500 rounded-full p-1.5 animate-pulse">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="font-semibold text-yellow-800">⚠️ Low Stock Alerts</span>
          <span class="ml-auto text-xs text-yellow-600">{{ alerts.length }} items</span>
        </div>
        <ul class="space-y-2 relative z-10">
          <li v-for="alert in alerts.slice(0, 3)" :key="alert.productId" class="text-sm flex justify-between items-center group/alert">
            <span class="text-gray-700 group-hover/alert:text-yellow-700 transition-colors">{{ alert.productName }}</span>
            <div class="flex items-center gap-2">
              <span class="text-red-600 font-semibold">{{ alert.currentStock }} left</span>
              <button @click="reorderProduct(alert.productId)" class="text-xs text-yellow-700 hover:text-yellow-800 font-medium opacity-0 group-hover/alert:opacity-100 transition-all">
                Reorder →
              </button>
            </div>
          </li>
        </ul>
        <button v-if="alerts.length > 3" class="mt-3 text-xs text-yellow-700 hover:underline font-semibold">View all {{ alerts.length }} alerts →</button>
      </div>
      
      <!-- Smart Recommendations with Carousel -->
      <div v-if="recommendations.length" class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-2xl opacity-30"></div>
        <div class="flex items-center justify-between mb-3 relative z-10">
          <div class="flex items-center gap-2">
            <div class="bg-green-500 rounded-full p-1.5">
              <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <span class="font-semibold text-green-800">✨ Recommended for You</span>
          </div>
          <button class="text-xs text-green-600 hover:text-green-700 font-medium">View All</button>
        </div>
        
        <!-- Recommendations Grid -->
        <div class="grid grid-cols-2 gap-3 relative z-10">
          <div 
            v-for="rec in recommendations.slice(0, 4)" 
            :key="rec.id" 
            class="bg-white rounded-lg p-2 text-center hover:shadow-md transition-all cursor-pointer group/rec transform hover:-translate-y-1"
            @click="goToProduct(rec.id)"
          >
            <div class="relative overflow-hidden rounded-md mb-2">
              <img :src="rec.image_url || '/placeholder.jpg'" class="w-full h-16 object-cover rounded-md group-hover/rec:scale-110 transition-transform duration-300" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/rec:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-xs text-white font-semibold">Quick View</span>
              </div>
            </div>
            <p class="text-xs font-medium truncate">{{ rec.name }}</p>
            <p class="text-xs text-primary-600 font-bold">KES {{ formatPrice(rec.price) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Demand Insights with Trend Graph -->
      <div v-if="demandInsights.length" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="bg-blue-500 rounded-full p-1.5">
              <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span class="font-semibold text-blue-800">📈 Trending Now</span>
          </div>
          <span class="text-xs text-blue-600">Last 7 days</span>
        </div>
        <div class="space-y-3">
          <div v-for="insight in demandInsights.slice(0, 3)" :key="insight.productId" class="flex justify-between items-center group">
            <span class="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">{{ insight.productName }}</span>
            <div class="flex items-center gap-2">
              <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  :style="{ width: Math.min(insight.trendPercent, 100) + '%' }"
                ></div>
              </div>
              <span class="text-green-600 text-sm font-semibold">+{{ insight.trendPercent }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Personalized Savings Tip -->
      <div v-if="savingsTip" class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 text-center">
        <p class="text-sm text-purple-800 font-medium">{{ savingsTip }}</p>
      </div>
    </div>
    
    <!-- Refresh Button with Enhanced Design -->
    <button 
      @click="refreshInsights"
      :disabled="refreshing"
      class="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 group relative overflow-hidden"
    >
      <span class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
      <svg :class="refreshing ? 'animate-spin' : 'group-hover:rotate-180'" class="h-5 w-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {{ refreshing ? 'Updating Insights...' : 'Refresh Insights' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { formatPrice } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const loading = ref(true)
const refreshing = ref(false)
const alerts = ref([])
const spending = ref({ totalSpent: 0, trend: 'stable', trendPercent: 0 })
const recommendations = ref([])
const demandInsights = ref([])

// Generate personalized savings tip based on spending
const savingsTip = computed(() => {
  if (spending.value.totalSpent > 5000) {
    return "💡 You've spent over KES 5,000 this month! Consider our wholesale prices for bulk orders."
  } else if (spending.value.trend === 'increasing' && spending.value.trendPercent > 20) {
    return "📈 Your spending is up 20%! Check out our subscription plans for regular savings."
  } else if (alerts.value.length > 0) {
    return "⚠️ Running low on stock? Order now to avoid stockouts and get free delivery!"
  }
  return "✨ Tip: Add items to wishlist to get notified when prices drop!"
})

const goToProduct = (id) => {
  router.push(`/products/${id}`)
}

const reorderProduct = (productId) => {
  toast.info('Opening product page to reorder...')
  router.push(`/products/${productId}`)
}

const viewSpendingDetails = () => {
  toast.info('Detailed spending analytics coming soon!')
  // router.push('/analytics')
}

const fetchInsights = async () => {
  try {
    const { data } = await api.get('/ai/user/dashboard')
    alerts.value = data.alerts || []
    spending.value = data.spending || { totalSpent: 0, trend: 'stable', trendPercent: 0 }
    recommendations.value = data.recommendations || []
    demandInsights.value = data.demandInsights || []
  } catch (error) {
    console.error('Failed to fetch AI insights:', error)
    toast.error('Unable to load AI insights. Please try again.')
  } finally {
    loading.value = false
  }
}

const refreshInsights = async () => {
  refreshing.value = true
  await fetchInsights()
  refreshing.value = false
  toast.success('Insights refreshed!')
}

onMounted(() => {
  fetchInsights()
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>