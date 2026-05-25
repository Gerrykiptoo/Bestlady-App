<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page hero -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Agent Portal</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="text-3xl font-black text-white">Agent Partner Portal</h1>
            <p class="text-white/70 mt-1 text-sm">Manage clients, track orders, and earn commissions in real time.</p>
          </div>
          <button @click="showAddClientModal = true"
            class="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            Register Client
          </button>
        </div>
      </div>
    </div>

    <div class="container-custom py-8 space-y-8">

      <!-- Stats row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-5">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Clients</p>
          <p class="text-3xl font-black text-gray-800">{{ clients.length }}</p>
          <p class="text-xs text-green-600 mt-1 font-medium">All registered businesses</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Commission Earned</p>
          <p class="text-3xl font-black text-gray-800">KES {{ formatPrice(totalCommission) }}</p>
          <p class="text-xs text-gray-400 mt-1">Available for withdrawal</p>
        </div>
        <div class="card p-5 border-l-4 border-primary-500">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
            Active Orders
          </p>
          <p class="text-3xl font-black text-gray-800">{{ activeOrdersCount }}</p>
          <p class="text-xs text-primary-600 mt-1 font-medium">Live tracking enabled</p>
        </div>
        <div class="card p-5">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Performance Tier</p>
          <p class="text-3xl font-black text-gray-800">Gold</p>
          <p class="text-xs text-purple-600 mt-1 font-medium">5% commission rate</p>
        </div>
      </div>

      <!-- Main two-column layout -->
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">

        <!-- LEFT: Client list -->
        <div class="xl:col-span-2 card overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              My Clients ({{ clients.length }})
            </h3>
            <div class="relative">
              <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Search..." class="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-300 outline-none w-32" />
            </div>
          </div>

          <div v-if="loading" class="divide-y divide-gray-50">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-4">
              <div class="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0"></div>
              <div class="flex-1 space-y-1.5">
                <div class="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                <div class="h-2.5 bg-gray-100 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredClients.length === 0" class="py-10 text-center text-gray-400 text-sm">No clients found.</div>

          <div v-else class="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
            <div v-for="client in filteredClients" :key="client.id"
              class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition group">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style="background: linear-gradient(135deg, #7e22ce, #db2777)">
                {{ (client.business_name || client.username || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ client.business_name || client.username }}</p>
                <p class="text-xs text-gray-400 truncate">{{ client.phone || client.email }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="client.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {{ client.is_active !== false ? 'Active' : 'Inactive' }}
                </span>
                <button @click="initiateOrderForClient(client)" class="opacity-0 group-hover:opacity-100 text-xs text-primary-600 font-bold hover:underline transition-opacity">Order</button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Live order feed -->
        <div class="xl:col-span-3 space-y-4">
          <div class="card overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-gray-800 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Client Orders
                <span class="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ liveOrders.length }}</span>
              </h3>
              <div class="flex items-center gap-2">
                <select v-model="orderFilter" class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-300 outline-none">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button @click="fetchData" class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition" title="Refresh">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
              </div>
            </div>

            <!-- New order flash banner -->
            <Transition name="slide-in">
              <div v-if="newOrderFlash" class="bg-green-50 border-b border-green-100 px-5 py-2.5 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p class="text-xs font-bold text-green-700">New order received from <span class="text-green-800">{{ newOrderFlash.clientName }}</span> — KES {{ formatPrice(newOrderFlash.totalAmount) }}</p>
              </div>
            </Transition>

            <div v-if="ordersLoading" class="divide-y divide-gray-50">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-4">
                <div class="w-10 h-10 rounded-xl bg-gray-100 animate-pulse flex-shrink-0"></div>
                <div class="flex-1 space-y-1.5">
                  <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                  <div class="h-2.5 bg-gray-100 rounded animate-pulse w-1/3"></div>
                </div>
                <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
              </div>
            </div>
            <div v-else-if="filteredOrders.length === 0" class="py-14 text-center text-gray-400 text-sm">
              <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              No orders yet for this filter
            </div>
            <div v-else class="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              <div v-for="order in filteredOrders" :key="order.id"
                class="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition"
                :class="order._isNew ? 'bg-green-50' : ''">
                <!-- Status icon -->
                <div :class="statusIconBg(order.status)" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="statusIcon(order.status)"/>
                  </svg>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-bold text-gray-800">{{ order.clientName || order.User?.business_name || order.User?.username || 'Unknown' }}</p>
                    <span v-if="order._isNew" class="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">NEW</span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">Order <span class="font-mono font-bold text-gray-600">#{{ (order.orderNumber || order.order_number || '').slice(0,12) }}</span> · {{ formatDateTime(order.createdAt) }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ order.itemCount || (order.OrderItems?.length) || 0 }} item(s) · {{ order.paymentMethod || order.payment_method }} · {{ order.deliveryChannel || order.delivery_channel }}</p>
                </div>
                <!-- Amount + status -->
                <div class="flex-shrink-0 text-right">
                  <p class="text-sm font-black text-gray-900">KES {{ formatPrice(order.totalAmount || order.total_amount) }}</p>
                  <span :class="statusBadge(order.status)" class="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{{ order.status }}</span>
                  <p :class="order.paymentStatus === 'completed' || order.payment_status === 'completed' ? 'text-green-600' : 'text-amber-600'" class="text-[10px] font-semibold mt-0.5">
                    {{ order.paymentStatus === 'completed' || order.payment_status === 'completed' ? 'Paid' : 'Awaiting payment' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Commission summary card -->
          <div class="p-5 rounded-2xl text-white shadow-lg relative overflow-hidden" style="background: linear-gradient(135deg, #7e22ce 0%, #9333ea 60%, #db2777 100%)">
            <div class="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full"></div>
            <p class="text-sm font-bold text-white/80 mb-1">Agent Tip</p>
            <p class="text-sm text-white/90 leading-relaxed relative z-10">
              Registering clients as <strong>Wholesale</strong> earns you up to <strong>15% more commission</strong> due to higher order volumes.
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
