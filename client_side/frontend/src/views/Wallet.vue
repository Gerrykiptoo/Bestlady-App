<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page hero -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Finance</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="text-3xl font-black text-white">My Wallet</h1>
            <p class="text-5xl font-black text-white mt-2">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
            <p class="text-white/60 text-sm mt-1">Available balance</p>
          </div>
          <div class="flex gap-3">
            <button @click="showTopUp = true" class="inline-flex items-center gap-1.5 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              Top Up
            </button>
            <button @click="downloadTransactionsPDF" class="btn-ghost-white text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-gray-800">Transaction History</h2>
          <span class="text-xs text-gray-400">{{ transactions.length }} transactions</span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-px">
          <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
            <div class="w-10 h-10 bg-gray-100 rounded-xl animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 bg-gray-100 rounded animate-pulse w-1/3"></div>
              <div class="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
            </div>
            <div class="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="transactions.length === 0" class="py-20 text-center">
          <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>
          <p class="text-gray-500 font-medium">No transactions yet</p>
          <p class="text-sm text-gray-400 mt-1">Top up your wallet to get started</p>
          <button @click="showTopUp = true" class="btn-primary mt-5">Top Up Now</button>
        </div>

        <!-- Transactions list -->
        <div v-else class="divide-y divide-gray-50">
          <div v-for="tx in transactions" :key="tx.id" class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <!-- Icon -->
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
              tx.transaction_type === 'deposit' ? 'bg-green-100' : 'bg-red-50'
            ]">
              <svg v-if="tx.transaction_type === 'deposit'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 capitalize">{{ tx.transaction_type }}</p>
              <p class="text-xs text-gray-400">{{ formatDateTime(tx.createdAt) }}</p>
              <p v-if="tx.notes" class="text-xs text-gray-500 truncate mt-0.5">{{ tx.notes }}</p>
            </div>
            <!-- Amount -->
            <div :class="['text-right font-black', tx.transaction_type === 'deposit' ? 'text-green-600' : 'text-red-500']">
              {{ tx.transaction_type === 'deposit' ? '+' : '-' }} KES {{ formatPrice(tx.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Up Modal -->
    <Modal :show="showTopUp" @close="closeTopUp" title="Top Up Wallet">
      <!-- Success state -->
      <div v-if="topUpSent" class="text-center py-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">Payment Prompt Sent!</h3>
        <p class="text-gray-500 text-sm mb-1">Check phone <strong>{{ topUpPhone || 'your number' }}</strong></p>
        <p class="text-gray-400 text-xs mb-6">Wallet updates automatically once confirmed.</p>
        <button @click="closeTopUp" class="btn-primary w-full py-3">Done</button>
      </div>

      <!-- Top up form -->
      <div v-else class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Quick Select</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="preset in [500, 1000, 2000, 5000]"
              :key="preset"
              @click="topUpAmount = preset"
              :class="topUpAmount === preset ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'"
              class="py-2.5 text-sm font-bold border-2 rounded-xl transition"
            >
              {{ preset.toLocaleString() }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Amount (KES)</label>
          <input v-model.number="topUpAmount" type="number" min="10" placeholder="Or enter custom amount" class="form-input" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">M-Pesa Phone</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">+254</span>
            <input v-model="topUpPhone" type="tel" placeholder="712 345 678" class="form-input pl-16" />
          </div>
          <p class="text-xs text-gray-400 mt-1">Leave blank to use your account phone number.</p>
        </div>

        <div class="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-sm text-primary-800 flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 text-primary-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <span>You'll receive an M-Pesa STK push. Enter your PIN to confirm. Wallet updates within seconds.</span>
        </div>

        <div class="flex gap-3">
          <button @click="closeTopUp" class="btn-outline flex-1 py-3">Cancel</button>
          <button
            @click="topUpWallet"
            :disabled="topUpLoading || !topUpAmount"
            class="btn-success flex-1 py-3"
          >
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
import Modal from '@/components/common/Modal.vue'
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
  showTopUp.value = false
  topUpSent.value = false
  topUpAmount.value = null
  topUpPhone.value = ''
}

const topUpWallet = async () => {
  if (!topUpAmount.value || topUpAmount.value < 10) return toast.error('Please enter a valid amount (min KES 10)')
  topUpLoading.value = true
  try {
    const payload = { amount: topUpAmount.value }
    if (topUpPhone.value.trim()) payload.phone = topUpPhone.value.trim()
    await api.post('/wallet/topup', payload)
    topUpSent.value = true
    fetchTransactions()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to initiate top-up')
  } finally {
    topUpLoading.value = false
  }
}

const downloadTransactionsPDF = async () => {
  const res = await api.get('/wallet/export/pdf', { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `wallet_${Date.now()}.pdf`
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

onMounted(() => fetchTransactions())
</script>
