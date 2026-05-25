<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Brand header -->
    <div class="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-4 shadow-md">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="font-black text-base">AI Bulk Order Review</p>
            <p class="text-xs text-white/70">Personalized recommendations at discounted prices</p>
          </div>
        </div>
        <div v-if="tierInfo" class="text-right">
          <p class="text-xs text-white/70">Your Tier</p>
          <p class="font-bold">{{ tierInfo.tierEmoji }} {{ tierInfo.tier }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">

      <!-- No recommendations -->
      <div v-if="!recommendations.length" class="text-center py-20">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">No Recommendations Yet</h2>
        <p class="text-gray-400 text-sm mb-6">Place a few orders first so BestLady AI can learn your buying patterns and generate personalized bulk recommendations.</p>
        <router-link to="/products" class="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition shadow">
          Browse Products
        </router-link>
      </div>

      <template v-else>
        <!-- Loyalty tier banner -->
        <div v-if="tierInfo && tierInfo.discountPercent > 0" class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
          <span class="text-3xl">{{ tierInfo.tierEmoji }}</span>
          <div>
            <p class="font-bold text-amber-800">{{ tierInfo.tier }} Loyalty Discount Applied</p>
            <p class="text-sm text-amber-600">{{ tierInfo.discountPercent }}% off all recommended items based on your {{ tierInfo.completedOrders }} completed orders</p>
          </div>
        </div>

        <!-- Recommendations list -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <h2 class="font-bold text-gray-800">Recommended Items</h2>
          </div>

          <div class="divide-y divide-gray-50">
            <div v-for="(rec, idx) in recommendations" :key="idx" class="px-6 py-4 flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-black text-lg flex-shrink-0">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-800">{{ rec.productName }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Based on {{ rec.totalPastOrders }} past orders · {{ rec.reasoning }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-sm font-black text-purple-700">{{ rec.recommendedQuantity }} units</span>
                  <div v-if="rec.discountPercent > 0" class="flex items-center gap-1.5">
                    <span class="text-xs line-through text-gray-300">KES {{ formatPrice(rec.basePrice ?? rec.discountedPrice) }}</span>
                    <span class="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-{{ rec.discountPercent }}%</span>
                    <span class="text-sm font-bold text-green-700">KES {{ formatPrice(rec.discountedPrice) }}</span>
                  </div>
                  <div v-else class="text-sm font-bold text-gray-700">KES {{ formatPrice(rec.discountedPrice) }}</div>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="font-black text-gray-800">KES {{ formatPrice((rec.discountedPrice ?? rec.basePrice) * rec.recommendedQuantity) }}</p>
                <p v-if="rec.totalSavings > 0" class="text-xs text-green-600 font-semibold mt-0.5">Save KES {{ formatPrice(rec.totalSavings) }}</p>
              </div>
            </div>
          </div>

          <!-- Order total -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Subtotal ({{ recommendations.length }} products)</span>
              <span>KES {{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>VAT (16%)</span><span>KES {{ formatPrice(subtotal * 0.16) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Delivery</span><span>{{ delivery === 'pickup' ? 'FREE' : 'KES 250' }}</span>
            </div>
            <div v-if="totalSaved > 0" class="flex justify-between text-sm font-semibold text-green-600 bg-green-50 -mx-6 px-6 py-2">
              <span>Total AI Savings</span><span>- KES {{ formatPrice(totalSaved) }}</span>
            </div>
            <div class="flex justify-between font-black text-xl text-gray-800 pt-2 border-t border-gray-200">
              <span>Order Total</span>
              <span class="text-purple-700">KES {{ formatPrice(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Method -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Delivery Method
          </h2>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div @click="delivery = 'pickup'; deliveryAddress = ''" :class="delivery === 'pickup' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'" class="p-4 border-2 rounded-xl cursor-pointer transition">
              <p class="font-bold text-gray-800 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Pickup
              </p>
              <p class="text-xs text-gray-500 mt-0.5">Free · Collect at warehouse</p>
            </div>
            <div @click="delivery = 'private_rider'" :class="delivery === 'private_rider' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'" class="p-4 border-2 rounded-xl cursor-pointer transition">
              <p class="font-bold text-gray-800 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                Home Delivery
              </p>
              <p class="text-xs text-gray-500 mt-0.5">KES 250 · Fast delivery</p>
            </div>
          </div>

          <div v-if="delivery === 'private_rider'" class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Delivery Address</label>
            <textarea v-model="deliveryAddress" rows="2" placeholder="Street, building, apartment, landmark..."
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none text-sm"></textarea>
          </div>

          <div v-if="delivery === 'pickup'">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Pickup Station</label>
            <select v-model="pickupStationId" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all bg-white text-sm">
              <option value="">Choose a station...</option>
              <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name }} – {{ s.address }}</option>
            </select>
          </div>
        </div>

        <!-- M-Pesa Phone -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div class="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white font-black text-xs">M</div>
            M-Pesa Phone Number
          </h2>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+254</span>
            <input v-model="phoneNumber" type="tel" placeholder="712 345 678"
              class="w-full pl-16 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-all text-lg font-semibold tracking-wider" />
          </div>
          <p class="text-xs text-gray-400 mt-2">You'll receive an M-Pesa STK push to confirm payment after placing the order.</p>
        </div>

        <!-- Place Order CTA -->
        <button @click="placeOrder" :disabled="placing || !canPlace"
          class="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl transition shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3">
          <div v-if="placing" class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          {{ placing ? 'Placing Order...' : `Place Bulk Order · KES ${formatPrice(grandTotal)}` }}
        </button>

        <p class="text-center text-xs text-gray-400">
          By placing this order you confirm the quantities and prices shown above.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import api from '@/services/api';
import { useToast } from 'vue-toast-notification';
import { formatPrice } from '@/utils/formatters';

const router = useRouter();
const auth = useAuthStore();
const cart = useCartStore();
const toast = useToast();

// Passed via router state from AI chat
const routerState = history.state;
const recommendations = ref(routerState?.recommendations ?? []);
const tierInfo = ref(routerState?.tierInfo ?? null);

const delivery = ref('pickup');
const deliveryAddress = ref('');
const pickupStationId = ref('');
const phoneNumber = ref('');
const stations = ref([]);
const placing = ref(false);

const subtotal = computed(() =>
  recommendations.value.reduce((s, r) => s + (r.discountedPrice ?? r.basePrice) * r.recommendedQuantity, 0)
);
const totalSaved = computed(() =>
  recommendations.value.reduce((s, r) => s + (r.totalSavings ?? 0), 0)
);
const grandTotal = computed(() => {
  const sub = subtotal.value;
  return sub + sub * 0.16 + (delivery.value === 'pickup' ? 0 : 250);
});

const canPlace = computed(() => {
  if (!phoneNumber.value.trim()) return false;
  if (delivery.value === 'private_rider' && !deliveryAddress.value.trim()) return false;
  if (delivery.value === 'pickup' && !pickupStationId.value) return false;
  return recommendations.value.length > 0;
});

const placeOrder = async () => {
  placing.value = true;
  try {
    const items = recommendations.value.map(r => ({
      product_id: r.productId,
      quantity: r.recommendedQuantity,
      discountedPrice: r.discountedPrice,
      discountPercent: r.discountPercent
    }));

    const payload = {
      items,
      payment_method: 'mpesa',
      delivery_channel: delivery.value,
      ...(delivery.value === 'private_rider' && { delivery_address: deliveryAddress.value }),
      ...(delivery.value === 'pickup' && { pickup_station_id: pickupStationId.value })
    };

    const { data: order } = await api.post('/orders', payload);

    // Fire STK push immediately
    try {
      await api.post('/payment/stkpush', {
        orderId: order.id,
        amount: order.total_amount,
        phone: phoneNumber.value
      });
      toast.success('Order placed! Check your phone for the M-Pesa PIN prompt.');
    } catch {
      toast.warning('Order created but STK push failed. You can pay from the order page.');
    }

    // Clear cart since we placed directly
    cart.clear();

    // Navigate to the rich payment page
    router.push(`/payment/${order.id}`);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
  } finally {
    placing.value = false;
  }
};

onMounted(async () => {
  // Pre-fill phone
  if (auth.user?.phone) {
    const p = String(auth.user.phone).replace(/[^0-9]/g, '');
    phoneNumber.value = p.startsWith('254') ? p.slice(3) : p.startsWith('0') ? p.slice(1) : p;
  }
  // Load stations
  try {
    const { data } = await api.get('/stations');
    stations.value = data;
    if (data.length > 0) pickupStationId.value = data[0].id;
  } catch { /* silent */ }
});
</script>
