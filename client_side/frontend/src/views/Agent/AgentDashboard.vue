<template>
  <div class="min-h-screen" style="background: #1a0f00;">

    <!-- Amber/gold agent command header -->
    <div style="background: linear-gradient(135deg, #1a0f00 0%, #3d1f00 50%, #5a2e00 100%); position: relative; overflow: hidden; border-bottom: 1px solid rgba(245,158,11,0.15);">
      <div style="position:absolute;top:-60px;right:-40px;width:280px;height:280px;border-radius:50%;background:rgba(245,158,11,0.04);"></div>
      <div style="position:absolute;bottom:-50px;left:8%;width:200px;height:200px;border-radius:50%;background:rgba(251,191,36,0.03);"></div>
      <div class="container-custom relative z-10 py-12">
        <p class="text-amber-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Agent Commission Portal</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-5 justify-between">
          <div>
            <h1 class="font-serif text-4xl font-bold text-white leading-tight">Agent Dashboard</h1>
            <p class="text-amber-300/70 mt-2 text-sm">Your clients, commissions, and live order feed.</p>
          </div>
          <button @click="showAddClientModal = true"
            class="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl transition text-sm text-amber-950"
            style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            Register Client
          </button>
        </div>
      </div>
    </div>

    <div class="container-custom py-10 space-y-8">

      <!-- Stats Row — dark amber cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <!-- Total Clients -->
        <div class="rounded-2xl p-6 border transition hover:border-amber-500/40" style="background: #2a1800; border-color: rgba(245,158,11,0.15);">
          <p class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Total Clients</p>
          <p class="font-serif text-3xl font-bold text-white">{{ clients.length }}</p>
          <p class="text-xs text-amber-600 mt-2 font-medium">Registered businesses</p>
        </div>

        <!-- Commission Earned — gold highlight -->
        <div class="rounded-2xl p-6 border relative overflow-hidden" style="background: linear-gradient(135deg, #3d2200, #5c3300); border-color: rgba(245,158,11,0.3);">
          <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(245,158,11,0.07);"></div>
          <p class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Commission Earned</p>
          <p class="font-serif text-2xl font-bold text-amber-300">KES {{ formatPrice(totalCommission) }}</p>
          <p class="text-xs text-amber-600 mt-2">Ready to withdraw</p>
        </div>

        <!-- Active Orders -->
        <div class="rounded-2xl p-6 border transition hover:border-amber-500/40" style="background: #2a1800; border-color: rgba(245,158,11,0.15);">
          <p class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>Active Orders
          </p>
          <p class="font-serif text-3xl font-bold text-white">{{ activeOrdersCount }}</p>
          <p class="text-xs text-amber-600 mt-2 font-medium">Live tracking on</p>
        </div>

        <!-- Performance Tier -->
        <div class="rounded-2xl p-6 border transition hover:border-amber-500/40" style="background: #2a1800; border-color: rgba(245,158,11,0.15);">
          <p class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Performance Tier</p>
          <p class="font-serif text-3xl font-bold text-amber-400">Gold</p>
          <p class="text-xs text-amber-600 mt-2 font-medium">5% commission rate</p>
        </div>
      </div>

      <!-- Main two-column layout -->
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">

        <!-- LEFT: Client list — dark amber card -->
        <div class="xl:col-span-2 rounded-2xl border overflow-hidden" style="background: #2a1800; border-color: rgba(245,158,11,0.15);">
          <div class="px-5 py-4 border-b flex items-center justify-between" style="border-color: rgba(245,158,11,0.1); background: rgba(245,158,11,0.04);">
            <h3 class="font-serif font-bold text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              My Clients ({{ clients.length }})
            </h3>
            <div class="relative">
              <svg class="w-3.5 h-3.5 text-amber-700 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Search..." class="pl-7 pr-3 py-1.5 rounded-lg text-xs outline-none w-32 text-amber-100" style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);" />
            </div>
          </div>

          <div v-if="loading" class="divide-y" style="border-color: rgba(245,158,11,0.08);">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-4">
              <div class="w-9 h-9 rounded-full animate-pulse flex-shrink-0" style="background: rgba(245,158,11,0.1);"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 rounded animate-pulse w-2/3" style="background: rgba(245,158,11,0.08);"></div>
                <div class="h-2.5 rounded animate-pulse w-1/2" style="background: rgba(245,158,11,0.06);"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredClients.length === 0" class="py-10 text-center text-amber-800 text-sm">No clients found.</div>

          <div v-else class="max-h-[480px] overflow-y-auto">
            <div v-for="client in filteredClients" :key="client.id"
              class="flex items-center gap-3 px-5 py-3.5 transition group border-b"
              style="border-color: rgba(245,158,11,0.06);"
              @mouseover="e => e.currentTarget.style.background='rgba(245,158,11,0.04)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-amber-950 text-sm font-bold flex-shrink-0" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                {{ (client.business_name || client.username || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-amber-100 truncate">{{ client.business_name || client.username }}</p>
                <p class="text-xs text-amber-700 truncate">{{ client.phone || client.email }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="client.is_active !== false ? 'text-emerald-400' : 'text-red-400'" class="text-[10px] font-bold px-1.5 py-0.5 rounded-full border" :style="client.is_active !== false ? 'border-color: rgba(52,211,153,0.3);' : 'border-color: rgba(248,113,113,0.3);'">
                  {{ client.is_active !== false ? 'Active' : 'Inactive' }}
                </span>
                <button @click="initiateOrderForClient(client)" class="opacity-0 group-hover:opacity-100 text-xs text-amber-400 font-bold hover:text-amber-300 transition-opacity">Order</button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Live order feed -->
        <div class="xl:col-span-3 space-y-5">
          <div class="rounded-2xl border overflow-hidden" style="background: #2a1800; border-color: rgba(245,158,11,0.15);">
            <div class="px-5 py-4 border-b flex items-center justify-between" style="border-color: rgba(245,158,11,0.1); background: rgba(245,158,11,0.04);">
              <h3 class="font-serif font-bold text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Live Client Orders
                <span class="text-xs font-bold px-2 py-0.5 rounded-full text-amber-400 border" style="border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.08);">{{ liveOrders.length }}</span>
              </h3>
              <div class="flex items-center gap-2">
                <select v-model="orderFilter" class="text-xs rounded-lg px-2 py-1.5 outline-none text-amber-300" style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button @click="fetchData" class="p-1.5 text-amber-700 hover:text-amber-400 rounded-lg transition" title="Refresh">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
              </div>
            </div>

            <Transition name="slide-in">
              <div v-if="newOrderFlash" class="border-b px-5 py-2.5 flex items-center gap-2" style="background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.15);">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p class="text-xs font-bold text-emerald-400">New order from <span class="text-emerald-300">{{ newOrderFlash.clientName }}</span> — KES {{ formatPrice(newOrderFlash.totalAmount) }}</p>
              </div>
            </Transition>

            <div v-if="ordersLoading" class="divide-y" style="border-color: rgba(245,158,11,0.06);">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4">
                <div class="w-10 h-10 rounded-xl animate-pulse flex-shrink-0" style="background: rgba(245,158,11,0.08);"></div>
                <div class="flex-1 space-y-1.5">
                  <div class="h-3 rounded animate-pulse w-1/2" style="background: rgba(245,158,11,0.06);"></div>
                  <div class="h-2.5 rounded animate-pulse w-1/3" style="background: rgba(245,158,11,0.05);"></div>
                </div>
              </div>
            </div>
            <div v-else-if="filteredOrders.length === 0" class="py-14 text-center text-amber-800 text-sm">
              <svg class="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              No orders match this filter
            </div>
            <div v-else class="max-h-[520px] overflow-y-auto">
              <div v-for="order in filteredOrders" :key="order.id"
                class="flex items-start gap-4 px-5 py-4 transition border-b"
                style="border-color: rgba(245,158,11,0.07);"
                :style="order._isNew ? 'background: rgba(52,211,153,0.05);' : ''"
                @mouseover="e => { if (!order._isNew) e.currentTarget.style.background='rgba(245,158,11,0.03)'; }"
                @mouseleave="e => { if (!order._isNew) e.currentTarget.style.background='transparent'; }">
                <div :class="statusIconBg(order.status)" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="statusIcon(order.status)"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-bold text-amber-100">{{ order.clientName || order.User?.business_name || order.User?.username || 'Unknown' }}</p>
                    <span v-if="order._isNew" class="text-[10px] font-bold bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-400/30">NEW</span>
                  </div>
                  <p class="text-xs text-amber-800 mt-0.5">Order <span class="font-mono font-bold text-amber-600">#{{ (order.orderNumber || order.order_number || '').slice(0,12) }}</span> · {{ formatDateTime(order.createdAt) }}</p>
                  <p class="text-xs text-amber-800 mt-0.5">{{ order.itemCount || (order.OrderItems?.length) || 0 }} item(s) · {{ order.paymentMethod || order.payment_method }} · {{ order.deliveryChannel || order.delivery_channel }}</p>
                </div>
                <div class="flex-shrink-0 text-right">
                  <p class="text-sm font-black text-amber-300">KES {{ formatPrice(order.totalAmount || order.total_amount) }}</p>
                  <span :class="statusBadge(order.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{{ order.status }}</span>
                  <p :class="order.paymentStatus === 'completed' || order.payment_status === 'completed' ? 'text-emerald-400' : 'text-amber-500'" class="text-[10px] font-semibold mt-0.5">
                    {{ order.paymentStatus === 'completed' || order.payment_status === 'completed' ? 'Paid' : 'Awaiting payment' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Commission tip card -->
          <div class="rounded-2xl p-5 text-white relative overflow-hidden" style="background: linear-gradient(135deg, #3d1f00, #5a2e00); border: 1px solid rgba(245,158,11,0.2);">
            <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(245,158,11,0.08);"></div>
            <p class="text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">Commission Tip</p>
            <p class="text-sm text-amber-200 leading-relaxed relative z-10">
              Clients registered as <strong class="text-amber-300">Wholesale</strong> generate up to <strong class="text-amber-300">15% more commission</strong> due to higher average order values.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Client Modal -->
    <Modal :show="showAddClientModal" @close="showAddClientModal = false" title="Register New Client">
      <form @submit.prevent="registerClient" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
            <input v-model="newClient.business_name" type="text" required class="form-input" placeholder="e.g. Joy Salon" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Owner Name</label>
            <input v-model="newClient.username" type="text" required class="form-input" placeholder="Full name" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input v-model="newClient.email" type="email" required class="form-input" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <input v-model="newClient.phone" type="tel" required class="form-input" placeholder="0712..." />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Business Type</label>
            <select v-model="newClient.business_type" class="form-input">
              <option value="salon">Salon</option>
              <option value="beauty_shop">Beauty Shop</option>
              <option value="freelance">Freelance</option>
              <option value="distributor">Distributor</option>
              <option value="mall">Mall</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">Temporary Password</label>
          <input v-model="newClient.password" type="password" required class="form-input" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAddClientModal = false" class="btn-outline flex-1 py-3">Cancel</button>
          <button type="submit" :disabled="isSubmitting" class="btn-primary flex-1 py-3">
            <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
            {{ isSubmitting ? 'Registering...' : 'Complete Registration' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { formatPrice, formatDate, formatDateTime } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'
import Modal from '@/components/common/Modal.vue'
import { getSocket } from '@/services/socket'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const clients = ref([])
const liveOrders = ref([])
const totalCommission = ref(0)
const activeOrdersCount = ref(0)
const searchQuery = ref('')
const orderFilter = ref('all')
const showAddClientModal = ref(false)
const isSubmitting = ref(false)
const loading = ref(true)
const ordersLoading = ref(true)
const newOrderFlash = ref(null)
let flashTimeout = null

const newClient = ref({
  username: '', email: '', password: 'Password123!', phone: '',
  business_name: '', business_type: 'salon'
})

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter(c =>
    c.username?.toLowerCase().includes(q) ||
    c.business_name?.toLowerCase().includes(q) ||
    c.phone?.includes(q)
  )
})

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return liveOrders.value
  return liveOrders.value.filter(o => o.status === orderFilter.value)
})

const statusIcon = (s) => {
  const icons = {
    pending:    'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    paid:       'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    processing: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    dispatched: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
    delivered:  'M5 13l4 4L19 7',
    cancelled:  'M6 18L18 6M6 6l12 12',
  }
  return icons[s] || icons.pending
}

const statusIconBg = (s) => {
  const map = { pending: 'bg-amber-400', paid: 'bg-green-500', processing: 'bg-blue-500', dispatched: 'bg-purple-500', delivered: 'bg-emerald-500', cancelled: 'bg-red-400' }
  return map[s] || 'bg-gray-400'
}

const statusBadge = (s) => {
  const map = { pending: 'bg-amber-100 text-amber-700', paid: 'bg-green-100 text-green-700', processing: 'bg-blue-100 text-blue-700', dispatched: 'bg-purple-100 text-purple-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' }
  return map[s] || 'bg-gray-100 text-gray-600'
}

const fetchData = async () => {
  try {
    const [clientsRes, statsRes] = await Promise.all([
      api.get('/agents/clients'),
      api.get('/agents/stats')
    ])
    clients.value = clientsRes.data || []
    loading.value = false

    const stats = statsRes.data || {}
    totalCommission.value = parseFloat(stats.total_commission || 0)
    activeOrdersCount.value = stats.active_orders || 0

    if (stats.recent_orders) {
      liveOrders.value = stats.recent_orders.map(o => ({
        ...o,
        clientName: o.User?.business_name || o.User?.username || 'Unknown'
      }))
    }
    ordersLoading.value = false
  } catch (error) {
    console.error('Failed to fetch agent data:', error)
    loading.value = false
    ordersLoading.value = false
  }
}

const registerClient = async () => {
  isSubmitting.value = true
  try {
    await api.post('/agents/clients', newClient.value)
    toast.success('Client registered successfully!')
    showAddClientModal.value = false
    newClient.value = { username: '', email: '', password: 'Password123!', phone: '', business_name: '', business_type: 'salon' }
    fetchData()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed')
  } finally {
    isSubmitting.value = false
  }
}

const initiateOrderForClient = (client) => {
  localStorage.setItem('ordering_for_client', JSON.stringify(client))
  toast.info(`Now ordering for ${client.business_name || client.username}`)
  router.push('/products')
}

let socketListeners = []

const setupSocket = () => {
  const socket = getSocket()
  if (!socket) return

  const onNewOrder = (data) => {
    // Only show if the order belongs to one of this agent's clients
    const clientIds = clients.value.map(c => c.id)
    if (data.agentId !== auth.user?.id && !clientIds.includes(data.userId)) return

    const newEntry = {
      id: data.id,
      orderNumber: data.orderNumber,
      order_number: data.orderNumber,
      total_amount: data.totalAmount,
      totalAmount: data.totalAmount,
      status: data.status,
      paymentStatus: data.paymentStatus,
      payment_status: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      payment_method: data.paymentMethod,
      deliveryChannel: data.deliveryChannel,
      delivery_channel: data.deliveryChannel,
      itemCount: data.itemCount,
      clientName: data.clientName,
      createdAt: data.createdAt,
      _isNew: true
    }
    liveOrders.value.unshift(newEntry)
    activeOrdersCount.value++

    // Flash the new order banner
    newOrderFlash.value = data
    clearTimeout(flashTimeout)
    flashTimeout = setTimeout(() => {
      newOrderFlash.value = null
      // Remove the _isNew flag after animation
      const idx = liveOrders.value.findIndex(o => o.id === data.id)
      if (idx !== -1) liveOrders.value[idx]._isNew = false
    }, 5000)
  }

  const onOrderUpdate = (data) => {
    const idx = liveOrders.value.findIndex(o => o.id === data.orderId || o.order_number === data.orderNumber)
    if (idx !== -1) {
      liveOrders.value[idx] = { ...liveOrders.value[idx], status: data.status }
    }
    // Refresh full stats when status changes
    fetchData()
  }

  socket.on('newOrder', onNewOrder)
  socket.on('orderUpdate', onOrderUpdate)
  socketListeners = [['newOrder', onNewOrder], ['orderUpdate', onOrderUpdate]]
}

onMounted(() => {
  fetchData()
  setupSocket()
})

onBeforeUnmount(() => {
  const socket = getSocket()
  if (socket) socketListeners.forEach(([event, fn]) => socket.off(event, fn))
  clearTimeout(flashTimeout)
})
</script>

<style scoped>
.slide-in-enter-active { transition: all 0.3s ease; }
.slide-in-leave-active { transition: all 0.2s ease; }
.slide-in-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-in-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
