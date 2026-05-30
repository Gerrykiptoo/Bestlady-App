<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">Shipping Information</h1>
      <p class="text-purple-100 max-w-lg mx-auto">Everything you need to know about how we deliver your beauty products.</p>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <!-- CMS content -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-8 animate-pulse"><div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div><div class="space-y-2"><div class="h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-5/6"></div></div></div>
      </div>

      <div v-else-if="cmsContent.length > 0" class="space-y-6">
        <div v-for="section in cmsContent" :key="section.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ section.title }}</h2>
          <div class="text-gray-600 text-sm leading-relaxed" v-html="section.body"></div>
        </div>
      </div>

      <!-- Default content -->
      <template v-else>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
            </span>
            Delivery Options
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-gray-100 rounded-xl p-5">
              <p class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Pickup (FREE)
              </p>
              <p class="text-sm text-gray-600">Collect your order from any of our pickup stations. Orders are ready within 4 business hours. Available in Nairobi, Mombasa, Kisumu, and Nakuru.</p>
            </div>
            <div class="border border-gray-100 rounded-xl p-5">
              <p class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Home Delivery — KES 250
              </p>
              <p class="text-sm text-gray-600">We deliver to your doorstep using trusted private riders. Nairobi same-day or next-day. Upcountry within 2–5 business days.</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Delivery Timelines</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-xs text-gray-500 uppercase font-semibold border-b border-gray-100"><th class="pb-3 pr-6">Region</th><th class="pb-3 pr-6">Standard</th><th class="pb-3">Express</th></tr></thead>
              <tbody class="divide-y divide-gray-50 text-gray-700">
                <tr><td class="py-3 pr-6 font-medium">Nairobi CBD</td><td class="py-3 pr-6">Same day</td><td class="py-3">4 hours (+KES 150)</td></tr>
                <tr><td class="py-3 pr-6 font-medium">Nairobi Suburbs</td><td class="py-3 pr-6">Next day</td><td class="py-3">Same day (+KES 100)</td></tr>
                <tr><td class="py-3 pr-6 font-medium">Mombasa / Kisumu</td><td class="py-3 pr-6">2 days</td><td class="py-3">Next day (+KES 200)</td></tr>
                <tr><td class="py-3 pr-6 font-medium">Other Counties</td><td class="py-3 pr-6">3–5 days</td><td class="py-3">2–3 days (+KES 200)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Order Tracking</h2>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">You can track your order in real time from your BestLady account:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Log in to your account</li>
            <li>Go to Orders from your dashboard</li>
            <li>Click on your order to view the live status</li>
            <li>You'll also receive WhatsApp/SMS updates at each stage</li>
          </ol>
          <div class="mt-4"><router-link to="/track-orders" class="text-purple-600 font-semibold hover:underline text-sm">Learn more about order tracking →</router-link></div>
        </div>
      </template>

      <!-- Contact CTA -->
      <div class="bg-purple-50 rounded-2xl border border-purple-100 p-6 flex items-center gap-4">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800">Questions about your delivery?</p>
          <router-link to="/contact" class="text-purple-600 text-sm hover:underline font-medium">Contact our logistics team →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const cmsContent = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/content/shipping_info')
    cmsContent.value = data
  } catch { /* use defaults */ } finally { loading.value = false }
})
</script>
