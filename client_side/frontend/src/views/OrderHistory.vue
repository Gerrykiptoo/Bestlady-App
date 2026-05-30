<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <!-- Warm header -->
    <div style="background: linear-gradient(135deg, #2d0a1f 0%, #4a1232 50%, #3b0f28 100%); border-bottom: 1px solid rgba(244,197,173,0.12); position: relative; overflow: hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(244,197,173,0.05);"></div>
      <div class="container-custom relative z-10 py-10">
        <p class="text-rose-300/70 text-xs font-bold uppercase tracking-[0.2em] mb-3">My Account</p>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-serif text-3xl font-bold text-white">My Orders</h1>
            <p class="text-rose-200/60 mt-1.5 text-sm">{{ orders.length }} orders total</p>
          </div>
          <button @click="downloadPDF" class="inline-flex items-center gap-2 border border-rose-300/30 text-rose-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-white/10" style="background: rgba(255,255,255,0.06);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Loading skeletons -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="rounded-2xl h-32 animate-pulse" style="background: #f5ede8;"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="orders.length === 0" class="bg-white rounded-2xl py-20 text-center" style="border: 1px solid #ede9e3;">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
        <h3 class="font-bold text-gray-700 mb-2">No orders yet</h3>
        <p class="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
        <router-link to="/products" class="btn-primary">Browse Products</router-link>
      </div>

      <!-- Order list -->
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-2xl hover:shadow-md transition-all duration-200 overflow-hidden" style="border: 1px solid #ede9e3;">
          <!-- Order header -->
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#ede9e3]">
            <div class="flex items-center gap-6">
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Order ID</p>
                <p class="font-mono font-bold text-primary-700 text-sm">#{{ String(order.id).slice(0,8).toUpperCase() }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Date</p>
                <p class="text-sm font-medium text-gray-700">{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span :class="statusBadge(order.status)">{{ order.status }}</span>
              <span class="text-xs text-gray-400 capitalize">via {{ order.payment_method }}</span>
            </div>
          </div>

          <!-- Order body -->
          <div class="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <!-- Product thumbnails -->
            <div class="flex-1">
              <div class="flex items-center gap-3 flex-wrap">
                <div v-for="item in order.OrderItems.slice(0, 3)" :key="item.id" class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img v-if="item.Product?.image_url" :src="item.Product.image_url" class="w-full h-full object-cover" @error="e => e.target.src='/placeholder.jpg'" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                  </div>
                  <div class="hidden sm:block">
                    <p class="text-xs font-medium text-gray-800 max-w-[100px] truncate">{{ item.Product?.name }}</p>
                    <p class="text-xs text-gray-500">×{{ item.quantity }}</p>
                  </div>
                </div>
                <span v-if="order.OrderItems.length > 3" class="text-xs text-primary-600 font-semibold">
                  +{{ order.OrderItems.length - 3 }} more
                </span>
              </div>
            </div>

            <!-- Total + CTA -->
            <div class="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
              <div class="text-right">
                <p class="text-xs text-gray-400">Total</p>
                <p class="text-lg font-black text-gray-900">KES {{ formatPrice(order.total_amount) }}</p>
              </div>
              <router-link :to="`/orders/${order.id}`" class="btn-outline text-sm px-4 py-2 whitespace-nowrap">
                View Details →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { formatPrice, formatDate } from '@/utils/formatters'

const orders = ref([])
const loading = ref(true)

const statusBadge = (status) => {
  const map = {
    pending:    'badge-pending',
    paid:       'badge-paid',
    processing: 'badge-processing',
    dispatched: 'badge-dispatched',
    delivered:  'badge-delivered',
    cancelled:  'badge-cancelled',
  }
  return map[status] || 'badge-pending'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/orders')
    orders.value = data
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
})

const downloadPDF = async () => {
  const res = await api.get('/orders/export/pdf', { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `orders_${Date.now()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
