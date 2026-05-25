<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page header -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Almost There</p>
        <h1 class="text-3xl font-black text-white">Checkout</h1>
        <p class="text-white/70 mt-1 text-sm">{{ cart.itemCount }} items · KES {{ formatPrice(cart.total) }} total</p>
      </div>
    </div>

    <div class="container-custom py-8 max-w-2xl">
      <div class="space-y-5">

        <!-- 1. Delivery Method -->
        <section class="card p-6">
          <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style="background: var(--brand-gradient)">1</span>
            Delivery Method
          </h2>
          <div class="grid grid-cols-2 gap-3">
            <div
              @click="delivery = 'private_rider'; pickupStationId = ''"
              :class="delivery === 'private_rider' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-300' : 'border-gray-200 hover:border-gray-300'"
              class="p-4 border-2 rounded-xl cursor-pointer transition-all"
            >
              <div class="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div class="font-bold text-sm text-gray-800">Private Rider</div>
              <div class="text-xs text-gray-500 mt-0.5">Fast home delivery</div>
            </div>
            <div
              @click="delivery = 'pickup'; deliveryAddress = ''; deliveryLat = null; deliveryLng = null"
              :class="delivery === 'pickup' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-300' : 'border-gray-200 hover:border-gray-300'"
              class="p-4 border-2 rounded-xl cursor-pointer transition-all"
            >
              <div class="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div class="font-bold text-sm text-gray-800">Pickup Station</div>
              <div class="text-xs text-gray-500 mt-0.5">Collect at warehouse</div>
            </div>
          </div>

          <!-- Private Rider fields -->
          <div v-if="delivery === 'private_rider'" class="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
            <textarea
              v-model="deliveryAddress"
              placeholder="Street, building, apartment, landmark..."
              rows="2"
              class="form-input resize-none"
              :required="delivery === 'private_rider'"
            ></textarea>
            <div class="mt-3">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Pin on Map (optional)</label>
              <button
                type="button"
                @click="openMapPicker"
                :class="deliveryLat && deliveryLng ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'"
                class="px-4 py-2 rounded-xl border text-sm font-semibold transition flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ deliveryLat && deliveryLng ? 'Location Pinned – Change' : 'Pin on Map' }}
              </button>
              <p v-if="deliveryLat && deliveryLng" class="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                {{ deliveryLat.toFixed(5) }}, {{ deliveryLng.toFixed(5) }}
              </p>
            </div>
          </div>

          <!-- Pickup station fields -->
          <div v-if="delivery === 'pickup'" class="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Select Pickup Station *</label>
            <select v-model="pickupStationId" class="form-input" :required="delivery === 'pickup'">
              <option value="">Choose a station...</option>
              <option v-for="station in stations" :key="station.id" :value="station.id">
                {{ station.name }} – {{ station.address }}
              </option>
            </select>
            <p v-if="stations.length === 0" class="text-xs text-gray-500 mt-2">No pickup stations available. Please contact support.</p>
          </div>
        </section>

        <!-- 2. Payment Method -->
        <section class="card p-6">
          <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style="background: var(--brand-gradient)">2</span>
            Payment Method
          </h2>
          <div class="space-y-3">
            <!-- M-Pesa -->
            <div
              @click="payment = 'mpesa'"
              :class="payment === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
              class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-sm">M</div>
                <div>
                  <p class="font-bold text-sm text-gray-800">M-Pesa STK Push</p>
                  <p class="text-xs text-gray-500">Receive PIN prompt on your phone</p>
                </div>
              </div>
              <div :class="payment === 'mpesa' ? 'bg-green-500' : 'bg-gray-200'" class="w-5 h-5 rounded-full flex items-center justify-center transition-all">
                <svg v-if="payment === 'mpesa'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </div>
            </div>

            <!-- M-Pesa phone input -->
            <div v-if="payment === 'mpesa'" class="p-4 bg-green-50 rounded-xl border border-green-100">
              <label class="block text-sm font-semibold text-gray-700 mb-2">M-Pesa Phone Number</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">+254</span>
                <input v-model="phoneNumber" type="tel" placeholder="712 345 678" class="form-input pl-16" />
              </div>
              <p class="text-xs text-gray-500 mt-1.5">Enter the number you'll receive the M-Pesa prompt on.</p>
            </div>

            <!-- Wallet -->
            <div
              @click="payment = 'wallet'"
              :class="payment === 'wallet' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
              class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style="background: var(--brand-gradient)">W</div>
                <div>
                  <p class="font-bold text-sm text-gray-800">BestLady Wallet</p>
                  <p class="text-xs text-gray-500">Balance: KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
                </div>
              </div>
              <div :class="payment === 'wallet' ? 'bg-primary-500' : 'bg-gray-200'" class="w-5 h-5 rounded-full flex items-center justify-center transition-all">
                <svg v-if="payment === 'wallet'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Order Summary & Place Order -->
        <section class="card p-6">
          <h2 class="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style="background: var(--brand-gradient)">3</span>
            Order Summary
          </h2>
          <div class="space-y-2.5 text-sm text-gray-600 mb-5">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-900">KES {{ formatPrice(cart.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>VAT (16%)</span>
              <span class="font-semibold text-gray-900">KES {{ formatPrice(cart.tax) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery</span>
              <span class="font-semibold text-gray-900">KES 250.00</span>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-4 flex justify-between items-center mb-5">
            <span class="font-black text-gray-900 text-lg">Grand Total</span>
            <span class="text-2xl font-black text-primary-600">KES {{ formatPrice(cart.total) }}</span>
          </div>
          <button
            @click="placeOrder"
            :disabled="loading"
            class="btn-primary w-full py-4 text-base"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Processing Order...' : 'Confirm & Place Order' }}
          </button>
          <div class="flex items-center justify-center gap-5 mt-3 text-xs text-slate-400">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              256-bit Secure
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              M-Pesa &amp; Wallet
            </span>
          </div>
        </section>
      </div>
    </div>

    <!-- Map Picker Modal -->
    <MapPickerModal
      :show="showMapModal"
      :initial-lat="deliveryLat || -1.2921"
      :initial-lng="deliveryLng || 36.8219"
      @close="showMapModal = false"
      @confirm="onMapConfirm"
    />

    <!-- Success/Status Modal -->
    <Modal :show="showModal" @close="handleModalClose" :title="modalTitle" size="sm">
      <div class="text-center py-6">
        <div :class="[
          'w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl',
          modalType === 'success' ? 'bg-green-100' : modalType === 'warning' ? 'bg-amber-100' : 'bg-red-100'
        ]">
          <svg v-if="modalType === 'success'" class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <svg v-else-if="modalType === 'warning'" class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <svg v-else class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <p class="text-gray-600 mb-7 px-4">{{ modalMessage }}</p>
        <div class="space-y-3 px-4">
          <button @click="handleModalClose" class="btn-primary w-full py-3">
            Go to Dashboard
          </button>
          <button v-if="createdOrderId" @click="$router.push(`/orders/${createdOrderId}`)" class="btn-outline w-full py-3">
            View Order Details
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useToast } from 'vue-toast-notification';
import { formatPrice } from '@/utils/formatters';
import Modal from '@/components/common/Modal.vue';
import MapPickerModal from '@/components/common/MapPickerModal.vue';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const delivery = ref('private_rider');
const payment = ref('mpesa');
const phoneNumber = ref(auth.user?.phone || '');
const loading = ref(false);
const showModal = ref(false);
const modalType = ref('success');
const modalTitle = ref('');
const modalMessage = ref('');
const createdOrderId = ref(null);
const deliveryAddress = ref('');
const deliveryLat = ref(null);
const deliveryLng = ref(null);
const pickupStationId = ref('');
const stations = ref([]);
const showMapModal = ref(false);

