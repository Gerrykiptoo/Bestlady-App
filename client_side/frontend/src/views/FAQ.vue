<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">Frequently Asked Questions</h1>
      <p class="text-purple-100 max-w-lg mx-auto">Everything you need to know about BestLady — ordering, payment, delivery, and more.</p>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-16">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-6 animate-pulse"><div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div><div class="h-3 bg-gray-200 rounded"></div></div>
      </div>

      <!-- Dynamic FAQs from CMS -->
      <div v-else-if="faqs.length > 0" class="space-y-3 mb-12">
        <div v-for="faq in faqs" :key="faq.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button @click="openFaq = openFaq === faq.id ? null : faq.id"
            class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">{{ faq.title }}</span>
            <svg :class="['w-5 h-5 text-gray-400 flex-shrink-0 transition-transform', openFaq === faq.id ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div v-if="openFaq === faq.id" class="px-6 pb-5">
            <div class="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4" v-html="faq.body"></div>
          </div>
        </div>
      </div>

      <!-- Default FAQs when none from CMS -->
      <div v-else class="space-y-3 mb-12">
        <div v-for="faq in defaultFaqs" :key="faq.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button @click="openFaq = openFaq === faq.id ? null : faq.id"
            class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">{{ faq.q }}</span>
            <svg :class="['w-5 h-5 text-gray-400 flex-shrink-0 transition-transform', openFaq === faq.id ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div v-if="openFaq === faq.id" class="px-6 pb-5">
            <p class="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{{ faq.a }}</p>
          </div>
        </div>
      </div>

      <!-- Still need help? -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-8 text-center">
        <h3 class="font-bold text-xl text-gray-800 mb-2">Still have questions?</h3>
        <p class="text-gray-500 text-sm mb-5">Our support team is happy to help with any issue.</p>
        <router-link to="/contact" class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition">
          Contact Support
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const openFaq = ref(null)
const faqs = ref([])
const loading = ref(true)

const defaultFaqs = [
  { id: 1, q: 'How do I place an order on BestLady?', a: 'Browse our product catalog, add items to your cart, then proceed to checkout. You can pay via M-Pesa STK push or your BestLady Wallet. You\'ll get a confirmation email with your order number.' },
  { id: 2, q: 'What payment methods are accepted?', a: 'We accept M-Pesa (STK push to your phone), BestLady Wallet (top up via M-Pesa), and credit purchase for verified wholesale customers with an approved credit limit.' },
  { id: 3, q: 'How long does delivery take?', a: 'Nairobi deliveries typically arrive within 1–2 business days. Upcountry deliveries take 2–5 business days depending on location. Pickup orders are ready within 4 hours during business hours.' },
  { id: 4, q: 'Can I cancel or return an order?', a: 'Orders in "Pending" or "Paid" status can be cancelled directly from your Order Details page. For returns, contact our support team within 7 days of delivery with your order number and reason.' },
  { id: 5, q: 'What is the AI Optimizer?', a: 'The AI Optimizer analyzes your past order history to recommend the optimal products and quantities for your next bulk order. It also applies loyalty discounts based on your tier (Bronze to Platinum).' },
  { id: 6, q: 'How do loyalty tiers work?', a: 'Complete 3+ orders to reach Bronze (5% discount), 10+ for Silver (8%), 25+ for Gold (12%), and 50+ for Platinum (15%). Discounts are applied automatically to AI-optimized bulk orders.' },
  { id: 7, q: 'How do I top up my BestLady Wallet?', a: 'Go to Dashboard → Wallet → Top Up. Enter the amount and your M-Pesa number. You\'ll receive an STK push prompt on your phone. Confirm with your PIN and the funds appear instantly.' },
  { id: 8, q: 'Is my payment information secure?', a: 'Yes. BestLady never stores your M-Pesa PIN. All payments are processed directly through Safaricom\'s Daraja API. Your financial data is encrypted in transit and at rest.' }
]

onMounted(async () => {
  try {
    const { data } = await api.get('/content/faq')
    faqs.value = data
  } catch { /* use defaults */ } finally { loading.value = false }
})
</script>
