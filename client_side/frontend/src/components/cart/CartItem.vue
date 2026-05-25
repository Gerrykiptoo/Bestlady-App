<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
    <!-- Header with Gradient -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order Summary
      </h2>
    </div>
    
    <div class="p-6 space-y-5">
      <!-- Items Count -->
      <div class="flex justify-between text-sm text-gray-600">
        <span>Items Total</span>
        <span class="font-medium">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
      </div>
      
      <!-- Subtotal -->
      <div class="flex justify-between text-lg font-semibold">
        <span>Subtotal</span>
        <span class="text-primary-600">KES {{ formatPrice(subtotal) }}</span>
      </div>
      
      <!-- Delivery Info -->
      <div class="border-t border-gray-100 pt-4">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Delivery</span>
          <span class="text-gray-500">Calculated at checkout</span>
        </div>
        
        <!-- Free Shipping Progress (if subtotal > 0) -->
        <div v-if="subtotal > 0 && subtotal < freeShippingThreshold" class="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-green-700 font-medium">Add KES {{ formatPrice(remainingForFreeShipping) }} more for FREE shipping!</span>
            <span class="text-green-600 font-bold">{{ progressPercentage }}%</span>
          </div>
          <div class="w-full bg-green-100 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-700"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- Free Shipping Achieved -->
        <div v-else-if="subtotal >= freeShippingThreshold && subtotal > 0" class="mt-3 p-3 bg-green-100 rounded-xl text-center">
          <div class="flex items-center justify-center gap-2 text-green-700 font-semibold text-sm">
            <svg class="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            FREE SHIPPING ELIGIBLE!
          </div>
        </div>
      </div>
      
      <!-- Promo Code Section -->
      <div class="border-t border-gray-100 pt-4">
        <div class="flex gap-2">
          <input 
            v-model="promoCode"
            type="text"
            placeholder="Promo code"
            class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            :disabled="promoApplied"
          />
          <button 
            @click="applyPromo"
            :disabled="!promoCode || promoApplied"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            {{ promoApplied ? 'Applied' : 'Apply' }}
          </button>
        </div>
        <p v-if="promoApplied" class="text-xs text-green-600 mt-2 flex items-center gap-1">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Discount applied! You saved KES {{ formatPrice(discountAmount) }}
        </p>
      </div>
      
      <!-- Total Section -->
      <div class="border-t border-gray-200 pt-4">
        <div class="flex justify-between items-baseline">
          <span class="text-gray-600">Total</span>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary-600">KES {{ formatPrice(total) }}</p>
            <p v-if="originalTotal > total" class="text-xs text-gray-400 line-through">KES {{ formatPrice(originalTotal) }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">*Tax included where applicable</p>
      </div>
      
      <!-- Checkout Button -->
      <router-link 
        to="/checkout" 
        class="block w-full mt-2"
        :class="{ 'pointer-events-none': subtotal === 0 }"
      >
        <button 
          :disabled="subtotal === 0"
          class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 group"
        >
          <span>Proceed to Checkout</span>
          <svg class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </router-link>
      
      <!-- Payment Methods -->
      <div class="pt-4 border-t border-gray-100">
        <p class="text-xs text-gray-500 text-center mb-3">We accept</p>
        <div class="flex justify-center gap-3">
          <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">VISA</div>
          <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">MC</div>
          <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">MPESA</div>
          <div class="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">WLT</div>
        </div>
      </div>
    </div>
    
    <!-- Security Badge -->
    <div class="bg-gray-50 px-6 py-3 border-t border-gray-100">
      <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure Checkout • 100% Protected</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  subtotal: { type: Number, required: true },
  itemCount: { type: Number, default: 0 }
})

const emit = defineEmits(['promo-applied'])

// Free shipping threshold (KES 5000)
const freeShippingThreshold = 5000

// Promo code state
const promoCode = ref('')
const promoApplied = ref(false)
const discountAmount = ref(0)
const discountPercent = ref(0)

// Calculate remaining for free shipping
const remainingForFreeShipping = computed(() => {
  return Math.max(0, freeShippingThreshold - props.subtotal)
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  return Math.min(100, Math.round((props.subtotal / freeShippingThreshold) * 100))
})

// Calculate original total (without promo)
const originalTotal = computed(() => {
  return props.subtotal
})

// Calculate final total with promo
const total = computed(() => {
  let finalTotal = props.subtotal
  if (promoApplied.value) {
    finalTotal = props.subtotal - discountAmount.value
  }
  return Math.max(0, finalTotal)
})

// Apply promo code
const applyPromo = () => {
  const code = promoCode.value.toUpperCase().trim()
  
  // Demo promo codes
  const promos = {
    'WELCOME10': { percent: 10, amount: props.subtotal * 0.1 },
    'SAVE20': { percent: 20, amount: props.subtotal * 0.2 },
    'FREESHIP': { amount: 0, freeShipping: true }
  }
  
  if (promos[code]) {
    if (code === 'FREESHIP') {
      // Free shipping would be applied at checkout
      emit('promo-applied', { type: 'free_shipping' })
      discountAmount.value = 0
    } else {
      discountAmount.value = Math.min(promos[code].amount, props.subtotal)
      discountPercent.value = promos[code].percent
      emit('promo-applied', { type: 'discount', amount: discountAmount.value, percent: discountPercent.value })
    }
    promoApplied.value = true
  } else {
    alert('Invalid promo code')
  }
}
</script>