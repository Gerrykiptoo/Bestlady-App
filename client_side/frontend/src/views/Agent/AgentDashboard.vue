<template>
  <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
          Agent Partner Portal
        </h1>
        <p class="text-gray-500 mt-1">Manage your clients, place orders, and track your commissions in real-time.</p>
      </div>
      <button @click="showAddClientModal = true" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 font-bold flex items-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Register New Client
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow-md p-6 border-b-4 border-primary-500">
        <p class="text-sm text-gray-500 font-medium">Total Clients</p>
        <p class="text-3xl font-bold text-gray-800">{{ clients.length }}</p>
        <p class="text-xs text-green-600 mt-1">↑ 2 new this week</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md p-6 border-b-4 border-green-500">
        <p class="text-sm text-gray-500 font-medium">Commission Earned</p>
        <p class="text-3xl font-bold text-gray-800">KES {{ formatPrice(totalCommission) }}</p>
        <p class="text-xs text-gray-400 mt-1">Available for withdrawal</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md p-6 border-b-4 border-blue-500">
        <p class="text-sm text-gray-500 font-medium">Active Client Orders</p>
        <p class="text-3xl font-bold text-gray-800">{{ activeOrdersCount }}</p>
        <p class="text-xs text-blue-600 mt-1">Real-time tracking active</p>
      </div>
      <div class="bg-white rounded-2xl shadow-md p-6 border-b-4 border-purple-500">
        <p class="text-sm text-gray-500 font-medium">Performance Tier</p>
        <p class="text-3xl font-bold text-gray-800">Gold</p>
        <p class="text-xs text-purple-600 mt-1">5% commission rate</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Client List -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-md overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              My Registered Clients
            </h3>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search clients..." class="text-xs border-gray-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-primary-500" />
              <svg class="h-4 w-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">Client Name</th>
                  <th class="px-6 py-4">Contact</th>
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-primary-50 transition cursor-default">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
                        {{ client.username?.charAt(0) || 'U' }}
                      </div>
                      <span class="font-bold text-gray-800">{{ client.business_name || client.username }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ client.phone || client.email }}</td>
                  <td class="px-6 py-4">
                    <span :class="client.role === 'wholesale' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {{ client.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="client.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {{ client.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <button @click="initiateOrderForClient(client)" class="text-primary-600 hover:text-primary-800 font-bold text-sm">
                      Place Order
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredClients.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">No clients found matching your search.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Recent Activity & Commissions -->
      <div class="space-y-6">
        <div class="bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Commissions
          </h3>
          <div class="space-y-4">
            <div v-for="order in recentClientOrders.slice(0, 5)" :key="order.id" class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p class="text-sm font-bold text-gray-800">Order #{{ order.order_number }}</p>
                <p class="text-[10px] text-gray-400">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-green-600">+KES {{ formatPrice(order.commission_earned || 0) }}</p>
                <p class="text-[10px] text-gray-500">{{ order.user?.business_name }}</p>
              </div>
            </div>
            <button class="w-full py-2 text-primary-600 font-bold text-xs hover:underline">View All Earnings →</button>
          </div>
        </div>

        <div class="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <h3 class="font-bold text-lg mb-2">Agent Tip</h3>
          <p class="text-sm text-primary-100">
            "Registering clients as <b>Wholesale</b> can earn you up to <b>15% more</b> in total commission due to higher order volumes!"
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Modal :show="showAddClientModal" @close="showAddClientModal = false">
      <div class="p-6">
        <h3 class="text-xl font-bold mb-4">Register New Client</h3>
        <form @submit.prevent="registerClient" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input v-model="newClient.business_name" type="text" required class="w-full border-gray-200 rounded-xl focus:ring-primary-500" placeholder="e.g. Joy Salon" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="newClient.username" type="text" required class="w-full border-gray-200 rounded-xl focus:ring-primary-500" placeholder="Owner Name" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input v-model="newClient.email" type="email" required class="w-full border-gray-200 rounded-xl focus:ring-primary-500" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input v-model="newClient.phone" type="tel" required class="w-full border-gray-200 rounded-xl focus:ring-primary-500" placeholder="0712..." />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
              <select v-model="newClient.role" class="w-full border-gray-200 rounded-xl focus:ring-primary-500">
                <option value="retail">Retail (Salon)</option>
                <option value="wholesale">Wholesale (Distributor)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input v-model="newClient.password" type="password" required class="w-full border-gray-200 rounded-xl focus:ring-primary-500" />
          </div>
          <button type="submit" :disabled="isSubmitting" class="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2">
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Registering...' : 'Complete Registration' }}
          </button>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useToast } from 'vue-toast-notification';
import Modal from '@/components/common/Modal.vue';
import { getSocket } from '@/services/socket';

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const clients = ref([]);
const recentClientOrders = ref([]);
const totalCommission = ref(0);
const activeOrdersCount = ref(0);
const searchQuery = ref('');
const showAddClientModal = ref(false);
const isSubmitting = ref(false);

const newClient = ref({
  username: '',
  email: '',
  password: 'Password123!',
  phone: '',
  role: 'retail',
  business_name: '',
  business_type: 'salon'
});

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  const query = searchQuery.value.toLowerCase();
  return clients.value.filter(c => 
    c.username?.toLowerCase().includes(query) || 
    c.business_name?.toLowerCase().includes(query) ||
    c.phone?.includes(query)
  );
});

const fetchData = async () => {
  try {
    const [clientsRes, statsRes] = await Promise.all([
      api.get('/agent/clients'),
      api.get('/agent/stats')
    ]);
    clients.value = clientsRes.data || [];
    totalCommission.value = statsRes.data?.totalCommission || 0;
    activeOrdersCount.value = statsRes.data?.activeOrders || 0;
    recentClientOrders.value = statsRes.data?.recentOrders || [];
  } catch (error) {
    console.error('Failed to fetch agent data:', error);
    // Mock data for demo if API fails
    clients.value = [
      { id: 1, username: 'Alice Smith', business_name: 'Glamour Salon', phone: '0712345678', role: 'retail', is_active: true },
      { id: 2, username: 'Bob Johnson', business_name: 'Elite Beauty', phone: '0722334455', role: 'wholesale', is_active: true }
    ];
  }
};

const registerClient = async () => {
  isSubmitting.value = true;
  try {
    await api.post('/agent/clients', newClient.value);
    toast.success('Client registered successfully!');
    showAddClientModal.value = false;
    newClient.value = { username: '', email: '', password: 'Password123!', phone: '', role: 'retail', business_name: '', business_type: 'salon' };
    fetchData();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
  } finally {
    isSubmitting.value = false;
  }
};

const initiateOrderForClient = (client) => {
  // Store selected client in a temporary state (perhaps a clientStore)
  // then navigate to products
  localStorage.setItem('ordering_for_client', JSON.stringify(client));
  toast.info(`Now ordering for ${client.business_name || client.username}`);
  router.push('/products');
};

const setupSocketListeners = () => {
  const socket = getSocket();
  if (!socket) return;
  socket.on('orderUpdate', (data) => {
    fetchData(); // Refresh all stats when an order status changes
  });
};

onMounted(() => {
  fetchData();
  setupSocketListeners();
});
</script>

<style scoped>
.bg-white {
  animation: slideIn 0.4s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>