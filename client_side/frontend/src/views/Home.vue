<template>
  <div>
    <!-- Hero Section with Animated Background -->
    <section class="relative overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 text-white py-24">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div class="container-custom relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-float">
              <span class="text-yellow-300">✨</span>
              <span class="text-sm font-semibold">AI-Powered Beauty Platform</span>
            </div>
            <h1 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Beauty Products for 
              <span class="text-yellow-300">Every Business</span>
            </h1>
            <p class="text-xl mb-8 text-white/90">Wholesale & retail beauty products with AI inventory management. Perfect for salons, supermarkets, and distributors.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <router-link to="/products" class="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                Shop Now
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </router-link>
              <router-link to="/register" class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2">
                Become a Partner
              </router-link>
            </div>
          </div>
          <div class="hidden lg:block relative">
            <div class="relative animate-float">
              <div class="absolute -top-10 -left-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc8efcaf?w=500" alt="Beauty Products" class="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center group cursor-pointer">
            <div class="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">500+</div>
            <div class="text-gray-600">Products</div>
          </div>
          <div class="text-center group cursor-pointer">
            <div class="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">50+</div>
            <div class="text-gray-600">Brands</div>
          </div>
          <div class="text-center group cursor-pointer">
            <div class="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">10K+</div>
            <div class="text-gray-600">Happy Customers</div>
          </div>
          <div class="text-center group cursor-pointer">
            <div class="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">24/7</div>
            <div class="text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section with Hover Effects -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Shop by Category</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">Discover our curated selection of premium beauty products</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div v-for="cat in categories" :key="cat.id" 
               class="text-center cursor-pointer group" 
               @click="navigateToCategory(cat.id)">
            <div class="relative bg-white rounded-2xl p-6 shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span class="text-5xl block mb-3 group-hover:scale-110 transition-transform">{{ getCategoryIcon(cat.name) }}</span>
              <h3 class="font-semibold text-gray-800">{{ cat.name }}</h3>
              <p class="text-xs text-gray-500 mt-1 group-hover:text-primary-600">Shop Now →</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products with Hover Effects -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Featured Products</h2>
            <p class="text-gray-600">Our most popular beauty products this month</p>
          </div>
          <router-link to="/products" class="text-primary-600 font-semibold hover:underline inline-flex items-center gap-1">
            View All
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard 
            v-for="product in featuredProducts.slice(0, 8)" 
            :key="product.id" 
            :product="product"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Quality Guaranteed</h3>
            <p class="text-gray-600">All products are sourced from trusted manufacturers and verified for quality.</p>
          </div>
          <div class="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Fast Delivery</h3>
            <p class="text-gray-600">Same-day dispatch for orders before 2 PM. Delivery within 24-48 hours.</p>
          </div>
          <div class="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Best Prices</h3>
            <p class="text-gray-600">Wholesale pricing available for bulk orders. Retail discounts up to 30%.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Assistant Banner -->
    <section class="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white">
      <div class="container-custom text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
          <span class="text-yellow-300">🤖</span>
          <span class="text-sm">AI-Powered Assistant</span>
        </div>
        <h2 class="text-4xl font-bold mb-4">Get Personalized Product Recommendations</h2>
        <p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Our AI analyzes your purchase history to suggest products you'll love</p>
        <router-link to="/dashboard" class="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300">
          Try AI Assistant
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const cart = useCartStore()
const toast = useToast()
const categories = ref([])
const featuredProducts = ref([])

const getCategoryIcon = (name) => {
  const icons = {
    'Skincare': '🧴',
    'Haircare': '💇‍♀️',
    'Makeup': '💄',
    'Body Care': '🛁',
    'Fragrance': '🌸',
    'Tools & Accessories': '🪞'
  }
  return icons[name] || '📦'
}

const navigateToCategory = (categoryId) => {
  router.push({ path: '/products', query: { category: categoryId } })
}

const goToProduct = (id) => {
  router.push(`/products/${id}`)
}

const handleAddToCart = (product) => {
  toast.success(`${product.name} added to cart!`, {
    duration: 2000,
    position: 'bottom-right'
  })
}

onMounted(async () => {
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
})
</script>

<style scoped>
.delay-1000 {
  animation-delay: 1s;
}
</style>