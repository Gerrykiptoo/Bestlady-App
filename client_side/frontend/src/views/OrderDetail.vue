<template>
  <div class="min-h-screen" style="background: #faf9f7;">

    <!-- Warm order header -->
    <div style="background: linear-gradient(135deg, #2d0a1f 0%, #4a1232 50%, #3b0f28 100%); border-bottom: 1px solid rgba(244,197,173,0.12); position: relative; overflow: hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(244,197,173,0.05);"></div>
      <div class="container-custom relative z-10 py-10">
        <p class="text-rose-300/70 text-xs font-bold uppercase tracking-[0.2em] mb-3">Order Receipt</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="font-serif text-3xl font-bold text-white">
              Order #{{ order?.order_number || '—' }}
            </h1>
            <p class="text-rose-200/60 mt-1.5 text-sm">
              Placed {{ order ? formatDateTime(order.createdAt) : '…' }}
            </p>
          </div>
          <router-link to="/orders" class="inline-flex items-center gap-2 border border-rose-300/30 text-rose-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-white/10" style="background: rgba(255,255,255,0.06);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            My Orders
          </router-link>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl p-6 space-y-3" style="border: 1px solid #ede9e3;">
            <div class="h-5 rounded w-1/3" style="background: #ede9e3;"></div>
            <div class="flex gap-2">
              <div v-for="i in 5" :key="i" class="flex-1 h-16 rounded-xl" style="background: #ede9e3;"></div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-6 space-y-4" style="border: 1px solid #ede9e3;">
            <div class="h-5 rounded w-1/4" style="background: #ede9e3;"></div>
            <div v-for="i in 3" :key="i" class="flex gap-4">
              <div class="w-16 h-16 rounded-xl flex-shrink-0" style="background: #ede9e3;"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 rounded w-2/3" style="background: #ede9e3;"></div>
                <div class="h-3 rounded w-1/3" style="background: #ede9e3;"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-5">
          <div class="bg-white rounded-2xl p-6 space-y-3" style="border: 1px solid #ede9e3;">
            <div class="h-5 rounded w-1/2" style="background: #ede9e3;"></div>
            <div v-for="i in 4" :key="i" class="flex justify-between">
              <div class="h-3 rounded w-1/3" style="background: #ede9e3;"></div>
              <div class="h-3 rounded w-1/4" style="background: #ede9e3;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="!order" class="py-24 text-center">
        <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-slate-700 mb-2">Order Not Found</h2>
        <p class="text-slate-400 text-sm mb-6">This order doesn't exist or you don't have access to it.</p>
        <router-link to="/orders" class="btn-primary">Back to Orders</router-link>
      </div>

      <!-- Main content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Status tracker -->
          <div class="bg-white rounded-2xl p-6" style="border: 1px solid #ede9e3;">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-serif font-bold text-slate-800">Order Status</h2>
              <span :class="statusClass(order.status)" class="text-[11px] font-black uppercase px-3 py-1 rounded-full">{{ order.status }}</span>
            </div>
            <div class="relative">
              <!-- Progress line -->
              <div class="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 mx-8"></div>
              <div class="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-[#7e22ce] to-[#db2777] mx-8 transition-all duration-700"
                :style="{ width: progressWidth }"></div>
              <!-- Steps -->
              <div class="relative flex justify-between">
                <div v-for="(step, idx) in steps" :key="step" class="flex flex-col items-center gap-2">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2',
                    isStepCompleted(step) ? 'bg-purple-600 border-purple-600 text-white' :
                    order.status === step ? 'bg-white border-purple-600 text-purple-600 shadow-md shadow-purple-100' :
                    'bg-white border-slate-200 text-slate-300'
                  ]">
                    <svg v-if="isStepCompleted(step)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    <span v-else class="text-xs font-bold">{{ idx + 1 }}</span>
                  </div>
                  <span class="text-[10px] font-semibold capitalize text-center"
                    :class="order.status === step ? 'text-purple-700' : isStepCompleted(step) ? 'text-slate-600' : 'text-slate-400'">
                    {{ step }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order items -->
          <div class="bg-white rounded-2xl overflow-hidden" style="border: 1px solid #ede9e3;">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 class="font-serif font-bold text-slate-800">Order Items</h2>
              <span class="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{{ order.OrderItems?.length || 0 }} items</span>
            </div>
            <div class="divide-y divide-slate-50">
              <div v-for="item in order.OrderItems" :key="item.id" class="flex gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style="background: #ede9e3;">
                  <img v-if="item.Product?.image_url" :src="item.Product.image_url" class="w-full h-full object-cover"
                    @error="e => e.target.style.display='none'" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-800 truncate">{{ item.Product?.name || 'Product' }}</p>
                  <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p v-if="item.discount_percent > 0 && item.original_price" class="text-xs text-slate-400 line-through">
                      KES {{ formatPrice(item.original_price) }}
                    </p>
                    <p class="text-xs font-semibold" :class="item.discount_percent > 0 ? 'text-purple-700' : 'text-slate-400'">
                      KES {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
                    </p>
                    <span v-if="item.discount_percent > 0" class="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      −{{ item.discount_percent }}% AI
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-black text-slate-900">KES {{ formatPrice(item.subtotal) }}</p>
                  <p v-if="item.discount_percent > 0 && item.original_price" class="text-[10px] text-green-600 font-semibold mt-0.5">
                    saved KES {{ formatPrice((parseFloat(item.original_price) - parseFloat(item.unit_price)) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment section for pending orders -->
          <div v-if="order.status === 'pending'" class="bg-white rounded-2xl overflow-hidden border-l-4 border-orange-400" style="border-top: 1px solid #ede9e3; border-right: 1px solid #ede9e3; border-bottom: 1px solid #ede9e3;">
            <div class="px-6 py-4 border-b border-orange-50 bg-orange-50 flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="font-bold text-orange-800">Payment Required</h3>
            </div>
            <div class="p-6 space-y-4">
              <div v-if="order.payment_method === 'mpesa'">
                <label class="block text-sm font-semibold text-slate-700 mb-2">M-Pesa Number</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">+254</span>
                  <input v-model="payPhoneNumber" type="tel" inputmode="tel" placeholder="712345678"
                    class="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition text-sm" />
                </div>
                <p class="text-xs text-slate-400 mt-1.5">Enter 9-digit number (e.g., 712345678)</p>
              </div>

              <button @click="handlePayment" :disabled="payLoading"
                class="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                <svg v-if="payLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                {{ payLoading ? 'Processing…' : order.payment_method === 'mpesa' ? 'Send M-Pesa STK Push' : 'Pay via Wallet' }}
              </button>

              <div v-if="isPolling" class="bg-orange-50 rounded-xl p-4 text-center">
                <p class="text-sm text-orange-700 font-semibold animate-pulse mb-2">Waiting for payment confirmation…</p>
                <p class="text-xs text-orange-500">Check your phone and enter your M-Pesa PIN</p>
                <div class="w-full bg-orange-100 rounded-full h-1.5 mt-3">
                  <div class="bg-orange-500 h-1.5 rounded-full animate-pulse" style="width: 60%"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT sidebar -->
        <div class="space-y-5">

          <!-- Order summary -->
          <div class="bg-white rounded-2xl overflow-hidden" style="border: 1px solid #ede9e3;">
            <div class="px-5 py-4 border-b border-slate-100">
              <h2 class="font-serif font-bold text-slate-800">Order Summary</h2>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span class="font-medium text-slate-800">KES {{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-slate-600">
                <span>Tax (16%)</span>
                <span class="font-medium text-slate-800">KES {{ formatPrice(order.tax) }}</span>
              </div>
              <div class="flex justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span class="font-medium text-slate-800">{{ parseFloat(order.delivery_fee) > 0 ? 'KES ' + formatPrice(order.delivery_fee) : 'FREE' }}</span>
              </div>

              <!-- AI Optimizer savings line -->
              <div v-if="totalAISavings > 0" class="flex justify-between text-sm bg-green-50 -mx-5 px-5 py-2 rounded-lg">
                <span class="text-green-700 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  AI Savings
                </span>
                <span class="text-green-700 font-bold">− KES {{ formatPrice(totalAISavings) }}</span>
              </div>

              <div class="border-t border-slate-100 pt-3 flex justify-between">
                <span class="font-black text-slate-900">Total</span>
                <span class="font-black text-purple-700 text-lg">KES {{ formatPrice(order.total_amount) }}</span>
              </div>
            </div>

            <!-- AI savings callout banner -->
            <div v-if="totalAISavings > 0" class="mx-5 mb-4 rounded-xl p-3 border-l-4 border-purple-500" style="background: #faf5ff;">
              <p class="text-xs font-bold text-purple-700">You saved KES {{ formatPrice(totalAISavings) }} on this order via AI Optimizer discounts</p>
            </div>
            <!-- Payment / delivery info -->
            <div class="px-5 pb-5 space-y-2">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                <span class="capitalize">{{ order.payment_method || 'N/A' }} &nbsp;·&nbsp;
                  <span :class="order.payment_status === 'completed' ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'">
                    {{ order.payment_status === 'completed' ? 'Paid' : 'Unpaid' }}
                  </span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span class="capitalize">{{ order.delivery_channel || 'Standard delivery' }}</span>
              </div>
            </div>
          </div>

          <!-- QR Codes -->
          <div v-if="order.payment_qr && order.payment_status !== 'completed'" class="bg-white rounded-2xl overflow-hidden" style="border: 1px solid #ede9e3;">
            <div class="p-1" style="background: var(--brand-gradient)">
              <div class="bg-white rounded-xl p-5 text-center">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Scan to Pay</p>
                <img :src="order.payment_qr" class="w-40 h-40 mx-auto mb-2" />
                <p class="text-lg font-black text-slate-900">KES {{ formatPrice(order.total_amount) }}</p>
                <p class="text-xs text-slate-400 mt-1">Scan with your camera to open the payment page</p>
              </div>
            </div>
          </div>

          <div v-if="order.qr_code" class="bg-white rounded-2xl p-5 text-center" style="border: 1px solid #ede9e3;">
            <p class="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Pickup / Delivery Code</p>
            <img :src="order.qr_code" class="w-36 h-36 mx-auto mb-3 opacity-90" />
            <p class="text-xs text-slate-400 mb-2">Show this to the delivery agent or at pickup</p>
            <p class="text-sm font-black text-slate-800 rounded-lg px-3 py-1.5 inline-block tracking-wider" style="background: #ede9e3;">OTP: {{ order.otp_code }}</p>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <button @click="downloadReceipt"
              class="w-full flex items-center justify-center gap-2 py-3 font-bold text-white rounded-xl transition hover:opacity-90"
              style="background: var(--brand-gradient)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Download Receipt (PDF)
            </button>

            <button v-if="['pending', 'paid'].includes(order.status)" @click="handleCancel" :disabled="cancelLoading"
              class="w-full flex items-center justify-center gap-2 py-3 font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition disabled:opacity-50">
              <svg v-if="cancelLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ cancelLoading ? 'Cancelling…' : 'Cancel Order' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice, formatDateTime } from '@/utils/formatters'
import { getSocket } from '@/services/socket'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const order = ref(null)
const loading = ref(true)
const payPhoneNumber = ref('')
const payLoading = ref(false)
const cancelLoading = ref(false)
const isPolling = ref(false)
let pollTimer = null

const steps = ['pending', 'paid', 'processing', 'dispatched', 'delivered']

const progressWidth = computed(() => {
  const idx = steps.indexOf(order.value?.status)
  if (idx <= 0) return '0%'
  return `${(idx / (steps.length - 1)) * 100}%`
})

// Sum up AI optimizer savings from discount_percent fields
const totalAISavings = computed(() => {
  if (!order.value?.OrderItems) return 0
  return order.value.OrderItems.reduce((sum, item) => {
    if (item.discount_percent > 0 && item.original_price) {
      return sum + (parseFloat(item.original_price) - parseFloat(item.unit_price)) * item.quantity
    }
    return sum
  }, 0)
})

const statusClass = (status) => {
  const map = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    ready: 'bg-teal-100 text-teal-700',
    dispatched: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const isStepCompleted = (step) => {
  const currentIndex = steps.indexOf(order.value?.status)
  const stepIndex = steps.indexOf(step)
  return stepIndex < currentIndex
}

const handlePayment = async () => {
  if (order.value.payment_method === 'mpesa' && !payPhoneNumber.value) {
    return toast.error('Please enter your M-Pesa phone number')
  }
  payLoading.value = true
  try {
    if (order.value.payment_method === 'mpesa') {
      await api.post('/payment/stkpush', {
        orderId: order.value.id,
        amount: order.value.total_amount,
        phone: payPhoneNumber.value
      })
      toast.success('STK Push initiated! Check your phone.')
      startPolling()
    } else {
      await api.post(`/orders/${order.value.id}/pay`)
      toast.success('Payment successful!')
      refreshBalance()
      const { data } = await api.get(`/orders/${route.params.id}`)
      order.value = data
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Payment failed')
  } finally {
    payLoading.value = false
  }
}

const isStepCompletedCheck = (step) => {
  const currentIndex = steps.indexOf(order.value?.status)
  const stepIndex = steps.indexOf(step)
  return stepIndex < currentIndex
}

const downloadReceipt = async () => {
  try {
    const response = await api.get(`/orders/${route.params.id}/receipt`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `receipt-${order.value.order_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch {
    toast.error('Failed to download receipt')
  }
}

const handleCancel = async () => {
  if (!confirm('Are you sure you want to cancel this order?')) return
  cancelLoading.value = true
  try {
    await api.post(`/orders/${route.params.id}/cancel`)
    toast.success('Order cancelled successfully')
    await fetchOrder()
    if (order.value.payment_method === 'wallet' && order.value.payment_status === 'completed') {
      refreshBalance()
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to cancel order')
  } finally {
    cancelLoading.value = false
  }
}

const fetchOrder = async () => {
  const { data } = await api.get(`/orders/${route.params.id}`)
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
        toast.success('Payment confirmed!')
        refreshBalance()
      }
    } catch {}
  }, 5000)
}

const refreshBalance = async () => {
  try {
    const { data } = await api.get('/wallet/balance')
    auth.updateUser({ wallet_balance: data.balance })
  } catch {}
}

onMounted(async () => {
  try {
    await fetchOrder()
    if (order.value?.payment_status === 'processing') startPolling()

    const socket = getSocket()
    if (socket) {
      socket.on('orderUpdate', async (data) => {
        if (String(data.orderId) === String(route.params.id)) {
          // Re-fetch full order so all fields (payment_status, items, etc.) are fresh
          await fetchOrder()
          if (data.message) toast.info(data.message)
          if (['paid', 'processing', 'dispatched', 'delivered'].includes(data.status)) {
            isPolling.value = false
            if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
            if (data.status === 'paid') refreshBalance()
          }
        }
      })
    }
  } catch {
    toast.error('Order not found')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  const socket = getSocket()
  if (socket) socket.off('orderUpdate')
})
</script>
