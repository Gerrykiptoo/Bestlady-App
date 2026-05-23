<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Logistics Command</h1>
        <p class="text-slate-500 mt-1">Manage shipments, inventory alerts, and order fulfillment.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex -space-x-2">
          <div class="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold">JD</div>
          <div class="h-10 w-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">GK</div>
        </div>
        <span class="text-sm font-medium text-slate-600">Logistics Team Active</span>
      </div>
    </div>

    <!-- Live Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div @click="openModal('pending')" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Pending Action</span>
        </div>
        <p class="text-3xl font-black text-slate-800">{{ stats.pendingOrders }}</p>
        <p class="text-sm text-slate-500 font-medium mt-1">New Orders to Process</p>
      </div>

      <div @click="openModal('processing')" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">In Fulfillment</span>
        </div>
        <p class="text-3xl font-black text-slate-800">{{ stats.processingOrders }}</p>
        <p class="text-sm text-slate-500 font-medium mt-1">Orders Being Packed</p>
      </div>

      <div @click="openModal('ready')" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Ready for Pickup</span>
        </div>
        <p class="text-3xl font-black text-slate-800">{{ stats.readyOrders }}</p>
        <p class="text-sm text-slate-500 font-medium mt-1">Waiting for Dispatch</p>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Shipments -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Recent Shipping Activity</h3>
            <button @click="fetchStats" class="text-xs text-blue-600 font-bold hover:underline">Refresh Feed</button>
          </div>
          <div class="divide-y divide-slate-50">
            <div v-for="order in recentOrders" :key="order.id" class="p-4 hover:bg-slate-50 transition flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                  #{{ order.order_number?.slice(-2) }}
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-800">Order #{{ order.order_number }}</p>
                  <p class="text-xs text-slate-500">{{ order.user?.business_name || 'Individual Customer' }}</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="getStatusClass(order.status)" class="text-[10px] font-black uppercase px-2 py-1 rounded-md">
                  {{ order.status }}
                </span>
                <p class="text-[10px] text-slate-400 mt-1">{{ formatDate(order.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Alerts -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Low Stock Alerts
          </h3>
          <div class="space-y-3">
            <div v-for="item in lowStockItems" :key="item.id" class="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <div class="flex items-center gap-3">
                <img :src="item.image_url" class="h-8 w-8 rounded-lg object-cover" />
                <div>
                  <p class="text-xs font-bold text-slate-800">{{ item.name }}</p>
                  <p class="text-[10px] text-red-600 font-medium">Stock: {{ item.current_stock }} {{ item.unit }}</p>
                </div>
              </div>
              <button class="text-[10px] font-bold text-red-700 underline">Restock</button>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
          <h3 class="font-bold mb-2">Logistics Note</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Standard delivery window for Nairobi Metropolitan is 2 hours. Ensure all 'Ready' orders are dispatched before 4:00 PM today.
          </p>
        </div>
      </div>
    </div>

    <!-- Fulfillment Modal -->
    <Modal :show="showFulfillmentModal" @close="showFulfillmentModal = false" size="lg">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Fulfillment Queue: {{ currentFilter }}</h3>
          <div class="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-500">
            {{ filteredOrders.length }} Orders Found
          </div>
        </div>

        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div v-for="order in filteredOrders" :key="order.id" class="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 transition bg-slate-50/50">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="text-sm font-bold text-slate-800">Order #{{ order.order_number }}</p>
                <p class="text-xs text-slate-500">{{ order.delivery_channel }} | {{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-black text-slate-900">KES {{ formatPrice(order.total_amount) }}</p>
                <p class="text-[10px] font-bold text-blue-600">{{ order.payment_status }}</p>
              </div>
            </div>
            
            <div class="bg-white p-3 rounded-xl mb-4 text-[10px] border border-slate-100">
              <div v-for="item in order.OrderItems" :key="item.id" class="flex justify-between py-1 border-b border-slate-50 last:border-0">
                <span class="text-slate-600">{{ item.Product?.name }} x {{ item.quantity }}</span>
                <span class="font-bold">KES {{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>

            <div class="flex gap-2">
              <button v-if="order.status === 'pending'" @click="updateStatus(order.id, 'processing')" class="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                Start Packing
              </button>
              <button v-if="order.status === 'processing'" @click="updateStatus(order.id, 'ready')" class="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition">
                Mark as Ready
              </button>
              <button v-if="order.status === 'ready'" @click="updateStatus(order.id, 'dispatched')" class="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-black transition">
                Dispatch Order
              </button>
              <button class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useToast } from 'vue-toast-notification';
import Modal from '@/components/common/Modal.vue';
import { getSocket } from '@/services/socket';

const toast = useToast();
const stats = ref({
  pendingOrders: 0,
  processingOrders: 0,
  readyOrders: 0
});
const recentOrders = ref([]);
const lowStockItems = ref([]);
const showFulfillmentModal = ref(false);
const currentFilter = ref('pending');
const allOrders = ref([]);

const filteredOrders = computed(() => {
  return allOrders.value.filter(o => o.status === currentFilter.value);
});

const fetchStats = async () => {
  try {
    const { data } = await api.get('/staff/stats');
    stats.value = data.counts;
    recentOrders.value = data.recentOrders;
    lowStockItems.value = data.lowStock;
  } catch (error) {
    console.error('Failed to fetch staff stats:', error);
  }
};

const openModal = async (status) => {
  currentFilter.value = status;
  showFulfillmentModal.value = true;
  try {
    const { data } = await api.get(`/orders?status=${status}&limit=50`);
    allOrders.value = data;
  } catch (error) {
    toast.error('Failed to load orders');
  }
};

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status });
    toast.success(`Order #${orderId} updated to ${status}`);
    
    // Refresh local state
    allOrders.value = allOrders.value.filter(o => o.id !== orderId);
    fetchStats();
    
    if (filteredOrders.value.length === 0) {
      showFulfillmentModal.value = false;
    }
  } catch (error) {
    toast.error('Failed to update status');
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'ready': return 'bg-green-100 text-green-700';
    case 'dispatched': return 'bg-slate-100 text-slate-700';
    case 'delivered': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

onMounted(() => {
  fetchStats();
  const socket = getSocket();
  if (socket) {
    socket.on('orderUpdate', () => {
      fetchStats();
    });
    socket.on('newOrder', () => {
      fetchStats();
      toast.info('New order received!', { duration: 5000 });
    });
  }
});
</script>