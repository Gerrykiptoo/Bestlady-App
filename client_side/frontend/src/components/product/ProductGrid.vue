<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="animate-pulse">
        <div class="bg-gray-200 rounded-2xl h-64 mb-4 shimmer"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
          <div class="h-8 bg-gray-200 rounded w-full shimmer"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
        <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
      <p class="text-gray-500 mb-6">We couldn't find any products matching your criteria.</p>
      <button 
        @click="$emit('reset-filters')" 
        class="btn-primary inline-flex items-center gap-2"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Clear Filters
      </button>
    </div>

    <!-- Product Grid -->
    <transition-group 
      v-else 
      tag="div" 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      name="product-grid"
    >
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        @click="goToDetail(product.id)"
        @add-to-cart="handleAddToCart"
        @quick-view="handleQuickView"
        @wishlist-toggle="handleWishlistToggle"
      />
    </transition-group>

    <!-- Load More Button (if pagination) -->
    <div v-if="hasMore && products.length > 0" class="text-center mt-12">
      <button 
        @click="$emit('load-more')"
        :disabled="loadingMore"
        class="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 disabled:opacity-50"
      >
        <svg v-if="loadingMore" class="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>Load More Products</span>
      </button>
    </div>

    <!-- End of Results Message -->
    <div v-if="!hasMore && products.length > 0" class="text-center mt-12">
      <p class="text-sm text-gray-400">You've reached the end of the list</p>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  loadingMore: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false }
})

const emit = defineEmits(['add-to-cart', 'quick-view', 'wishlist-toggle', 'load-more', 'reset-filters'])

const goToDetail = (id) => {
  router.push(`/products/${id}`)
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const handleQuickView = (product) => {
  emit('quick-view', product)
}

const handleWishlistToggle = (data) => {
  emit('wishlist-toggle', data)
}
</script>

<style scoped>
/* Animation for product cards */
.product-grid-enter-active,
.product-grid-leave-active {
  transition: all 0.3s ease;
}

.product-grid-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.product-grid-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.product-grid-move {
  transition: transform 0.3s ease;
}

/* Shimmer effect for loading skeleton */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
}
</style>