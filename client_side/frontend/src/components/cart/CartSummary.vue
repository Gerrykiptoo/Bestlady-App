<template>
  <div class="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
    <div class="space-y-2 border-b pb-4">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>KES {{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Delivery</span>
        <span class="text-gray-500">Calculated at checkout</span>
      </div>
    </div>
    <router-link 
      to="/checkout" 
      class="btn-primary w-full mt-4 text-center block"
      :class="{ 'opacity-50 pointer-events-none': subtotal === 0 }"
    >
      Proceed to Checkout
    </router-link>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/formatters'

defineProps({
  subtotal: { type: Number, required: true }
})
</script>
