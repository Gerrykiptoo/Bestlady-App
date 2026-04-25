<template>
  <div class="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="space-y-6">
      <!-- 1. Delivery Options -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">1. Delivery Method</h2>
        <div class="grid grid-cols-2 gap-4">
          <div @click="delivery = 'private_rider'; pickupStationId = ''" :class="delivery === 'private_rider' ? 'border-primary bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="font-bold">Private Rider</div>
            <div class="text-xs text-gray-500">Fast home delivery</div>
          </div>
          <div @click="delivery = 'pickup'; deliveryAddress = ''; deliveryLat = null; deliveryLng = null" :class="delivery === 'pickup' ? 'border-primary bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
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
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
              {{ deliveryLat && deliveryLng ? 'Re-pick Location' : 'Select on Map' }}
            </button>
            <div v-if="deliveryLat && deliveryLng" class="text-xs text-green-600 mt-2">
              ✅ Location selected: {{ deliveryLat.toFixed(4) }}, {{ deliveryLng.toFixed(4) }}
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
          <span class="text-2xl font-black text-primary">KES {{ formatPrice(cart.total) }}</span>
        </div>
        <button @click="placeOrder" :disabled="loading" class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition">
          {{ loading ? 'Processing Order...' : 'Confirm & Place Order' }}
        </button>
      </section>
    </div>
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

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const delivery = ref('private_rider');
const payment = ref('mpesa');
const phoneNumber = ref(auth.user?.phone || '');
const loading = ref(false);

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

    if (payment.value === 'mpesa') {
      try {
        await api.post(`/payment/stkpush`, {
          orderId: order.id,
          amount: cart.total,
          phone: phoneNumber.value
        });
        toast.success('STK Push initiated! Check your phone.');
      } catch (stkErr) {
        console.error('STK push failed but order was created:', stkErr);
        toast.warning('Order created, but payment prompt failed. You can try again from Order Details.');
      }
    } else {
      toast.success('Order placed successfully via wallet!');
    }

    cart.clear();
    router.push('/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error placing order');
  } finally {
    loading.value = false;
  }
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

const openMapPicker = () => {
  // Placeholder: In production, integrate with map service
  toast.info('Map picker will open here. Using sample coordinates for now.')
  deliveryLat.value = -1.2921;
  deliveryLng.value = 36.8219;
};
</script>
