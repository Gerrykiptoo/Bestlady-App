<template>
  <div class="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="space-y-6">
      <!-- 1. Delivery Options -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">1. Delivery Method</h2>
        <div class="grid grid-cols-2 gap-4">
          <div @click="delivery = 'private_rider'; pickupStationId = ''" :class="delivery === 'private_rider' ? 'border-primary-500 bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="font-bold">Private Rider</div>
            <div class="text-xs text-gray-500">Fast home delivery</div>
          </div>
          <div @click="delivery = 'pickup'; deliveryAddress = ''; deliveryLat = null; deliveryLng = null" :class="delivery === 'pickup' ? 'border-primary-500 bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="font-bold">Pickup Station</div>
            <div class="text-xs text-gray-500">Collect at warehouse</div>
          </div>
        </div>

        <!-- Private Rider Fields -->
        <div v-if="delivery === 'private_rider'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-orange-200 animate-fade-in">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Address *</label>
          <textarea 
            v-model="deliveryAddress"
            placeholder="Street, building, apartment, landmark..."
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
            :required="delivery === 'private_rider'"
          ></textarea>
          
          <div class="mt-3">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Pick Location on Map (optional)</label>
            <button
              type="button"
              @click="openMapPicker"
              :class="deliveryLat && deliveryLng
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-orange-100 text-orange-700 border border-orange-300'"
              class="px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 hover:opacity-80"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ deliveryLat && deliveryLng ? '📍 Location Pinned – Change' : '🗺️ Pin on Map' }}
            </button>
            <div v-if="deliveryLat && deliveryLng" class="text-xs text-green-600 mt-2 flex items-center gap-1">
              ✅ {{ deliveryLat.toFixed(5) }}, {{ deliveryLng.toFixed(5) }}
            </div>
          </div>
        </div>

        <!-- Pickup Station Fields -->
        <div v-if="delivery === 'pickup'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-blue-200 animate-fade-in">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Select Pickup Station *</label>
          <select 
            v-model="pickupStationId"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            :required="delivery === 'pickup'"
          >
            <option value="">Choose a station...</option>
            <option v-for="station in stations" :key="station.id" :value="station.id">
              {{ station.name }} – {{ station.address }}
            </option>
          </select>
          <p v-if="stations.length === 0" class="text-xs text-gray-500 mt-2">No pickup stations available. Please contact support.</p>
        </div>
      </section>

      <!-- 2. Payment Method -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">2. Payment Method</h2>
        <div class="space-y-3">
          <div @click="payment = 'mpesa'" :class="payment === 'mpesa' ? 'border-green-600 bg-green-50' : 'border-gray-200'" class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">M</div>
              <span class="font-bold">M-Pesa STK Push</span>
            </div>
            <span v-if="payment === 'mpesa'" class="text-green-600 font-bold">✓</span>
          </div>

          <!-- Phone Number Input for M-Pesa -->
          <div v-if="payment === 'mpesa'" class="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-green-300 animate-fade-in">
            <label class="block text-sm font-semibold text-gray-700 mb-2">M-Pesa Phone Number</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+254</span>
              <input 
                v-model="phoneNumber" 
                type="tel" 
                placeholder="712345678" 
                class="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <p class="text-[10px] text-gray-500 mt-2">Enter the number you'll receive the payment prompt on.</p>
          </div>

          <div @click="payment = 'wallet'" :class="payment === 'wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'" class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">W</div>
              <span class="font-bold text-gray-800">Digital Wallet (KES {{ formatPrice(auth.user?.wallet_balance || 0) }})</span>
            </div>
            <span v-if="payment === 'wallet'" class="text-blue-600 font-bold">✓</span>
          </div>
        </div>
      </section>

      <!-- 3. Final Total & Place Order -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="flex justify-between items-center mb-6">
          <span class="text-gray-500 font-medium">Grand Total</span>
          <span class="text-2xl font-black text-primary-500">KES {{ formatPrice(cart.total) }}</span>
        </div>
        <button @click="placeOrder" :disabled="loading" class="w-full py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 disabled:opacity-50 transition shadow-lg hover:shadow-xl">
          {{ loading ? 'Processing Order...' : 'Confirm & Place Order' }}
        </button>
      </section>
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
          'w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl',
          modalType === 'success' ? 'bg-green-100 text-green-600' : 
          modalType === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
        ]">
          <span v-if="modalType === 'success'">✅</span>
          <span v-else-if="modalType === 'warning'">⏳</span>
          <span v-else>❌</span>
        </div>
        
        <p class="text-gray-600 mb-8 px-4">{{ modalMessage }}</p>
        
        <div class="space-y-3 px-4">
          <button
            @click="handleModalClose"
            class="w-full py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition shadow-md"
          >
            Go to Dashboard
          </button>
          <button 
            v-if="createdOrderId"
            @click="$router.push(`/orders/${createdOrderId}`)"
            class="w-full py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
          >
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

