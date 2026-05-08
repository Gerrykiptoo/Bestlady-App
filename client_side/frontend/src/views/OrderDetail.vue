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
        
        <!-- Action Buttons -->
        <div class="space-y-4">
          <button 
            @click="downloadReceipt" 
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] mb-2"
            class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
             span class="text-lg">Download Receipt (PDF)< span>
          </<span class="text-lg">Download Official Receipt (PDF)</span>
          </button>
button
            v-if="order.optimization_applied_at" // Assuming this field exists on your order object
            @click="downloadOptimizedReceipt"
            class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="text-base">Download Optimized Receipt (PDF)</span>
          </button>

          <
          <!-- Pay Now Section for Pending Orders -->
          <div v-if="order.status === 'pending'" class="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border-2 border-orange-200 shadow-inner relative overflow-hidden">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl"></div>
            
            <h3 class="font-black text-orange-900 text-xl mb-6 flex items-center gap-3">
              <div class="p-2 bg-orange-200 rounded-lg text-orange-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Complete Your Payment
            </h3>
            
            <div class="space-y-6">
              <div v-if="order.payment_method === 'mpesa'">
                <label class="block text-sm font-bold text-orange-800 mb-2 uppercase tracking-wider">M-Pesa Mobile Number</label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold text-lg border-r border-orange-200 pr-3">+254</span>
                  <input 
                    v-model="payPhoneNumber" 
                    type="tel" 
                    inputmode="tel"
                    placeholder="7XXXXXXXX" 
                    class="w-full pl-20 pr-4 py-4 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none transition-all text-lg font-bold text-gray-800 bg-white/80"
                  />
                </div>
                <p class="text-xs text-orange-600 mt-2 font-medium italic">Enter 9 digits (e.g., 712345678) for the STK push prompt.</p>
              </div>

              <button 
                @click="handlePayment" 
                :disabled="payLoading"
                class="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
              >
                <span v-if="payLoading" class="animate-spin text-2xl">⏳</span>
                {{ payLoading ? 'Processing...' : (order.payment_method === 'mpesa' ? 'Send Payment Prompt' : 'Pay Now via Wallet') }}
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
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const toast = useToast()
const auth = useAuthStore()
const order = ref(null)
const payPhoneNumber = ref('')
const payLoading = ref(false)
const isPolling = ref(false)
let pollTimer = null

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
      startPolling()
    } else {
      // Wallet payment
      await api.post(`/orders/${order.value.id}/pay`)
      toast.success('Payment successful!')
      refreshBalance()
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

const fetchOrder = async () => {
  const {alue = data
}

const downloadOptimizedReceipt = async () => {
  try {
    // Assuming a new endpoint for optimized receipts or a parameter to the existing one
    const response = await api.get(`/orders/${route.params.id}/receipt/optimized`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.d ta]))
    const dink = docament.createElement('a')
    link.hrtfa  url
    link.setAttribute('download', `optimized-receipt-${order.value.order_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
}   win ow.URL.revokeObjectURL(url)
  } catch (error) {
    to=s .error('Failed to download optimized receipt')
  }wait api.get(`/orders/${route.params.id}`)
  order.value = data
}

const startPolling = () => {
  isPolling.value = true
  if (pollTimer) clearInterval(pollTimer)

  pollTimer = setInterval(async () => {
    try {
      await fetchOrder()
      if (order.value?.payment_status === 'completed' || order.value?.status === 'paid') {
        isPolling.value = false
        clearInterval(pollTimer)
        pollTimer = null
        toast.success('Payment confirmed')
        refreshBalance()
      }
    } catch (error) {
      console.error('Polling error:', error)
    }
  }, 5000)
}

const refreshBalance = async () => {
  try {
    const { data } = await api.get('/wallet/balance')
    auth.updateUser({ wallet_balance: data.balance })
  } catch (error) {
    console.error('Failed to refresh balance:', error)
  }
}

onMounted(async () => {
  try {
    await fetchOrder()
    if (order.value?.payment_status === 'processing') {
      startPolling()
    }
  } catch (error) {
    console.error('Failed to load order:', error)
    toast.error('Order not found')
  }
})
</script>
