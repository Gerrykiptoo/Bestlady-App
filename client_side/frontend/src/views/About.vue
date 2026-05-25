<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white py-24 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-4">About Us</p>
        <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Beauty that Powers<br />Your Business
        </h1>
        <p class="text-purple-100 text-lg max-w-2xl mx-auto">
          BestLady is Kenya's premier AI-powered beauty supply chain platform, connecting salons, supermarkets, and distributors with premium products and intelligent ordering.
        </p>
      </div>
    </div>

    <!-- Mission, Vision, Values -->
    <div class="max-w-6xl mx-auto px-6 py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div class="text-center p-8 rounded-2xl bg-purple-50 border border-purple-100">
          <div class="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 class="font-black text-xl text-gray-800 mb-3">Our Mission</h3>
          <p class="text-gray-600 text-sm leading-relaxed">To democratize access to premium beauty products by building the smartest, most reliable supply chain platform in Africa.</p>
        </div>
        <div class="text-center p-8 rounded-2xl bg-pink-50 border border-pink-100">
          <div class="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 class="font-black text-xl text-gray-800 mb-3">Our Vision</h3>
          <p class="text-gray-600 text-sm leading-relaxed">To become the backbone of the African beauty industry by 2030 — empowering every salon, every store, and every distributor with technology.</p>
        </div>
        <div class="text-center p-8 rounded-2xl bg-amber-50 border border-amber-100">
          <div class="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 class="font-black text-xl text-gray-800 mb-3">Our Values</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Quality first, customer obsession, radical transparency, and relentless innovation guide every decision we make at BestLady.</p>
        </div>
      </div>

      <!-- Story -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <p class="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
          <h2 class="text-3xl font-black text-gray-800 mb-6">Built for African Beauty Entrepreneurs</h2>
          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p>BestLady was founded in Nairobi by entrepreneurs who saw the same challenge everywhere: beauty shop owners and salon managers spending hours on the phone chasing deliveries, running out of bestsellers, and missing out on bulk deals.</p>
            <p>We built an AI-powered platform that learns your buying patterns, predicts your restocking needs, negotiates the best prices through loyalty tiers, and lets you pay easily via M-Pesa.</p>
            <p>Today, BestLady serves hundreds of retailers, wholesalers, and distributors across Kenya — delivering quality beauty products with speed, transparency, and smart pricing.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-purple-50 rounded-2xl p-6 text-center">
            <p class="text-4xl font-black text-purple-700">500+</p>
            <p class="text-sm text-gray-600 mt-1">Active Businesses</p>
          </div>
          <div class="bg-pink-50 rounded-2xl p-6 text-center">
            <p class="text-4xl font-black text-pink-600">10K+</p>
            <p class="text-sm text-gray-600 mt-1">Orders Fulfilled</p>
          </div>
          <div class="bg-green-50 rounded-2xl p-6 text-center">
            <p class="text-4xl font-black text-green-600">98%</p>
            <p class="text-sm text-gray-600 mt-1">On-time Delivery</p>
          </div>
          <div class="bg-amber-50 rounded-2xl p-6 text-center">
            <p class="text-4xl font-black text-amber-600">47</p>
            <p class="text-sm text-gray-600 mt-1">Counties Reached</p>
          </div>
        </div>
      </div>

      <!-- Team / Tiers -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-gray-800 mb-4">Built for Every Business Size</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Whether you run a local salon or a national distribution chain, BestLady has a tier designed for your scale.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <h3 class="font-bold text-lg text-gray-800 mb-2">Retail Tier</h3>
          <p class="text-gray-500 text-sm">Perfect for salons, beauty studios, and small shops. Enjoy competitive retail pricing, AI-curated product recommendations, and M-Pesa payments with zero friction.</p>
        </div>
        <div class="border border-purple-200 bg-purple-50 rounded-2xl p-6 hover:shadow-md transition">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h3 class="font-bold text-lg text-gray-800 mb-2">Wholesale Tier</h3>
          <p class="text-gray-500 text-sm">For supermarkets, distributors, and chain stores. Unlock bulk pricing, extended credit limits, priority delivery, and advanced analytics to grow your business.</p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-16 px-6 text-center">
      <h2 class="text-3xl font-black mb-4">Ready to grow with BestLady?</h2>
      <p class="text-purple-100 mb-8 max-w-lg mx-auto">Join hundreds of businesses already using BestLady to streamline their beauty supply chain.</p>
      <router-link to="/register" class="inline-flex items-center gap-2 bg-white text-purple-700 font-black px-8 py-3.5 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
        Get Started Free
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
