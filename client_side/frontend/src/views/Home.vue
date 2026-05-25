<template>
  <div>
    <!-- ══ Hero ══ -->
    <section class="relative overflow-hidden bg-gradient-to-br from-purple-800 via-purple-700 to-pink-600 text-white min-h-[88vh] flex items-center">
      <!-- Decorative blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-pulse" style="animation-delay: 1.5s"></div>
        <div class="absolute top-1/2 left-0 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>
      </div>

      <div class="container-custom relative z-10 py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: copy -->
          <div>
            <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm font-semibold">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              AI-Powered Beauty Supply Chain
            </div>
            <h1 class="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Beauty Products
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">for Every Business</span>
            </h1>
            <p class="text-lg text-white/80 mb-10 leading-relaxed max-w-lg">
              Wholesale & retail beauty supplies with AI-powered inventory management, loyalty rewards, and real-time order tracking. Built for salons, supermarkets and distributors.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link to="/products" class="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-base hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200">
                Shop Now
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </router-link>
              <router-link to="/register" class="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white hover:text-purple-700 transition-all duration-200">
                Become a Partner
              </router-link>
            </div>

            <!-- Trust signals -->
            <div class="flex flex-wrap items-center gap-6 mt-10 text-white/60 text-sm">
              <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>Free Returns</span>
              <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>Secure Payments</span>
              <span class="flex items-center gap-1.5"><svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>24-48hr Delivery</span>
            </div>
          </div>

          <!-- Right: floating product cards -->
          <div class="hidden lg:flex flex-col gap-4 items-end relative">
            <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-72 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <div>
                  <p class="font-bold text-sm">Organic Skincare</p>
                  <p class="text-xs text-white/60">Premium Collection</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-black">KES 1,200</span>
                <span class="bg-green-400/30 text-green-300 text-xs font-bold px-2 py-1 rounded-full">In Stock</span>
              </div>
            </div>

            <div class="bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-md border border-white/20 rounded-3xl p-5 w-64 shadow-xl -mr-4 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                </div>
                <div>
                  <p class="font-bold text-sm">AI Recommendation</p>
                  <p class="text-xs text-white/60">Based on your history</p>
                </div>
              </div>
              <p class="text-xs text-white/80 italic">"Adding Rose Water would boost your basket value by 28%"</p>
            </div>

            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 w-56 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <p class="text-xs text-white/60 mb-2">Loyalty Tier</p>
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
                <div>
                  <p class="font-black text-lg">Platinum</p>
                  <p class="text-xs text-pink-300">15% AI discount active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Stats strip ══ -->
    <section class="bg-white border-b border-gray-100">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
          <div v-for="stat in stats" :key="stat.label" class="py-8 px-6 text-center group cursor-default">
            <div class="text-3xl lg:text-4xl font-black text-primary-600 group-hover:scale-110 transition-transform inline-block">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 mt-1 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Categories ══ -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Collections</p>
          <h2 class="text-4xl font-black text-gray-900">Shop by Category</h2>
          <p class="text-gray-500 max-w-xl mx-auto mt-3">Curated collections of premium beauty and personal care products</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="group cursor-pointer"
            @click="navigateToCategory(cat.id)"
          >
            <div class="bg-white rounded-2xl p-6 text-center shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 border border-gray-100 group-hover:border-primary-200 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style="background: var(--brand-gradient)">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <h3 class="font-bold text-gray-800 text-sm">{{ cat.name }}</h3>
              <p class="text-xs text-gray-400 mt-1 group-hover:text-primary-500 transition-colors">Explore →</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Featured Products ══ -->
    <section class="py-20 bg-white">
      <div class="container-custom">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Trending Now</p>
            <h2 class="text-4xl font-black text-gray-900">Featured Products</h2>
            <p class="text-gray-500 mt-2">Our most popular beauty products this season</p>
          </div>
          <router-link to="/products" class="hidden sm:inline-flex items-center gap-1.5 text-primary-600 font-semibold hover:text-primary-700 transition text-sm">
            View All Products
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
        <div v-if="featuredProducts.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
        <div class="text-center mt-10 sm:hidden">
          <router-link to="/products" class="inline-flex items-center gap-2 border border-primary-600 text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition text-sm">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- ══ How It Works ══ -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div class="container-custom">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Simple Process</p>
          <h2 class="text-4xl font-black text-gray-900">How BestLady Works</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <!-- Connecting line (desktop) -->
          <div class="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 to-pink-200" style="width: 50%; left: 12.5%;"></div>

          <div v-for="(step, i) in howItWorks" :key="i" class="text-center group relative">
            <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:-translate-y-1 transition-transform duration-300" :style="{ background: step.gradient }">
              <svg class="w-9 h-9" :class="step.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="step.icon"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 text-white text-xs font-black rounded-full flex items-center justify-center mx-auto" style="left: calc(50% + 16px); width: 22px; height: 22px;">{{ i + 1 }}</div>
            <h3 class="font-bold text-gray-800 mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-500">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Platform Insights ══ -->
    <section class="py-20 bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Live Analytics</p>
          <h2 class="text-4xl font-black text-gray-900">Platform Insights</h2>
          <p class="text-gray-500 max-w-xl mx-auto mt-3">See what's trending in our beauty ecosystem</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Category Demand
            </h3>
            <div class="h-60">
              <Bar :data="demandChartData" :options="chartOptions" />
            </div>
          </div>
          <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              Top Selling Products
            </h3>
            <div class="h-60">
              <Bar :data="salesChartData" :options="salesChartOptions" />
            </div>
          </div>
        </div>

        <!-- KPI cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
          <div class="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100 rounded-2xl p-6">
            <p class="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Top Product</p>
            <h4 class="text-xl font-black text-gray-800">{{ topProduct }}</h4>
            <p class="text-sm text-green-600 font-semibold mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              {{ topConfidence }}% demand growth
            </p>
          </div>
          <div class="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6">
            <p class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
              Total Orders — Live
            </p>
            <h4 class="text-xl font-black text-gray-800 tabular-nums transition-all duration-500" :class="orderFlash ? 'text-green-600 scale-105' : ''">
              {{ liveOrderCount.toLocaleString() }}+
            </h4>
            <p class="text-sm text-primary-600 font-semibold mt-2">{{ platformData?.platformStats?.activeusers || '5,000' }} active businesses</p>
          </div>
          <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Platform Health</p>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs mb-1"><span class="text-gray-600">Order Fulfillment</span><span class="font-bold text-primary-600">98.4%</span></div>
                <div class="w-full bg-gray-100 rounded-full h-1.5"><div class="bg-primary-500 h-1.5 rounded-full" style="width: 98.4%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1"><span class="text-gray-600">Customer Satisfaction</span><span class="font-bold text-pink-600">4.9/5.0</span></div>
                <div class="w-full bg-gray-100 rounded-full h-1.5"><div class="bg-pink-500 h-1.5 rounded-full" style="width: 98%"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Benefits ══ -->
    <section class="py-20 bg-gray-50">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="benefit in benefits" :key="benefit.title" class="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm" :style="{ background: benefit.gradient }">
              <svg class="w-7 h-7" :class="benefit.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="benefit.icon"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">{{ benefit.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ AI Banner ══ -->
    <section class="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>
      </div>
      <div class="container-custom relative z-10 text-center">
        <div class="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-5 py-2 mb-7 text-sm font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          AI-Powered Recommendations
        </div>
        <h2 class="text-4xl lg:text-5xl font-black mb-5 max-w-2xl mx-auto leading-tight">
          Get Personalized Deals Based on Your Business
        </h2>
        <p class="text-lg text-white/75 mb-10 max-w-xl mx-auto">
          Our AI learns your purchase patterns and suggests products you'll actually sell — with loyalty discounts up to 15% off.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="openAIChat" class="inline-flex items-center justify-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200">
            Try AI Assistant
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
          <router-link to="/register" class="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-700 transition-all duration-200">
            Create Free Account
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import { useToast } from 'vue-toast-notification'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getSocket } from '@/services/socket'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const cart = useCartStore()
const ui = useUIStore()
const toast = useToast()

const categories = ref([])
const featuredProducts = ref([])
const platformData = ref(null)
const liveOrderCount = ref(10000)
const orderFlash = ref(false)

const stats = [
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Brands' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '24/7', label: 'AI Support' },
]

const howItWorks = [
  { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', iconColor: 'text-indigo-600', title: 'Create Account', desc: 'Sign up free and choose your business tier — retail or wholesale.', gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', iconColor: 'text-pink-600', title: 'Browse & Order', desc: 'Explore 500+ products, use AI recommendations, add to cart.', gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', iconColor: 'text-emerald-600', title: 'Pay Easily', desc: 'Pay via M-Pesa or your BestLady wallet instantly.', gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
  { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', iconColor: 'text-amber-600', title: 'Fast Delivery', desc: 'Your order is dispatched same day and tracked in real-time.', gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
]

const benefits = [
  { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', iconColor: 'text-indigo-600', title: 'Quality Guaranteed', desc: 'All products sourced directly from verified manufacturers with quality certification.', gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', iconColor: 'text-pink-600', title: 'Same-Day Dispatch', desc: 'Orders placed before 2 PM are dispatched the same day. Delivered in 24–48 hrs.', gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-emerald-600', title: 'Best Wholesale Prices', desc: 'Bulk discounts, loyalty tiers, and AI-optimized pricing for maximum savings.', gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
]

const openAIChat = () => ui.openAIChat()

const topProduct = computed(() => platformData.value?.predictions?.[0]?.Product?.name || 'Organic Shea Butter')
const topConfidence = computed(() => platformData.value?.predictions?.[0]?.confidence || '24')

const demandChartData = ref({
  labels: ['Skincare', 'Haircare', 'Makeup', 'Body Care', 'Fragrance', 'Tools'],
  datasets: [{
    label: 'Market Demand (%)',
    backgroundColor: ['#7c3aed', '#9333ea', '#a855f7', '#c084fc', '#e879f9', '#f0abfc'],
    borderRadius: 8,
    data: [85, 72, 94, 58, 45, 66]
  }]
})

const salesChartData = ref({
  labels: ['Shea Butter', 'Aloe Vera', 'Rose Water', 'Argan Oil', 'Coconut Oil'],
  datasets: [{
    label: 'Units Sold',
    backgroundColor: ['#ec4899', '#f43f5e', '#fb7185', '#f9a8d4', '#fce7f3'],
    borderRadius: 8,
    data: [450, 320, 600, 210, 540]
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
}
const salesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
}


const navigateToCategory = (categoryId) => {
  router.push({ path: '/products', query: { category: categoryId } })
}

const goToProduct = (id) => {
  router.push(`/products/${id}`)
}

const handleAddToCart = (product) => {
  toast.success(`${product.name} added to cart!`, { duration: 2000, position: 'bottom-right' })
}

const fetchPlatformData = async () => {
  try {
    const { data } = await api.get('/ai/user/dashboard')
    platformData.value = data
    if (data.platformStats?.totalorders) {
      liveOrderCount.value = parseInt(data.platformStats.totalorders) || 10000
    }
    if (data.predictions?.length > 0) {
      demandChartData.value = {
        labels: data.predictions.map(p => p.Product?.name || 'Unknown'),
        datasets: [{ label: 'Demand (%)', backgroundColor: ['#7c3aed','#9333ea','#a855f7','#c084fc','#e879f9','#f0abfc'], borderRadius: 8, data: data.predictions.map(p => parseFloat(p.confidence)) }]
      }
    }
  } catch {}
}

let socketHandler = null

onMounted(async () => {
  fetchPlatformData()
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?limit=8')
    ])
    categories.value = catRes.data || []
    featuredProducts.value = prodRes.data?.products || []
  } catch (error) {
    console.error('Failed to load home data:', error)
  }

  // Live order counter via socket
  const socket = getSocket()
  if (socket) {
    socketHandler = () => {
      liveOrderCount.value++
      orderFlash.value = true
      setTimeout(() => { orderFlash.value = false }, 1500)
    }
    socket.on('newOrder', socketHandler)
  }
})

onBeforeUnmount(() => {
  const socket = getSocket()
  if (socket && socketHandler) socket.off('newOrder', socketHandler)
})
</script>

<style scoped>
.delay-1000 { animation-delay: 1s; }
</style>
