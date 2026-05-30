<template>
  <div class="min-h-screen" style="background: #faf9f7;">

    <!-- Warm breadcrumb header -->
    <div style="background: linear-gradient(135deg, #2d0a1f 0%, #4a1232 50%, #3b0f28 100%); border-bottom: 1px solid rgba(244,197,173,0.12); position: relative; overflow: hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(244,197,173,0.04);"></div>
      <div class="container-custom relative z-10 py-8">
        <div class="flex items-center gap-2 text-rose-300/60 text-sm">
          <router-link to="/products" class="hover:text-rose-200 transition font-medium">Catalogue</router-link>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-white font-semibold truncate max-w-[200px] font-serif">{{ product?.name || '…' }}</span>
        </div>
      </div>
    </div>

    <div class="container-custom py-10">

      <!-- Loading -->
      <div v-if="!product" class="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
        <div class="aspect-square rounded-2xl" style="background: #ede9e3;"></div>
        <div class="space-y-4 pt-4">
          <div class="h-7 rounded w-2/3" style="background: #ede9e3;"></div>
          <div class="h-5 rounded w-1/3" style="background: #ede9e3;"></div>
          <div class="h-10 rounded w-1/2" style="background: #ede9e3;"></div>
          <div class="h-4 rounded w-full" style="background: #ede9e3;"></div>
          <div class="h-4 rounded w-5/6" style="background: #ede9e3;"></div>
          <div class="flex gap-3 pt-4">
            <div class="flex-1 h-12 rounded-xl" style="background: #ede9e3;"></div>
            <div class="flex-1 h-12 rounded-xl" style="background: #ede9e3;"></div>
          </div>
        </div>
      </div>

      <!-- Product detail -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10">

        <!-- Image -->
        <div class="card p-3 aspect-square flex items-center justify-center overflow-hidden">
          <img v-if="product.image_url" :src="product.image_url" :alt="product.name"
            class="w-full h-full object-cover rounded-xl" />
          <div v-else class="w-full h-full rounded-xl flex items-center justify-center" style="background: #ede9e3;">
            <svg class="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-5 py-2">

          <!-- Category + badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="product.category?.name" class="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {{ product.category.name }}
            </span>
            <span v-if="product.current_stock > 0" class="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              In Stock
            </span>
            <span v-else class="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>

          <h1 class="text-3xl font-black text-slate-900 leading-tight">{{ product.name }}</h1>

          <!-- Price -->
          <div>
            <p class="text-4xl font-black brand-text">KES {{ formatPrice(displayPrice) }}</p>
            <p v-if="auth.user?.tier === 'wholesale' && product.retail_price !== product.wholesale_price"
              class="text-sm text-slate-400 mt-1 line-through">Retail: KES {{ formatPrice(product.retail_price) }}</p>
            <p class="text-xs text-slate-400 mt-1">Per {{ product.unit || 'unit' }}</p>
          </div>

          <!-- Description -->
          <p class="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
            {{ product.description || 'No description available for this product.' }}
          </p>

          <!-- Stock info -->
          <div class="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <span>SKU: <strong class="text-slate-700">{{ product.sku || 'N/A' }}</strong></span>
            <span class="text-slate-300">|</span>
            <span>Stock: <strong :class="product.current_stock > 0 ? 'text-emerald-600' : 'text-red-500'">{{ product.current_stock }} {{ product.unit || 'units' }}</strong></span>
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
            <div class="flex items-center gap-3">
              <button @click="quantity > 1 && quantity--"
                :disabled="quantity <= 1"
                class="btn-icon disabled:opacity-40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/></svg>
              </button>
              <span class="w-14 text-center font-black text-xl text-slate-800">{{ quantity }}</span>
              <button @click="quantity < product.current_stock && quantity++"
                :disabled="quantity >= product.current_stock"
                class="btn-icon disabled:opacity-40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              </button>
              <span class="text-xs text-slate-400 ml-2">/ {{ product.current_stock }} available</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex gap-3 pt-2">
            <button @click="addToCart" :disabled="product.current_stock === 0" class="btn-primary flex-1 py-4 text-base">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Add to Cart
            </button>
            <button @click="buyNow" :disabled="product.current_stock === 0" class="btn-success flex-1 py-4 text-base">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              Buy Now
            </button>
          </div>

          <p v-if="product.current_stock === 0" class="text-center text-sm text-red-500 font-medium">
            This product is currently out of stock.
          </p>
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

const displayPrice = computed(() =>
  auth.user?.tier === 'wholesale' ? product.value?.wholesale_price : product.value?.retail_price
)

const addToCart = () => {
  if (!auth.isAuthenticated) return router.push('/login')
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
  } catch {
    toast.error('Product not found')
    router.push('/products')
  }
})
</script>
