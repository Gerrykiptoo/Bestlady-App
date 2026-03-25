<template>
  <div class="container-custom py-8" v-if="product">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="bg-white rounded-lg shadow p-4">
        <img 
          :src="product.image_url || '/placeholder.jpg'" 
          :alt="product.name" 
          class="w-full h-96 object-cover rounded-lg"
        />
      </div>
      
      <!-- Product Info -->
      <div>
        <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
        <p class="text-gray-500 mb-4">{{ product.category?.name }}</p>
        <p class="text-2xl font-bold text-primary-600 mb-4">
          KES {{ formatPrice(displayPrice) }}
        </p>
        <p class="text-gray-600 mb-6">{{ product.description }}</p>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Quantity</label>
          <div class="flex items-center gap-2">
            <button 
              @click="quantity--" 
              :disabled="quantity <= 1"
              class="w-10 h-10 border rounded disabled:opacity-50"
            >-</button>
            <span class="w-12 text-center">{{ quantity }}</span>
            <button 
              @click="quantity++" 
              :disabled="quantity >= product.current_stock"
              class="w-10 h-10 border rounded disabled:opacity-50"
            >+</button>
          </div>
          <p class="text-xs text-gray-500 mt-1">Stock available: {{ product.current_stock }}</p>
        </div>
        
        <div class="flex gap-4">
          <button @click="addToCart" class="flex-1 btn-primary">Add to Cart</button>
          <button @click="buyNow" class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Buy Now
          </button>
        </div>
        
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">Product Details</h3>
          <p class="text-sm text-gray-600">SKU: {{ product.sku }}</p>
          <p class="text-sm text-gray-600">Stock: {{ product.current_stock }} units</p>
          <p class="text-sm text-gray-600">Unit: {{ product.unit }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const toast = useToast()
const product = ref(null)
const quantity = ref(1)

const displayPrice = computed(() => {
  return auth.user?.tier === 'wholesale' 
    ? product.value?.wholesale_price 
    : product.value?.retail_price
})

const addToCart = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  cart.addItem({
    id: product.value.id,
    name: product.value.name,
    price: displayPrice.value,
    image_url: product.value.image_url,
    quantity: quantity.value
  })
  toast.success(`${product.value.name} added to cart!`)
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/products/${route.params.id}`)
    product.value = data
  } catch (error) {
    console.error('Failed to load product:', error)
    toast.error('Product not found')
    router.push('/products')
  }
})
</script>
