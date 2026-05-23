<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-8">My Wallet</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-2">Current Balance</h2>
        <p class="text-4xl font-bold">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
        <div class="flex gap-2 mt-4">
          <button @click="showTopUp = true" class="bg-white text-primary-600 px-4 py-2 rounded hover:bg-gray-100 font-semibold text-sm">
            Top Up Wallet
          </button>
          <button @click="downloadTransactionsPDF" class="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-sm font-semibold flex items-center gap-1 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            PDF
          </button>
        </div>
      </div>
      
      <!-- Transactions -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Transaction History</h2>
        
        <div v-if="loading" class="text-center py-8">
          <Loader />
        </div>
        
        <div v-else-if="transactions.length === 0" class="text-center py-8 text-gray-500">
          No transactions yet
        </div>
        
        <div v-else class="space-y-3">
          <div v-for="tx in transactions" :key="tx.id" class="flex justify-between items-center border-b pb-3">
            <div>
              <p class="font-semibold capitalize">{{ tx.transaction_type }}</p>
              <p class="text-sm text-gray-500">{{ formatDateTime(tx.createdAt) }}</p>
              <p v-if="tx.notes" class="text-xs text-gray-400">{{ tx.notes }}</p>
            </div>
            <div :class="tx.transaction_type === 'deposit' ? 'text-green-600' : 'text-red-600'">
              {{ tx.transaction_type === 'deposit' ? '+' : '-' }} KES {{ formatPrice(tx.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Top Up Modal -->
    <Modal :show="showTopUp" @close="closeTopUp" title="Top Up Wallet">
      <div v-if="topUpSent" class="text-center py-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Payment Prompt Sent!</h3>
        <p class="text-gray-500 text-sm mb-2">Check your phone <strong>{{ topUpPhone }}</strong> for the M-Pesa PIN prompt.</p>
        <p class="text-gray-400 text-xs mb-6">Your wallet balance will update automatically once confirmed.</p>
        <button @click="closeTopUp" class="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition">Done</button>
      </div>

      <div v-else class="space-y-5">
        <!-- Quick amount presets -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Quick Select Amount</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="preset in [500, 1000, 2000, 5000]" :key="preset"
              @click="topUpAmount = preset"
              :class="topUpAmount === preset ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'"
              class="py-2 text-sm font-semibold border-2 rounded-lg transition"
            >
              {{ preset.toLocaleString() }}
            </button>
          </div>
        </div>

        <!-- Custom amount -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Amount (KES)</label>
          <input
            v-model.number="topUpAmount"
            type="number"
            min="10"
            placeholder="Or enter custom amount"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Phone number -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">M-Pesa Phone</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+254</span>
            <input
              v-model="topUpPhone"
              type="tel"
              placeholder="712345678"
              class="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Defaults to your account phone if left blank.</p>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          You will receive an M-Pesa STK push. Enter your PIN to confirm. Wallet updates within seconds.
        </div>

        <div class="flex gap-3">
          <button @click="closeTopUp" class="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
            Cancel
          </button>
          <button @click="topUpWallet" :disabled="topUpLoading || !topUpAmount"
            class="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition disabled:opacity-50">
            {{ topUpLoading ? 'Initiating...' : `Top Up KES ${(topUpAmount || 0).toLocaleString()}` }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'
import Loader from '@/components/common/Loader.vue'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import { formatPrice, formatDateTime } from '@/utils/formatters'

const auth = useAuthStore()
const toast = useToast()
const transactions = ref([])
const loading = ref(true)
const showTopUp = ref(false)
const topUpAmount = ref(null)
const topUpPhone = ref('')
const topUpLoading = ref(false)
const topUpSent = ref(false)

const closeTopUp = () => {
  showTopUp.value = false;
  topUpSent.value = false;
  topUpAmount.value = null;
  topUpPhone.value = '';
}

const topUpWallet = async () => {
  if (!topUpAmount.value || topUpAmount.value < 10) {
    toast.error('Please enter a valid amount (min KES 10)');
    return;
  }

  topUpLoading.value = true;
  try {
    const payload = { amount: topUpAmount.value };
    if (topUpPhone.value.trim()) payload.phone = topUpPhone.value.trim();

    await api.post('/wallet/topup', payload);
    topUpSent.value = true;
    fetchTransactions();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to initiate top-up');
  } finally {
    topUpLoading.value = false;
  }
}

const downloadTransactionsPDF = async () => {
  const res = await api.get('/wallet/export/pdf', { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `wallet_transactions_${Date.now()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

const fetchTransactions = async () => {
  try {
    const { data } = await api.get('/wallet/transactions')
    transactions.value = data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>
