<template>
  <div class="container-custom py-8">
    <h1 class="text-3xl font-bold mb-8">My Wallet</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-2">Current Balance</h2>
        <p class="text-4xl font-bold">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
        <button @click="showTopUp = true" class="mt-4 bg-white text-primary-600 px-4 py-2 rounded hover:bg-gray-100">
          Top Up Wallet
        </button>
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
    <Modal :show="showTopUp" @close="showTopUp = false">
      <h2 class="text-xl font-bold mb-4">Top Up Wallet</h2>
      <Input v-model="topUpAmount" type="number" label="Amount (KES)" placeholder="Enter amount" />
      <div class="flex gap-3 mt-6">
        <Button @click="showTopUp = false" variant="secondary">Cancel</Button>
        <Button @click="topUpWallet" :disabled="topUpLoading">Top Up</Button>
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
const topUpAmount = ref('')
const topUpLoading = ref(false)

const topUpWallet = async () => {
  if (!topUpAmount.value || topUpAmount.value <= 0) {
    toast.error('Please enter a valid amount')
    return
  }
  
  topUpLoading.value = true
  try {
    const { data } = await api.post('/wallet/topup', { amount: topUpAmount.value })
    toast.success('Wallet topped up successfully!')
    
    // Update auth store with new balance and persist to localStorage
    auth.updateUser({ wallet_balance: data.balance })
    
    showTopUp.value = false
    topUpAmount.value = ''
    fetchTransactions()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to top up')
  } finally {
    topUpLoading.value = false
  }
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
