<template>
  <div class="min-h-screen" style="background: #faf9f7;">
    <!-- Top brand bar -->
    <div class="bg-primary-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span class="font-black text-lg tracking-tight">BestLady Beauty</span>
      </div>
      <div class="text-xs text-white/70 flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
        Secured Payment
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-4 py-8">

      <!-- Loading -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded-lg w-1/2"></div>
        <div class="h-40 bg-gray-200 rounded-2xl"></div>
        <div class="h-32 bg-gray-200 rounded-2xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p class="text-gray-500 text-sm">{{ error }}</p>
      </div>

      <!-- Payment Confirmed -->
      <div v-else-if="order && (order.payment_status === 'completed' || paid)" class="text-center py-10">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">Payment Confirmed!</h2>
        <p class="text-gray-500 mb-1">Order <span class="font-bold text-primary-600">#{{ order.order_number }}</span></p>
        <p class="text-3xl font-black text-green-600 mb-6">KES {{ formatPrice(order.total_amount) }}</p>
        <p class="text-sm text-gray-400 mb-8">Thank you for shopping with BestLady Beauty. Your order is now being processed.</p>
        <router-link v-if="isLoggedIn" :to="`/orders/${order.id}`" class="btn-primary px-8 py-3">
          View Order Details
        </router-link>
      </div>

      <!-- Order + Payment Form -->
      <div v-else-if="order" class="space-y-6">

        <!-- Order Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Order Reference</p>
              <p class="text-xl font-black text-gray-800">#{{ order.order_number }}</p>
              <p class="text-sm text-gray-400 mt-1">{{ formatDateTime(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                order.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                order.payment_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
              ]">{{ order.payment_status }}</span>
              <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                {{ order.delivery_channel === 'pickup' ? 'Pickup Station' : 'Private Rider' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Itemized Receipt -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <h2 class="font-bold text-gray-800">Itemized Receipt</h2>
            <span class="ml-auto text-xs text-gray-400">{{ order.OrderItems?.length }} item(s)</span>
          </div>

          <div class="divide-y divide-gray-50">
            <div v-for="item in order.OrderItems" :key="item.id" class="px-6 py-4 flex gap-4 items-start">
              <!-- Product image -->
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img v-if="item.Product?.image_url" :src="item.Product.image_url" class="w-full h-full object-cover" />
                <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">{{ item.Product?.name || 'Beauty Product' }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Qty: {{ item.quantity }}</p>

                <!-- Discount callout -->
                <div v-if="item.discount_percent > 0 && item.original_price" class="mt-1 flex items-center gap-2">
                  <span class="text-xs line-through text-gray-300">KES {{ formatPrice(item.original_price) }}</span>
                  <span class="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-{{ item.discount_percent }}% OFF</span>
                </div>
              </div>

              <div class="text-right flex-shrink-0">
                <p class="font-black text-gray-800">KES {{ formatPrice(item.subtotal) }}</p>
                <p class="text-xs text-gray-400">@ KES {{ formatPrice(item.unit_price) }}</p>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="px-6 py-4 bg-gray-50 space-y-2 border-t border-gray-100">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>KES {{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>VAT (16%)</span><span>KES {{ formatPrice(order.tax) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Delivery Fee</span><span>{{ parseFloat(order.delivery_fee) === 0 ? 'FREE' : 'KES ' + formatPrice(order.delivery_fee) }}</span>
            </div>
            <!-- Total discount saved -->
            <div v-if="totalSaved > 0" class="flex justify-between text-sm font-semibold text-green-600 bg-green-50 -mx-6 px-6 py-2">
              <span>You Save (AI Discount)</span><span>- KES {{ formatPrice(totalSaved) }}</span>
            </div>
            <div class="flex justify-between font-black text-lg text-gray-800 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span class="text-primary-600">KES {{ formatPrice(order.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- M-Pesa Payment -->
        <div v-if="order.payment_status !== 'completed'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div class="w-7 h-7 bg-green-600 rounded flex items-center justify-center text-white font-black text-xs">M</div>
            <h2 class="font-bold text-gray-800">Pay with M-Pesa</h2>
          </div>

          <div class="px-6 py-5 space-y-4">
            <!-- Polling state -->
            <div v-if="isPolling" class="text-center py-6">
              <div class="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p class="font-semibold text-gray-800">Waiting for M-Pesa confirmation...</p>
              <p class="text-sm text-gray-400 mt-1">Check your phone for the PIN prompt. Keep this page open.</p>
              <button @click="stopPolling" class="mt-4 text-xs text-gray-400 underline">Cancel</button>
            </div>

            <template v-else>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">M-Pesa Phone Number</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+254</span>
                  <input
                    v-model="phone"
                    type="tel"
                    placeholder="712 345 678"
                    class="w-full pl-16 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-0 outline-none transition-all text-lg font-semibold tracking-wider"
                    :disabled="paying"
                  />
                </div>
                <p class="text-xs text-gray-400 mt-1">Enter the number that will receive the payment prompt</p>
              </div>

              <button
                @click="payNow"
                :disabled="paying || !phone"
                class="btn-success w-full py-4 text-lg"
              >
                <div v-if="paying" class="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                {{ paying ? 'Sending prompt...' : `Pay KES ${formatPrice(order.total_amount)}` }}
              </button>

              <p class="text-center text-xs text-gray-400">
                You will receive an M-Pesa STK push. Enter your PIN to complete payment.
              </p>
            </template>
          </div>
        </div>

        <!-- Security note -->
        <div class="flex items-center justify-center gap-2 text-xs text-gray-400 py-2">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
          Secured by BestLady Beauty · Powered by Safaricom M-Pesa
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const order = ref(null)
const loading = ref(true)
const paying = ref(false)
const isPolling = ref(false)
const paid = ref(false)
const error = ref('')
const phone = ref('')
let pollTimer = null

const isLoggedIn = computed(() => auth.isAuthenticated)

const totalSaved = computed(() => {
  if (!order.value?.OrderItems) return 0;
  return order.value.OrderItems.reduce((sum, item) => {
    if (item.discount_percent > 0 && item.original_price) {
      return sum + (parseFloat(item.original_price) - parseFloat(item.unit_price)) * item.quantity;
    }
    return sum;
  }, 0);
});

const formatDateTime = (dt) => {
  if (!dt) return '';
  return new Date(dt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' });
};

const loadOrder = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get(`/orders/public/${route.params.id}`);
    order.value = data;
    // Pre-fill phone from auth user if logged in
    if (auth.user?.phone) {
      const p = String(auth.user.phone).replace(/[^0-9]/g, '');
      phone.value = p.startsWith('254') ? p.slice(3) : p.startsWith('0') ? p.slice(1) : p;
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to load this order';
  } finally {
    loading.value = false;
  }
};

const startPolling = () => {
  isPolling.value = true;
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try {
      const { data } = await api.get(`/orders/public/${route.params.id}`);
      if (data.payment_status === 'completed') {
        stopPolling();
        paid.value = true;
        toast.success('Payment confirmed! Thank you.');
      }
    } catch { /* silent */ }
  }, 4000);

  // Auto-stop after 3 minutes
  setTimeout(() => { if (isPolling.value) stopPolling(); }, 180000);
};

const stopPolling = () => {
  isPolling.value = false;
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
};

const payNow = async () => {
  if (!phone.value) { toast.error('Please enter your M-Pesa number'); return; }
  paying.value = true;
  try {
    await api.post('/payment/stkpush', {
      orderId: order.value.id,
      amount: order.value.total_amount,
      phone: phone.value
    });
    toast.success('STK push sent — check your phone for the M-Pesa PIN prompt');
    startPolling();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Payment initiation failed. Please try again.');
  } finally {
    paying.value = false;
  }
};

onMounted(loadOrder);
onUnmounted(stopPolling);
</script>