// Modal state
const showModal = ref(false);
const modalType = ref('success');
const modalTitle = ref('');
const modalMessage = ref('');
const createdOrderId = ref(null);

// New delivery fields
const deliveryAddress = ref('');
const deliveryLat = ref(null);
const deliveryLng = ref(null);
const pickupStationId = ref('');
const stations = ref([]);

const placeOrder = async () => {
  // Validate delivery fields
  if (delivery.value === 'private_rider' && !deliveryAddress.value.trim()) {
    return toast.error('Please enter a delivery address');
  }
  if (delivery.value === 'pickup' && !pickupStationId.value) {
    return toast.error('Please select a pickup station');
  }

  if (payment.value === 'mpesa' && !phoneNumber.value) {
    return toast.error('Please enter your M-Pesa phone number');
  }

  if (payment.value === 'wallet' && auth.user?.wallet_balance < cart.total) {
    return toast.error('Insufficient wallet balance');
  }

  loading.value = true;
  try {
    const { data: order } = await api.post('/orders', {
      items: cart.items,
      payment_method: payment.value,
      delivery_channel: delivery.value,
      ...(delivery.value === 'private_rider' && {
        delivery_address: deliveryAddress.value,
        delivery_lat: deliveryLat.value,
        delivery_lng: deliveryLng.value
      }),
      ...(delivery.value === 'pickup' && {
        pickup_station_id: pickupStationId.value
      })
    });

    createdOrderId.value = order.id;

    if (payment.value === 'mpesa') {
      try {
        await api.post(`/payment/stkpush`, {
          orderId: order.id,
          amount: cart.total,
          phone: phoneNumber.value
        });
        modalType.value = 'warning';
        modalTitle.value = 'Payment Initiated';
        modalMessage.value = 'Your order has been created. Please check your phone for the M-Pesa PIN prompt to complete payment.';
      } catch (stkErr) {
        console.error('STK push failed but order was created:', stkErr);
        modalType.value = 'warning';
        modalTitle.value = 'Order Created';
        modalMessage.value = 'Order created, but we couldn\'t send the M-Pesa prompt. You can try paying again from the Order Details page.';
      }
    } else {
      modalType.value = 'success';
      modalTitle.value = 'Success!';
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

const handleModalClose = () => {
  showModal.value = false;
  router.push('/dashboard');
};

// Fetch pickup stations on mount
onMounted(async () => {
  try {
    const { data } = await api.get('/stations')
    stations.value = data
  } catch (error) {
    console.error('Failed to fetch stations:', error);
  }
});

const showMapModal = ref(false);
const openMapPicker = () => { showMapModal.value = true; };
const onMapConfirm = ({ lat, lng, address }) => {
  deliveryLat.value = lat;
  deliveryLng.value = lng;
  if (address && !deliveryAddress.value) deliveryAddress.value = address;
  showMapModal.value = false;
  toast.success('Delivery location pinned!');
};
</script>
