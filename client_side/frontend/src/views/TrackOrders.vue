<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">How to Track Your Orders</h1>
      <p class="text-purple-100 max-w-lg mx-auto">Real-time order tracking from payment confirmation to your door — here's exactly how it works.</p>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <!-- CMS content -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl p-8 animate-pulse"><div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div><div class="space-y-2"><div class="h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-5/6"></div></div></div>
      </div>

      <div v-else-if="cmsContent.length > 0" class="space-y-6">
        <div v-for="section in cmsContent" :key="section.id" class="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ section.title }}</h2>
          <div class="text-gray-600 text-sm leading-relaxed" v-html="section.body"></div>
        </div>
      </div>

      <!-- Default guide -->
      <template v-else>
        <!-- Order lifecycle -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Order Lifecycle</h2>
          <div class="space-y-6">
            <div v-for="stage in stages" :key="stage.status" class="flex items-start gap-5">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', stage.color]">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stage.icon"/>
                </svg>
              </div>
              <div class="flex-1 pb-6 border-b border-gray-50 last:border-0">
                <p class="font-bold text-gray-800 capitalize">{{ stage.status }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ stage.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- How to track -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Tracking Your Order</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-5 bg-purple-50 rounded-xl border border-purple-100">
              <p class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Via Your Account
              </p>
              <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Log in to BestLady</li>
                <li>Click <strong>Orders</strong> in your dashboard</li>
                <li>Select any order for full status</li>
                <li>View live progress bar & timestamps</li>
              </ol>
            </div>
            <div class="p-5 bg-green-50 rounded-xl border border-green-100">
              <p class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                Via QR Code
              </p>
              <p class="text-sm text-gray-600">Each order has a unique QR code. Scan it with any camera app to open the order detail and payment page — no login required.</p>
            </div>
          </div>
        </div>

        <!-- Pickup verification -->
        <div class="bg-white rounded-2xl shadow-sm border border-[#ede9e3] p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Pickup Verification OTP</h2>
          <p class="text-sm text-gray-600 mb-4">For pickup orders, you'll receive a unique OTP (one-time password) and a QR code in your order details page.</p>
          <div class="rounded-xl p-5 border border-[#ede9e3]">
            <p class="text-sm font-semibold text-gray-700 mb-2">At the pickup station:</p>
            <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Show the QR code or OTP to the staff member</li>
              <li>Staff scans/enters the code to verify your identity</li>
              <li>Order is released to you and marked as Delivered</li>
            </ol>
          </div>
        </div>
      </template>

      <!-- Quick links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link to="/orders" class="bg-purple-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-purple-700 transition group">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <p class="font-bold">View My Orders</p>
            <p class="text-xs text-white/70">See all past & current orders</p>
          </div>
        </router-link>
        <router-link to="/contact" class="bg-white border border-[#ede9e3] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <p class="font-bold text-gray-800">Contact Support</p>
            <p class="text-xs text-gray-500">Can't find your order?</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const cmsContent = ref([])
const loading = ref(true)

const stages = [
  { status: 'Pending',    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                        color: 'bg-amber-500',  description: 'Order placed but payment not yet confirmed.' },
  { status: 'Paid',       icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',                                                                           color: 'bg-green-500',  description: 'Payment confirmed. Our team is preparing your items.' },
  { status: 'Processing', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',                                                                                                   color: 'bg-blue-500',   description: 'Items picked, packed, and being prepared for dispatch.' },
  { status: 'Dispatched', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0', color: 'bg-purple-500',  description: 'Order is on its way to your address or pickup station.' },
  { status: 'Delivered',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                      color: 'bg-teal-500',   description: "Order received! Don't forget to leave a review." }
]

onMounted(async () => {
  try {
    const { data } = await api.get('/content/track_orders')
    cmsContent.value = data
  } catch { /* use defaults */ } finally { loading.value = false }
})
</script>
