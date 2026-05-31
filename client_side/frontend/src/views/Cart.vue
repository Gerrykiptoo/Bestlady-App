<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <!-- Warm page header -->
    <div style="background: linear-gradient(135deg, #2d0a1f 0%, #4a1232 50%, #3b0f28 100%); border-bottom: 1px solid rgba(244,197,173,0.12); position: relative; overflow: hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(244,197,173,0.05);"></div>
      <div class="container-custom relative z-10 py-10">
        <p class="text-rose-300/70 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your Basket</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="font-serif text-3xl font-bold text-white">Shopping Cart</h1>
            <p class="text-rose-200/60 mt-1.5 text-sm">
              {{ cart.itemCount > 0 ? `${cart.itemCount} ${cart.itemCount === 1 ? 'item' : 'items'} in your cart` : 'Your cart is waiting to be filled' }}
            </p>
          </div>
          <router-link to="/products" class="inline-flex items-center gap-2 border border-rose-300/30 text-rose-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:bg-white/10" style="background: rgba(255,255,255,0.06);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">
      <!-- Empty cart -->
      <div v-if="cart.items.length === 0" class="bg-white rounded-2xl py-24 text-center" style="border: 1px solid #ede9e3;">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
        <p class="text-gray-500 mb-7">Discover amazing beauty products and add them to your cart</p>
        <router-link to="/products" class="inline-flex items-center gap-2 bg-primary-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-primary-700 transition">
          Browse Products
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </router-link>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Cart Items -->
        <div class="flex-1 space-y-4">

          <!-- Optimized confirmation banner -->
          <div v-if="optimized && totalSavings > 0"
            class="rounded-2xl p-4 flex items-center gap-3 border"
            style="background: #ecfdf5; border-color: #a7f3d0;">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #059669;">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-emerald-800 text-sm">AI Optimization Applied</p>
              <p class="text-xs text-emerald-600">Your discounted prices below are locked in and will appear on your receipt.</p>
            </div>
            <p class="font-black text-emerald-700 text-lg">−KES {{ formatPrice(totalSavings) }}</p>
          </div>

          <div
            v-for="item in cart.items"
            :key="item.product_id"
            class="bg-white rounded-2xl p-5 flex gap-4 items-start hover:shadow-md transition-shadow"
            :style="item.discountedPrice && item.discountedPrice < item.price
              ? 'border: 1px solid #a7f3d0; box-shadow: 0 1px 8px rgba(5,150,105,0.08);'
              : 'border: 1px solid #ede9e3;'"
          >
            <!-- Product image -->
            <div class="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.name"
                class="w-full h-full object-cover"
                @error="e => e.target.src='/placeholder.jpg'"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-800 truncate">{{ item.name }}</h3>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <span v-if="item.discountPercent" class="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold">{{ item.discountPercent }}% OFF</span>
                <span v-if="item.discountedPrice && item.discountedPrice < item.price" class="text-xs text-gray-400 line-through">KES {{ formatPrice(item.price) }}</span>
              </div>
              <p class="text-sm text-primary-600 font-semibold mt-1">KES {{ formatPrice(item.discountedPrice ?? item.price) }} / unit</p>

              <!-- Quantity controls -->
              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
                  <button @click="cart.updateQuantity(item.product_id, item.quantity - 1)" class="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 transition font-bold text-sm">-</button>
                  <span class="w-8 text-center font-bold text-sm">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.product_id, item.quantity + 1)" class="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-300 hover:text-primary-600 transition font-bold text-sm">+</button>
                </div>
                <button @click="cart.removeItem(item.product_id)" class="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1 font-medium">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Remove
                </button>
              </div>
            </div>

            <!-- Subtotal -->
            <div class="text-right flex-shrink-0 pl-2">
              <p class="font-black text-gray-900">KES {{ formatPrice((item.discountedPrice ?? item.price) * item.quantity) }}</p>
              <p v-if="item.discountedPrice && item.discountedPrice < item.price" class="text-xs text-green-600 font-medium mt-0.5">
                Saved KES {{ formatPrice((item.price - item.discountedPrice) * item.quantity) }}
              </p>
            </div>
          </div>

          <!-- AI Optimizer widget — discounts the cart in place -->
          <div class="text-white p-5 rounded-2xl shadow-lg relative overflow-hidden" style="background: linear-gradient(135deg, #4a0e2b 0%, #7e1d4a 55%, #9c2c5c 100%);">
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none"></div>
            <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>

            <div class="relative">
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1">
                  <h3 class="font-bold flex items-center gap-2 mb-1 font-serif text-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                    AI Purchase Optimizer
                  </h3>
                  <p v-if="!optimized" class="text-sm text-rose-100/80">
                    Apply your <span class="font-bold capitalize">{{ auth.user?.tier || 'retail' }}</span> tier discount to everything in your cart.
                  </p>
                  <p v-else class="text-sm text-emerald-200 font-semibold">
                    ✓ Optimized! You saved KES {{ formatPrice(totalSavings) }} on this order.
                  </p>
                </div>
                <button
                  @click="optimizeCart"
                  :disabled="optimizing || cart.items.length === 0"
                  class="flex-shrink-0 bg-white text-rose-700 text-sm font-bold px-5 py-2.5 rounded-xl transition hover:shadow-lg disabled:opacity-50"
                >
                  <span v-if="optimizing" class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Optimizing…
                  </span>
                  <span v-else>{{ optimized ? 'Re-optimize' : 'Optimize Cart' }}</span>
                </button>
              </div>

              <!-- AI reasoning, shown after optimizing -->
              <div v-if="optimizeNote" class="mt-3 pt-3 border-t border-white/15">
                <p class="text-xs text-rose-100/90 leading-relaxed">{{ optimizeNote }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-2xl p-6 sticky top-24" style="border: 1px solid #ede9e3; box-shadow: 0 2px 16px rgba(45,10,31,0.06);">
            <h3 class="font-serif font-bold text-lg text-gray-900 mb-5">Order Summary</h3>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cart.itemCount }} items)</span>
                <span class="font-semibold text-gray-900">KES {{ formatPrice(cart.subtotal) }}</span>
              </div>
              <div v-if="totalSavings > 0" class="flex justify-between text-green-600">
                <span>AI Discount Savings</span>
                <span class="font-semibold">- KES {{ formatPrice(totalSavings) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>VAT (16%)</span>
                <span class="font-semibold text-gray-900">KES {{ formatPrice(cart.tax) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span class="font-semibold text-gray-900">KES 250.00</span>
              </div>
            </div>

            <div class="border-t border-[#ede9e3] mt-4 pt-4 flex justify-between items-center">
              <span class="font-bold text-gray-900 text-lg">Total</span>
              <span class="text-2xl font-black" style="color: #7e22ce;">KES {{ formatPrice(cart.total) }}</span>
            </div>

            <!-- Wallet balance hint -->
            <div v-if="auth.user?.wallet_balance > 0" class="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-xs text-green-700">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              <span>Wallet balance: <strong>KES {{ formatPrice(auth.user.wallet_balance) }}</strong></span>
            </div>

            <button
              @click="router.push('/checkout')"
              :disabled="cart.items.length === 0"
              class="btn-primary w-full mt-5 py-4 text-base"
            >
              Proceed to Checkout
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>

            <div class="mt-4 flex items-center justify-center gap-5 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Secure
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                M-Pesa / Wallet
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Free Returns
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { formatPrice } from '@/utils/formatters';
import { useToast } from 'vue-toast-notification';
import api from '@/services/api';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const optimizing  = ref(false);
const optimized   = ref(false);
const optimizeNote = ref('');

const totalSavings = computed(() => {
  return cart.items.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice < item.price) {
      return sum + (item.price - item.discountedPrice) * item.quantity;
    }
    return sum;
  }, 0);
});

// Send the first 6 cart items to the AI optimizer, which applies the user's
// tier discount, then write the discounted prices back into the cart.
const optimizeCart = async () => {
  if (cart.items.length === 0) return;
  if (!auth.user) {
    toast.info('Please log in to use AI optimization and unlock your tier discount.');
    return router.push('/login');
  }

  optimizing.value = true;
  try {
    const cartItems = cart.items.slice(0, 6).map(i => ({
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    // cartOnly:true → fast path, skips the heavy history/velocity work
    const { data } = await api.post('/ai/bulk-optimize', { cartItems, cartOnly: true });
    const optimizedItems = data.cartOptimized || [];

    if (optimizedItems.length === 0) {
      optimizeNote.value = data.tierInfo?.discountPercent === 0
        ? `You're at ${data.tierInfo?.tier || 'Starter'} level — place ${data.tierInfo?.ordersToNextTier || 3} order(s) to unlock your first loyalty discount.`
        : 'No discounts could be applied to your current cart items.';
      toast.info(optimizeNote.value);
      return;
    }

    // Write discounted prices back into the cart
    optimizedItems.forEach(opt => {
      const cartItem = cart.items.find(i => i.product_id === opt.productId);
      if (cartItem && opt.discountedPrice < opt.basePrice) {
        cart.applyDiscount(opt.productId, opt.discountedPrice, opt.discountPercent);
      }
    });

    optimized.value = true;
    const pct = data.tierInfo?.discountPercent || 0;
    optimizeNote.value = `${data.tierInfo?.tierEmoji || ''} ${data.tierInfo?.tier || 'Loyalty'} tier: ${pct}% applied to ${optimizedItems.length} item${optimizedItems.length > 1 ? 's' : ''}. The discount is locked in and will appear on your receipt.`;
    toast.success(`Saved KES ${Math.round(data.totalCartSavings || totalSavings.value)} with your ${data.tierInfo?.tier || 'loyalty'} discount!`);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Optimization failed. Please try again.');
  } finally {
    optimizing.value = false;
  }
};
</script>
