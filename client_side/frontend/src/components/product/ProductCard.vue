<template>
  <div 
    class="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer" 
    @click="$emit('click')"
  >
    <!-- Image Container with Overlay -->
    <div class="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <img 
        :src="product.image_url || '/placeholder.jpg'" 
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      
      <!-- Image Overlay on Hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Quick View Button -->
      <button 
        @click.stop="quickView"
        class="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary-600 hover:text-white group/quick"
      >
        <svg class="h-6 w-6 text-gray-700 group-hover/quick:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      
      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2 z-10">
        <span v-if="product.is_new" class="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
          NEW
        </span>
        <span v-if="product.discount" class="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          -{{ product.discount }}% OFF
        </span>
        <span v-if="product.current_stock <= 10 && product.current_stock > 0" class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>
          Low Stock
        </span>
        <span v-if="product.current_stock === 0" class="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          SOLD OUT
        </span>
      </div>
      
      <!-- Wishlist Button -->
      <button 
        @click.stop="toggleWishlist"
        class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-10"
        :class="{ 'opacity-100': isWishlisted }"
      >
        <svg class="h-5 w-5 transition-colors" :class="isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      
      <!-- Sale Countdown (if applicable) -->
      <div v-if="product.saleEndsAt" class="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-center">
        <p class="text-xs text-white font-medium">Sale ends in:</p>
        <p class="text-sm text-white font-bold">{{ formatCountdown(product.saleEndsAt) }}</p>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ product.category?.name || 'Uncategorized' }}</span>
        <div class="flex items-center gap-1">
          <div class="flex items-center text-yellow-400">
            <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-xs font-semibold text-gray-700 ml-1">{{ product.rating || '4.8' }}</span>
          </div>
          <span class="text-xs text-gray-400">({{ product.reviewCount || '245' }})</span>
        </div>
      </div>
      
      <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {{ product.name }}
      </h3>
      
      <!-- Price with Tier Badge -->
      <div class="flex items-baseline gap-2 mb-3 flex-wrap">
        <span class="text-2xl font-bold text-primary-600">
          KES {{ formatPrice(displayPrice) }}
        </span>
        <span v-if="originalPrice" class="text-sm text-gray-400 line-through">
          KES {{ formatPrice(originalPrice) }}
        </span>
        <span v-if="auth.user?.tier === 'wholesale'" class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
          WHOLESALE
        </span>
      </div>
      
      <!-- Stock Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span class="flex items-center gap-1">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            {{ product.current_stock }} units
          </span>
          <span v-if="product.current_stock > 0" class="text-green-600 font-medium">
            {{ stockPercentage }}% available
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            class="h-1.5 rounded-full transition-all duration-700"
            :class="[
              stockPercentage > 60 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
              stockPercentage > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
              'bg-gradient-to-r from-red-500 to-orange-500'
            ]"
            :style="{ width: stockPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- Bulk Discount Badge (for wholesale) -->
      <div v-if="product.bulkDiscount" class="mb-3 p-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <p class="text-xs text-center font-semibold text-primary-700">
          Bulk order: {{ product.bulkDiscount }}% off on 10+ units
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-2">
        <!-- Add to Cart Button -->
        <button
          @click.stop="addToCart"
          :disabled="product.current_stock === 0"
          class="py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
          :class="[
            product.current_stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
            'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-lg transform hover:scale-105 active:scale-95'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add
        </button>
        
        <!-- Buy Now Button -->
        <button
          @click.stop="buyNow"
          :disabled="product.current_stock === 0"
          class="py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
          :class="[
            product.current_stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
            'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg transform hover:scale-105 active:scale-95'
          ]"
        >
          <span class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Buy Now
        </button>
      </div>
      
      <!-- Express Delivery Badge -->
      <div v-if="product.expressDelivery" class="mt-3 flex items-center justify-center gap-1 text-xs text-green-600">
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Express Delivery Available</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['click', 'add-to-cart', 'quick-view', 'wishlist-toggle'])

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const toast = useToast()

// Wishlist state (local for demo, should be fetched from store)
const isWishlisted = ref(false)

const displayPrice = computed(() => {
  return auth.user?.tier === 'wholesale' 
    ? props.product.wholesale_price 
    : props.product.retail_price
})

const originalPrice = computed(() => {
  return props.product.discount ? props.product.retail_price : null
})

const stockPercentage = computed(() => {
  const max = props.product.reorder_point * 2 || 100
  return Math.min(Math.max((props.product.current_stock / max) * 100, 0), 100)
})

const formatCountdown = (endDate) => {
  const diff = new Date(endDate) - new Date()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

const addToCart = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  
  if (props.product.current_stock === 0) {
    toast.error('Sorry, this product is out of stock')
    return
  }
  
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: displayPrice.value,
    image_url: props.product.image_url,
    quantity: 1
  }, displayPrice.value)
  
  toast.success(`${props.product.name} added to cart!`, {
    duration: 2000,
    position: 'bottom-right'
  })
  
  emit('add-to-cart', props.product)
}

const buyNow = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  
  if (props.product.current_stock === 0) {
    toast.error('Sorry, this product is out of stock')
    return
  }
  
  // Add to cart first
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: displayPrice.value,
    image_url: props.product.image_url,
    quantity: 1
  }, displayPrice.value)
  
  // Then redirect to checkout
  router.push('/checkout')
}

const quickView = () => {
  emit('quick-view', props.product)
}

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  emit('wishlist-toggle', { product: props.product, isWishlisted: isWishlisted.value })
  toast.info(isWishlisted.value ? 'Added to wishlist' : 'Removed from wishlist')
}
</script>

<style scoped>
/* Ensure proper text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth animations */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.group-hover\/btn\:animate-bounce:hover {
  animation: bounce 0.5s ease-in-out;
}
</style>