<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <!-- Cart List -->
      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        
        <div v-if="cart.items.length === 0" class="bg-white p-8 rounded-xl shadow-sm border text-center text-gray-500">
          Your cart is empty. <router-link to="/products" class="text-primary font-bold">Start shopping!</router-link>
        </div>

        <div v-else v-for="item in cart.items" :key="item.product_id" class="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img v-if="item.image_url" :src="item.image_url" class="object-cover h-full w-full" />
            <span v-else class="text-gray-400">📦</span>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800">{{ item.name }}</h3>
            <p class="text-xs text-gray-500">KES {{ item.price }} / unit</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="cart.updateQuantity(item.product_id, item.quantity - 1)" class="w-8 h-8 rounded-full border">-</button>
            <span class="font-bold">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.product_id, item.quantity + 1)" class="w-8 h-8 rounded-full border">+</button>
          </div>
          <div class="font-black text-gray-900 w-24 text-right">KES {{ item.price * item.quantity }}</div>
          <button @click="cart.removeItem(item.product_id)" class="text-red-500 ml-2">✕</button>
        </div>

        <!-- AI Assistant Widget -->
        <div v-if="cart.items.length > 0" class="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg border border-indigo-400 relative overflow-hidden">
          <h3 class="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
            <span>✨ AI Purchase Optimizer</span>
          </h3>
          <p class="text-sm opacity-90 mb-4 relative z-10 italic">
            "Adding 5 more units of Hair Treatment would qualify you for the bulk wholesale discount (15% off)!"
          </p>
          <button class="bg-white text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold relative z-10 hover:shadow-md transition">
            Apply Suggestion
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="w-full md:w-80 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-6">
        <h3 class="font-bold text-xl mb-6">Order Summary</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Subtotal</span>
            <span>KES {{ cart.subtotal }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Tax (VAT 16%)</span>
            <span>KES {{ cart.tax }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Delivery Fee</span>
            <span>KES 250</span>
          </div>
          <div class="border-t pt-4 flex justify-between font-black text-lg">
            <span>Total</span>
            <span class="text-primary">KES {{ cart.total }}</span>
          </div>
        </div>
        <button @click="router.push('/checkout')" :disabled="cart.items.length === 0" class="w-full mt-8 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
const router = useRouter();
</script>
