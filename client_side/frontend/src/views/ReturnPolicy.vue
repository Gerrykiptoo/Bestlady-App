<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">Return & Refund Policy</h1>
      <p class="text-purple-100 max-w-lg mx-auto">We want you to be completely satisfied. Here's how returns and refunds work at BestLady.</p>
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

      <!-- Default policy -->
      <template v-else>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Our Returns Commitment</h2>
          <p class="text-gray-600 text-sm leading-relaxed mb-4">If you're not satisfied with your order, we'll make it right. You may return eligible products within <strong>7 days</strong> of delivery for a full refund or exchange, subject to the conditions below.</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="text-center p-4 bg-green-50 rounded-xl">
              <p class="text-2xl font-black text-green-600 mb-1">7 days</p>
              <p class="text-xs text-gray-500">Return window from delivery</p>
            </div>
            <div class="text-center p-4 bg-blue-50 rounded-xl">
              <p class="text-2xl font-black text-blue-600 mb-1">100%</p>
              <p class="text-xs text-gray-500">Refund for eligible items</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <p class="text-2xl font-black text-purple-600 mb-1">24h</p>
              <p class="text-xs text-gray-500">Refund processing time</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Eligible Return Conditions</h2>
          <ul class="space-y-3 text-sm text-gray-600">
            <li class="flex items-start gap-3"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Product arrived damaged, defective, or incorrect</li>
            <li class="flex items-start gap-3"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Product is unopened and in original packaging</li>
            <li class="flex items-start gap-3"><svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Return request submitted within 7 days of delivery</li>
          </ul>
          <div class="mt-5 pt-5 border-t border-gray-100">
            <p class="text-sm font-semibold text-gray-700 mb-3">Non-returnable items:</p>
            <ul class="space-y-2 text-sm text-gray-500">
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>Opened or used beauty products (health & hygiene reasons)</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>Items not purchased through BestLady</li>
              <li class="flex items-center gap-2"><svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>Items returned after 7 days</li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">How to Request a Return</h2>
          <ol class="space-y-4 text-sm text-gray-600">
            <li class="flex items-start gap-4"><span class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">1</span><p><strong>Contact us</strong> via email (support@bestlady.co.ke) or WhatsApp with your order number and the reason for return. Include photos if the product is damaged.</p></li>
            <li class="flex items-start gap-4"><span class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">2</span><p><strong>Approval</strong> — our team reviews your request within 1 business day and sends return instructions.</p></li>
            <li class="flex items-start gap-4"><span class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">3</span><p><strong>Ship back or drop off</strong> at a BestLady pickup station using the return label we provide.</p></li>
            <li class="flex items-start gap-4"><span class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">4</span><p><strong>Refund</strong> — once received and inspected, your refund is credited to your BestLady Wallet or original M-Pesa number within 24 hours.</p></li>
          </ol>
        </div>
      </template>

      <div class="bg-purple-50 rounded-2xl border border-purple-100 p-6 flex items-center gap-4">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <p class="font-semibold text-gray-800">Need to start a return?</p>
          <router-link to="/contact" class="text-purple-600 text-sm hover:underline font-medium">Contact our support team →</router-link>
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
    const { data } = await api.get('/content/return_policy')
    cmsContent.value = data
  } catch { /* use defaults */ } finally { loading.value = false }
})
</script>
