<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-8">My Orders</h1>
    
    <div v-if="loading" class="text-center py-12">
      <Loader />
    </div>
    
    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-500">No orders yet.</p>
      <router-link to="/products" class="text-primary-600 mt-4 inline-block">
        Start Shopping →
      </router-link>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="font-semibold">Order #{{ order.order_number }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-semibold',
              order.status === 'paid' || order.status === 'completed' ? 'bg-green-100 text-green-800' : 
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            ]">
              {{ order.status }}
            </span>
          </div>
        </div>
        
        <div class="border-t border-b py-4 mb-4">
          <div v-for="item in order.OrderItems" :key="item.id" class="flex justify-between text-sm mb-2">
            <span>{{ item.Product?.name }} x {{ item.quantity }}</span>
            <span>KES {{ formatPrice(item.subtotal) }}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <div>
            <p class="font-bold">Total: KES {{ formatPrice(order.total_amount) }}</p>
            <p class="text-sm text-gray-500">Payment: {{ order.payment_method }}</p>
          </div>
          <router-link :to="`/orders/${order.id}`" class="text-primary-600 hover:underline">
            View Details →
          </router-link>
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
</script>
