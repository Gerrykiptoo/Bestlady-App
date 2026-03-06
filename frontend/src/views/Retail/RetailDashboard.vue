<template>
  <div class="p-6">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Retail Dashboard</h1>
        <p class="text-gray-600">Welcome back, {{ auth.user?.username }}</p>
      </div>
      <div class="flex gap-4">
        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          New Order
        </button>
      </div>
    </header>

    <!-- AI Assistant Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Low Stock Alerts -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
        <div class="flex items-center gap-2 text-orange-600 mb-3">
          <span class="font-semibold text-lg">⚠️ Stock Alerts</span>
        </div>
        <p class="text-sm text-gray-600 mb-4">Products running low based on your history.</p>
        <ul class="space-y-3">
          <li v-for="item in stockAlerts" :key="item.id" class="flex justify-between items-center">
            <span class="text-sm">{{ item.name }}</span>
            <span class="text-xs font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded">{{ item.stock }} left</span>
          </li>
        </ul>
      </div>

      <!-- Demand Insights -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
        <div class="flex items-center gap-2 text-blue-600 mb-3">
          <span class="font-semibold text-lg">📈 Demand Insights</span>
        </div>
        <p class="text-sm text-gray-600 mb-2">"This product is trending in your area"</p>
        <div class="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-800">
          Moisturizers are 20% more popular this month!
        </div>
      </div>

      <!-- Wallet & Budget -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-green-100">
        <div class="flex items-center gap-2 text-green-600 mb-3">
          <span class="font-semibold text-lg">💳 Wallet</span>
        </div>
        <div class="text-2xl font-bold text-gray-800 mb-1">KES {{ auth.user?.wallet_balance || '0.00' }}</div>
        <p class="text-xs text-gray-500 mb-4">You've saved KES 1,200 this month</p>
        <button @click="router.push('/wallet')" class="w-full py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
          Top Up Now
        </button>
      </div>
    </div>

    <!-- Recommendations -->
    <section>
      <h2 class="text-xl font-bold mb-4">AI Recommendations</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="bg-white p-3 rounded-lg shadow-sm border">
          <div class="w-full h-32 bg-gray-100 rounded mb-2"></div>
          <div class="font-medium text-sm mb-1">Recommended Product {{ n }}</div>
          <div class="text-primary font-bold text-sm">KES 450</div>
          <button class="mt-2 w-full py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const stockAlerts = ref([
  { id: 1, name: 'Facial Cleanser', stock: 3 },
  { id: 2, name: 'Hair Treatment', stock: 5 }
]);
</script>
