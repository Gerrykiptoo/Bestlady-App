<template>
  <div class="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div class="space-y-6">
      <!-- 1. Delivery Options -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">1. Delivery Method</h2>
        <div class="grid grid-cols-2 gap-4">
          <div @click="delivery = 'private_rider'" :class="delivery === 'private_rider' ? 'border-primary bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="font-bold">Private Rider</div>
            <div class="text-xs text-gray-500">Fast home delivery</div>
          </div>
          <div @click="delivery = 'pickup'" :class="delivery === 'pickup' ? 'border-primary bg-orange-50' : 'border-gray-200'" class="p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="font-bold">Pickup Station</div>
            <div class="text-xs text-gray-500">Collect at warehouse</div>
          </div>
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
          <div @click="payment = 'wallet'" :class="payment === 'wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'" class="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">W</div>
              <span class="font-bold text-gray-800">Digital Wallet (KES {{ auth.user?.wallet_balance || 0 }})</span>
            </div>
            <span v-if="payment === 'wallet'" class="text-blue-600 font-bold">✓</span>
          </div>
        </div>
      </section>

      <!-- 3. Final Total & Place Order -->
      <section class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="flex justify-between items-center mb-6">
          <span class="text-gray-500 font-medium">Grand Total</span>
          <span class="text-2xl font-black text-primary">KES {{ cart.total }}</span>
        </div>
        <button @click="placeOrder" :disabled="loading" class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition">
          {{ loading ? 'Processing Order...' : 'Confirm & Place Order' }}
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useToast } from 'vue-toast-notification';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const delivery = ref('private_rider');
const payment = ref('mpesa');
const loading = ref(false);

const placeOrder = async () => {
  if (payment.value === 'wallet' && auth.user?.wallet_balance < cart.total) {
    return toast.error('Insufficient wallet balance');
  }

  loading.value = true;
  try {
    const { data: order } = await api.post('/orders', {
      items: cart.items,
      payment_method: payment.value,
      delivery_channel: delivery.value
    });

    if (payment.value === 'mpesa') {
      await api.post(`/payment/stkpush`, {
        orderId: order.id,
        amount: cart.total,
        phone: auth.user.phone
      });
      toast.success('STK Push sent! Please enter your PIN on your phone.');
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
</script>
