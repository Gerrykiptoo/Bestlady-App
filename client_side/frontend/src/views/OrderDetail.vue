<template>
  <div class="container-custom py-8" v-if="order">
    <!-- Payment Status Toast -->
    <div v-if="showPaymentToast" class="fixed top-4 right-4 z-50 animate-slide-down">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg flex items-center gap-3',
        paymentToastType === 'success' ? 'bg-green-500 text-white' : 
        paymentToastType === 'error' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
      ]">
        <span v-if="paymentToastType === 'success'">✅</span>
        <span v-else-if="paymentToastType === 'error'">❌</span>
        <span v-else>⏳</span>
        <p>{{ paymentToastMessage }}</p>
        <button @click="showPaymentToast = false" class="ml-4 opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>

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
          <h2 class="text-xl font-semibold mb-4">Order Items ({{ order.OrderItems?.length || 0 }})</h2>
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
        <div class="space-y-3">
          <button @click="downloadReceipt" class="btn-primary w-full flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Receipt (PDF)
          </button>

          <!-- Pay Now Section for Pending Orders -->
          <div v-if="order.status === 'pending'" class="bg-orange-50 p-6 rounded-lg border border-orange-200 shadow-sm">
            <h3 class="font-bold text-orange-800 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment Required
            </h3>
            
            <div class="space-y-4">
              <div v-if="order.payment_method === 'mpesa'">
                <label class="block text-sm font-medium text-gray-700 mb-2">M-Pesa Number</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+254</span>
                  <input 
                    v-model="payPhoneNumber" 
                    type="tel" 
                    inputmode="tel"
                    placeholder="712345678" 
                    class="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1">Enter number with 9 digits (e.g., 712345678)</p>
              </div>

              <button 
                @click="handlePayment" 
                :disabled="payLoading"
                class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span v-if="payLoading" class="animate-spin">⌛</span>
                {{ payLoading ? 'Processing...' : (order.payment_method === 'mpesa' ? 'Send STK Push' : 'Pay via Wallet') }}
              </button>

              <!-- Payment Status Polling -->
              <div v-if="isPolling" class="text-center py-2">
                <p class="text-sm text-orange-600 animate-pulse">
                  ⏳ Waiting for payment... Check your phone!
                </p>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div class="bg-orange-500 h-2 rounded-full animate-pulse" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
const payPhoneNumber = ref('')
const payLoading = ref(false)

const steps = ['pending', 'paid', 'processing', 'dispatched', 'delivered']

const handlePayment = async () => {
  if (order.value.payment_method === 'mpesa' && !payPhoneNumber.value) {
    return toast.error('Please enter your M-Pesa phone number')
  }

  payLoading.value = true
  try {
    if (order.value.payment_method === 'mpesa') {
      await api.post(`/payment/stkpush`, {
        orderId: order.value.id,
        amount: order.value.total_amount,
        phone: payPhoneNumber.value
      })
      toast.success('STK Push initiated! Check your phone.')
    } else {
      // Wallet payment logic (assuming there's an endpoint or we call payOrder)
      await api.post(`/orders/${order.value.id}/pay`)
      toast.success('Payment successful!')
      // Refresh order data
      const { data } = await api.get(`/orders/${route.params.id}`)
      order.value = data
    }
  } catch (error) {
    console.error('Payment failed:', error)
    toast.error(error.response?.data?.message || 'Payment failed')
  } finally {
    payLoading.value = false
  }
}

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