const placeOrder = async () => {
  if (delivery.value === 'private_rider' && !deliveryAddress.value.trim()) return toast.error('Please enter a delivery address');
  if (delivery.value === 'pickup' && !pickupStationId.value) return toast.error('Please select a pickup station');
  if (payment.value === 'mpesa' && !phoneNumber.value) return toast.error('Please enter your M-Pesa phone number');
  if (payment.value === 'wallet' && auth.user?.wallet_balance < cart.total) return toast.error('Insufficient wallet balance');

  loading.value = true;
  try {
    const { data: order } = await api.post('/orders', {
      items: cart.items,
      payment_method: payment.value,
      delivery_channel: delivery.value,
      ...(delivery.value === 'private_rider' && { delivery_address: deliveryAddress.value, delivery_lat: deliveryLat.value, delivery_lng: deliveryLng.value }),
      ...(delivery.value === 'pickup' && { pickup_station_id: pickupStationId.value })
    });
    createdOrderId.value = order.id;

    if (payment.value === 'mpesa') {
      try {
        await api.post('/payment/stkpush', { orderId: order.id, amount: cart.total, phone: phoneNumber.value });
        modalType.value = 'warning';
        modalTitle.value = 'Payment Initiated';
        modalMessage.value = 'Order created! Check your phone for the M-Pesa PIN prompt to complete payment.';
      } catch {
        modalType.value = 'warning';
        modalTitle.value = 'Order Created';
        modalMessage.value = 'Order placed, but the M-Pesa prompt failed. Pay again from the Order Details page.';
      }
    } else {
      modalType.value = 'success';
      modalTitle.value = 'Order Placed!';
      modalMessage.value = 'Your order has been placed successfully using your wallet balance.';
    }
    cart.clear();
    showModal.value = true;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error placing order');
  } finally {
    loading.value = false;
  }
};

const handleModalClose = () => { showModal.value = false; router.push('/dashboard'); };
const openMapPicker = () => { showMapModal.value = true; };
const onMapConfirm = ({ lat, lng, address }) => {
  deliveryLat.value = lat;
  deliveryLng.value = lng;
  if (address && !deliveryAddress.value) deliveryAddress.value = address;
  showMapModal.value = false;
  toast.success('Location pinned!');
};

onMounted(async () => {
  try { const { data } = await api.get('/stations'); stations.value = data; } catch {}
});
</script>
