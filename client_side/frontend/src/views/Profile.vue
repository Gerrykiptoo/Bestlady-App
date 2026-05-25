<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero banner with avatar -->
    <div class="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white">
      <div class="max-w-4xl mx-auto px-6 py-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar with upload button -->
          <div class="relative flex-shrink-0">
            <img
              :src="avatarPreview || auth.user?.avatar_url || '/default-avatar.png'"
              alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
              @error="handleAvatarError"
            />
            <label class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition" :class="{ 'opacity-60 cursor-not-allowed': uploading }">
              <svg v-if="!uploading" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else class="w-4 h-4 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <input type="file" @change="uploadAvatar" accept="image/*" class="hidden" :disabled="uploading" />
            </label>
          </div>

          <!-- Name + badges -->
          <div class="text-center sm:text-left flex-1">
            <h1 class="text-2xl font-bold">{{ auth.user?.nickname || auth.user?.username }}</h1>
            <p class="text-white/75 text-sm mt-0.5">{{ auth.user?.email }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide', tierInfo.badge]">
                {{ auth.user?.tier || 'retail' }}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/20 capitalize">{{ auth.user?.role || 'user' }}</span>
              <span v-if="auth.user?.agent_id" class="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/30">Agent ID: {{ auth.user.agent_id }}</span>
            </div>
          </div>

          <!-- Quick stats -->
          <div class="flex gap-6 text-center flex-shrink-0">
            <div>
              <p class="text-2xl font-black">{{ orderStats.total }}</p>
              <p class="text-xs text-white/70 mt-0.5">Orders</p>
            </div>
            <div class="border-l border-white/20 pl-6">
              <p class="text-2xl font-black">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
              <p class="text-xs text-white/70 mt-0.5">Wallet</p>
            </div>
            <div class="border-l border-white/20 pl-6">
              <p class="text-2xl font-black">{{ tierInfo.discount }}%</p>
              <p class="text-xs text-white/70 mt-0.5">AI Discount</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div class="max-w-4xl mx-auto px-6 flex gap-1 overflow-x-auto no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['py-4 px-3 text-sm font-semibold border-b-2 -mb-px transition whitespace-nowrap', activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
        >{{ tab.label }}</button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-8">

      <!-- ── Account Settings ── -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-bold text-gray-800 mb-5 text-lg">Account Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
              <input v-model="nickname" type="text" placeholder="Your display name" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input :value="auth.user?.email" type="email" disabled class="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p class="text-xs text-gray-400 mt-1">Contact support to change your email</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input :value="auth.user?.phone" type="text" disabled class="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <button
              @click="saveProfile"
              :disabled="saving"
              class="btn-primary w-full py-3"
            >
              <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <!-- Password change link -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <h4 class="font-semibold text-gray-800">Password</h4>
            <p class="text-sm text-gray-500 mt-0.5">Change your account password</p>
          </div>
          <router-link to="/forgot-password" class="text-sm text-primary-600 font-semibold hover:text-primary-700 transition">
            Reset Password →
          </router-link>
        </div>
      </div>

      <!-- ── Loyalty Tier ── -->
      <div v-if="activeTab === 'tier'">
        <div :class="['rounded-2xl p-7 border mb-6', tierInfo.card]">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest opacity-60">Your Loyalty Tier</p>
              <h2 class="text-4xl font-black mt-2">{{ (auth.user?.tier || 'retail').toUpperCase() }}</h2>
              <p class="text-sm mt-3 opacity-75 max-w-xs">{{ tierInfo.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold uppercase tracking-widest opacity-60">AI Discount</p>
              <p class="text-5xl font-black mt-1">{{ tierInfo.discount }}%</p>
            </div>
          </div>
          <div class="mt-6 h-2.5 bg-black/10 rounded-full overflow-hidden">
            <div :class="['h-full rounded-full transition-all duration-700', tierInfo.bar]" :style="{ width: tierInfo.progress + '%' }"></div>
          </div>
          <p class="text-xs opacity-60 mt-2">{{ tierInfo.progressLabel }}</p>
        </div>

        <!-- Tier table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-3 font-semibold text-gray-600">Tier</th>
                <th class="text-left px-5 py-3 font-semibold text-gray-600">Min Orders</th>
                <th class="text-left px-5 py-3 font-semibold text-gray-600">AI Discount</th>
                <th class="text-left px-5 py-3 font-semibold text-gray-600">Benefits</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tierTable" :key="t.name" :class="['border-b border-gray-50 last:border-0', t.name === (auth.user?.tier || 'retail') ? 'bg-primary-50' : '']">
                <td class="px-5 py-3 font-semibold">
                  <span class="flex items-center gap-2">
                    <span :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', t.color]"></span>
                    {{ t.name }}
                  </span>
                </td>
                <td class="px-5 py-3 text-gray-600">{{ t.minOrders }}+</td>
                <td class="px-5 py-3 font-bold text-green-600">{{ t.discount }}%</td>
                <td class="px-5 py-3 text-gray-600">{{ t.benefit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Recent Orders ── -->
      <div v-if="activeTab === 'orders'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-gray-800">Recent Orders</h3>
          <router-link to="/orders" class="text-sm text-primary-600 font-medium hover:underline">View All →</router-link>
        </div>

        <div v-if="ordersLoading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="bg-white rounded-xl h-20 animate-pulse border border-gray-100"></div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="bg-white rounded-2xl border border-gray-100 py-14 text-center">
          <p class="text-gray-500 mb-3">No orders yet</p>
          <router-link to="/products" class="btn-primary">
            Start Shopping
          </router-link>
        </div>

        <router-link
          v-else
          v-for="order in recentOrders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition group"
        >
          <div>
            <p class="font-bold text-gray-800 text-sm">#{{ String(order.id).slice(0, 8).toUpperCase() }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-center">
            <span :class="['text-xs font-semibold px-3 py-1 rounded-full', statusStyle(order.status)]">{{ order.status }}</span>
          </div>
          <div class="text-right">
            <p class="font-black text-gray-900">KES {{ formatPrice(order.total_amount) }}</p>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition ml-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </router-link>
      </div>

      <!-- ── Wallet ── -->
      <div v-if="activeTab === 'wallet'" class="space-y-5">
        <div class="bg-gradient-to-r from-purple-700 to-pink-600 rounded-2xl p-7 text-white shadow-lg">
          <p class="text-white/70 text-sm font-medium mb-1">Available Balance</p>
          <p class="text-5xl font-black">KES {{ formatPrice(auth.user?.wallet_balance || 0) }}</p>
          <div class="flex gap-3 mt-6">
            <router-link to="/wallet" class="bg-white text-purple-700 text-sm font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition">
              Top Up
            </router-link>
            <router-link to="/wallet" class="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition">
              Transactions
            </router-link>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <p class="text-gray-500 text-sm">View your complete transaction history and download PDF statements</p>
          <router-link to="/wallet" class="mt-3 inline-block text-primary-600 font-semibold text-sm hover:underline">
            Go to Wallet →
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useToast } from 'vue-toast-notification';
import { formatPrice } from '@/utils/formatters';

const auth = useAuthStore();
const toast = useToast();

const nickname = ref('');
const avatarPreview = ref('');
const saving = ref(false);
const uploading = ref(false);
const activeTab = ref('settings');
const ordersLoading = ref(false);
const recentOrders = ref([]);
const orderStats = ref({ total: 0 });

const tabs = [
  { id: 'settings', label: 'Account' },
  { id: 'tier', label: 'Loyalty Tier' },
  { id: 'orders', label: 'My Orders' },
  { id: 'wallet', label: 'Wallet' },
];

const tierTable = [
  { name: 'retail',    color: 'bg-amber-500',  minOrders: 0,  discount: 5,  benefit: 'AI recommendations with 5% off' },
  { name: 'silver',   color: 'bg-slate-500',   minOrders: 3,  discount: 8,  benefit: 'Priority support + 8% AI discount' },
  { name: 'gold',     color: 'bg-yellow-500',  minOrders: 10, discount: 12, benefit: 'Early access to new products + 12% off' },
  { name: 'platinum', color: 'bg-purple-600',  minOrders: 25, discount: 15, benefit: 'Maximum 15% AI discount + VIP service' },
  { name: 'wholesale',color: 'bg-blue-600',    minOrders: 0,  discount: 15, benefit: 'Wholesale pricing + 15% AI discount' },
];

const tierInfo = computed(() => {
  const tier = auth.user?.tier || 'retail';
  const map = {
    retail:    { badge: 'bg-amber-200/40 text-amber-100',  card: 'bg-amber-50 border-amber-200 text-amber-900',    bar: 'bg-amber-500',  discount: 5,  progress: 15,  progressLabel: '3+ orders to reach Silver',    description: 'Earn AI discounts on recommended products. 5% off every AI suggestion.' },
    silver:    { badge: 'bg-slate-200/40 text-slate-100',  card: 'bg-slate-50 border-slate-200 text-slate-900',    bar: 'bg-slate-500',  discount: 8,  progress: 45,  progressLabel: '10+ orders to reach Gold',     description: 'Enjoy 8% AI discount + priority customer support.' },
    gold:      { badge: 'bg-yellow-300/40 text-yellow-100',card: 'bg-yellow-50 border-yellow-200 text-yellow-900', bar: 'bg-yellow-500', discount: 12, progress: 75,  progressLabel: '25+ orders to reach Platinum', description: 'Early access to launches + 12% AI discount on all recommendations.' },
    platinum:  { badge: 'bg-purple-200/40 text-purple-100',card: 'bg-purple-50 border-purple-200 text-purple-900', bar: 'bg-purple-500', discount: 15, progress: 100, progressLabel: "You've reached the top tier!",  description: 'Maximum 15% AI discount. VIP service. You\'re in the elite.' },
    wholesale: { badge: 'bg-blue-200/40 text-blue-100',    card: 'bg-blue-50 border-blue-200 text-blue-900',       bar: 'bg-blue-500',   discount: 15, progress: 100, progressLabel: 'Wholesale pricing active',      description: 'Wholesale pricing + 15% AI discount on all recommendations.' },
  };
  return map[tier] || map.retail;
});

const statusStyle = (status) => {
  const map = {
    pending:    'bg-amber-100 text-amber-700',
    paid:       'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    dispatched: 'bg-purple-100 text-purple-700',
    delivered:  'bg-teal-100 text-teal-700',
    cancelled:  'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};

const loadOrders = async () => {
  ordersLoading.value = true;
  try {
    const { data } = await api.get('/orders?limit=5');
    recentOrders.value = data.orders || data || [];
    orderStats.value.total = data.total || recentOrders.value.length;
  } catch {}
  ordersLoading.value = false;
};

onMounted(() => {
  nickname.value = auth.user?.nickname || auth.user?.username || '';
  avatarPreview.value = auth.user?.avatar_url || '';
  loadOrders();
});

const saveProfile = async () => {
  saving.value = true;
  try {
    const { data } = await api.put('/users/profile', { nickname: nickname.value });
    auth.updateUser({ nickname: data.user.nickname, avatar_url: data.user.avatar_url });
    toast.success('Profile updated!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile');
  } finally {
    saving.value = false;
  }
};

const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    avatarPreview.value = data.avatar_url;
    auth.updateUser({ avatar_url: data.avatar_url });
    toast.success('Avatar updated!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to upload avatar');
  } finally {
    uploading.value = false;
    event.target.value = '';
  }
};

const handleAvatarError = (e) => { e.target.src = '/default-avatar.png'; };
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
