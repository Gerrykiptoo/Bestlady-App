<template>
  <div class="container-custom py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 class="text-2xl font-bold mb-4">Payment Gateway</h1>

      <div v-if="loading" class="text-center py-8">Loading order...</div>
      <div v-else-if="error" class="text-red-600 py-4">{{ error }}</div>

      <div v-else-if="order">
        <p class="text-sm text-gray-500">Order #{{ order.order_number }}</p>
        <p class="text-lg font-semibold mt-2">
          Total: KES {{ formatPrice(order.total_amount) }}
        </p>

        <div class="mt-6">
          <label class="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
          <input
            v-model="phone"
            type="tel"
            class="w-full border rounded-lg px-3 py-2"
            placeholder="07XXXXXXXX"
          />
        </div>

        <button
          class="mt-4 bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
          :disabled="paying"
          @click="payNow"
        >
          {{ paying ? 'Sending STK Push...' : 'Pay Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const order = ref(null)
const loading = ref(true)
const paying = ref(false)
const error = ref('')
const phone = ref('')

const loadOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/orders/public/${route.params.id}`)
    order.value = data
  } catch (err) {
    error.value = err.response?.data?.message || 'Unable to load order for payment'
  } finally {
    loading.value = false
  }
}

const payNow = async () => {
  if (!phone.value) {
    toast.error('Please enter phone number')
    return
  }
  paying.value = true
  try {
    await api.post('/payment/stkpush', {
      orderId: order.value.id,
      amount: order.value.total_amount,
      phone: phone.value
    })
    toast.success('STK push sent. Complete payment on your phone.')
    router.push(`/orders/${order.value.id}`)
  } catch (err) {
    toast.error(err.response?.data?.message || 'Payment failed')
  } finally {
    paying.value = false
  }
}

onMounted(loadOrder)
</script>
