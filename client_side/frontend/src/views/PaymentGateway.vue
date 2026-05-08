<template>
  <div class="container-custom py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold mb-4">Payment Gateway</h1>

      <div v-if="loading" class="text-center py-8">Loading order...</div>
      <div v-else-if="error" class="text-red-600 py-4">{{ error }}</div>

      <div v-else-if="order">
        <div class="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <p class="text-sm text-gray-500 font-medium">Order #{{ order.order_number }}</p>
            <p class="text-xs text-gray-400">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
          <div class="text-right">
            <span :class="[
              'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            ]">
              {{ order.payment_status }}
            </span>
          </div>
        </div>

        <!-- Itemized Details -->
        <div class="space-y-3 mb-6">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-tight">Itemized Receipt</h2>
          <div v-for="item in order.OrderItems" :key="item.id" class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">{{ item.Product?.name || 'Beauty Product' }}</p>
              <p class="text-xs text-gray-500">Qty: {{ item.quantity }} × KES {{ formatPrice(item.unit_price) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-primary">KES {{ formatPrice(item.subtotal) }}</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 border border-gray-100">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-medium">KES {{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Tax</span>
            <span class="font-medium">KES {{ formatPrice(order.tax) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Delivery Fee</span>
            <span class="font-medium">KES {{ formatPrice(order.delivery_fee) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-gray-200 mt-2">
            <span class="font-bold text-gray-800">Grand Total</span>
            <span class="font-black text-primary text-xl">KES {{ formatPrice(order.total_amount) }}</span>
          </div>
        </div>

        <div class="bg-primary/5 rounded-xl p-6 border-2 border-primary/10">
          <label class="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">M-Pesa Payment</label>
          <div class="relative">
            <input
              v-model="phone"
              type="tel"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 transition-all mb-4 text-lg font-bold text-gray-700"
              placeholder="07XXXXXXXX"
            />
          </div>
          
          <button
            class="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:opacity-90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01]"
            :disabled="paying || isPolling"
            @click="payNow"
          >
            {{ paying ? 'Processing...' : isPolling ? 'Verifying...' : 'Pay with M-Pesa' }}
          </button>
        </div>

        <!-- Polling Status -->
        <div v-if="isPolling" class="mt-6 text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
          <p class="text-sm text-orange-600 animate-pulse font-medium">
            ⏳ Waiting for M-Pesa confirmation...
          </p>
          <p class="text-xs text-gray-500 mt-1">Please keep this page open</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const order = ref(null)
const loading = ref(true)
const paying = ref(false)
const isPolling = ref(false)
const error = ref('')
const phone = ref('')
let pollTimer = null

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/orders/public/${route.params.id}`)
    order.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to load order for payment'
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  isPolling.value = true
  if (pollTimer) clearInterval(pollTimer)

  pollTimer = setInterval(async () => {
    try {
      const { data } = await api.get(`/orders/public/${route.params.id}`)
      if (data.payment_status === 'completed' || data.status === 'paid') {
        stopPolling()
        toast.success('Payment confirmed!')
        router.push(`/orders/${data.id}`)
      }
    } catch (err) {
      console.error('Polling error:', err)
    }
  }, 5000)
}

const stopPolling = () => {
  isPolling.value = false
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

const payNow = async () => {
  if (!phone.value) {
    toast.error('Please enter phone number')
    return
  }
  paying.value = true
  try {
    await api.post('/payment/stkpush', {
      orderId: order.value.id,
      amount: order.value.total_amount,
      phone: phone.value
    })
    toast.success('STK push sent. Complete payment on your phone.')
    startPolling()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Payment failed')
  } finally {
    paying.value = false
  }
}

onMounted(loadOrder)
onUnmounted(stopPolling)
</script>
