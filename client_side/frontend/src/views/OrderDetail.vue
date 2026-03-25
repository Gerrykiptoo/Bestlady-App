<template>
  <div class="container-custom py-8" v-if="order">
    <h1 class="text-3xl font-bold mb-8">Order Details</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Status -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Order Status</h2>
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="step" class="flex-1 text-center">
              <div :class="[
                'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center',
                order.status === step ? 'bg-primary-600 text-white' : 
                isStepCompleted(step) ? 'bg-green-500 text-white' : 'bg-gray-200'
              ]">
                <span v-if="isStepCompleted(step)">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-xs capitalize">{{ step }}</span>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Order Items</h2>
          <div v-for="item in order.OrderItems" :key="item.id" class="flex gap-4 border-b py-4 last:border-0">
            <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
              <img v-if="item.Product?.image_url" :src="item.Product.image_url" class="w-full h-full object-cover rounded" />
              <span v-else>📦</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.Product?.name }}</h3>
              <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
              <p class="text-primary-600">KES {{ formatPrice(item.unit_price) }} each</p>
            </div>
            <div class="text-right">
              <p class="font-bold">KES {{ formatPrice(item.subtotal) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>KES {{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax (16%)</span>
              <span>KES {{ formatPrice(order.tax) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery</span>
              <span>KES {{ formatPrice(order.delivery_fee) }}</span>
            </div>
            <div class="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span class="text-primary-600">KES {{ formatPrice(order.total_amount) }}</span>
            </div>
          </div>
        </div>
        
        <!-- QR Code for Pickup -->
        <div v-if="order.qr_code" class="bg-white p-6 rounded-lg shadow text-center">
          <h2 class="text-xl font-semibold mb-4">Pickup Verification</h2>
          <img :src="order.qr_code" class="w-48 h-48 mx-auto mb-4" />
          <p class="text-sm text-gray-500 mb-2">Show this QR code at pickup</p>
          <p class="text-lg font-bold">OTP: {{ order.otp_code }}</p>
        </div>
        
        <!-- Download Receipt Button -->
        <button @click="downloadReceipt" class="btn-primary w-full">
          Download Receipt (PDF)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const toast = useToast()
const order = ref(null)

const steps = ['pending', 'paid', 'processing', 'dispatched', 'delivered']

const isStepCompleted = (step) => {
  const currentIndex = steps.indexOf(order.value?.status)
  const stepIndex = steps.indexOf(step)
  return stepIndex < currentIndex
}

const downloadReceipt = async () => {
  try {
    const response = await api.get(`/orders/${route.params.id}/receipt`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `receipt-${order.value.order_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    toast.error('Failed to download receipt')
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/orders/${route.params.id}`)
    order.value = data
  } catch (error) {
    console.error('Failed to load order:', error)
    toast.error('Order not found')
  }
})
</script>
