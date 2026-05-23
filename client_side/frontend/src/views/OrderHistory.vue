<template>
  <div class="container-custom py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">My Orders</h1>
      <button @click="downloadPDF" class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition shadow">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Download PDF
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>
    
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500">No orders yet.</p>
      <router-link to="/products" class="text-primary-600 mt-4 inline-block">
        Start Shopping →
      </router-link>
    </div>
    
    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Date</p>
            <p class="font-medium">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Number</p>
            <p class="font-mono text-primary-600 font-bold">#{{ order.order_number }}</p>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Order Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-bold uppercase',
                  order.status === 'paid' || order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-blue-100 text-blue-700'
                ]">
                  {{ order.status }}
                </span>
                <span class="text-xs text-gray-400">•</span>
                <span class="text-xs font-medium text-gray-500 capitalize">{{ order.payment_method }} Payment</span>
              </div>

              <div class="space-y-3">
                <div v-for="item in order.OrderItems.slice(0, 2)" :key="item.id" class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-xs">
                    <img v-if="item.Product?.image_url" :src="item.Product.image_url" class="w-full h-full object-cover rounded" />
                    <span v-else>📦</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 truncate">{{ item.Product?.name }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ item.quantity }} @ KES {{ formatPrice(item.unit_price) }}</p>
                  </div>
                </div>
                <p v-if="order.OrderItems.length > 2" class="text-xs text-primary-600 font-medium">
                  + {{ order.OrderItems.length - 2 }} more items
                </p>
              </div>
            </div>

            <!-- Totals & Action -->
            <div class="md:w-48 flex flex-col justify-between items-end border-l border-gray-100 md:pl-6">
              <div class="text-right w-full">
                <p class="text-xs text-gray-500 mb-1">Total Amount</p>
                <p class="text-xl font-black text-gray-900">KES {{ formatPrice(order.total_amount) }}</p>
              </div>
              
              <router-link 
                :to="`/orders/${order.id}`" 
                class="mt-4 w-full text-center py-2 px-4 bg-white border border-primary-600 text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors"
              >
                View Details
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
import Loader from '@/components/common/Loader.vue'
import { formatPrice, formatDate } from '@/utils/formatters'

const orders = ref([])
const loading = ref(true)

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
  a.download = `order_history_${Date.now()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
