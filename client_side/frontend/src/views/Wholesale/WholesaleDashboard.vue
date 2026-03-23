<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Wholesale Partner Dashboard</h1>
        <p class="text-slate-600">Managing bulk operations for {{ auth.user?.business_name }}</p>
      </div>
      <div class="flex gap-4">
        <button class="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition">
          Bulk Upload CSV
        </button>
      </div>
    </header>

    <!-- Wholesale Specific Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Credit Limit -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <div class="text-indigo-600 font-bold text-sm mb-2 uppercase tracking-wider">Credit Availability</div>
        <div class="text-3xl font-black text-slate-800 mb-1">KES {{ auth.user?.credit_limit || '0.00' }}</div>
        <div class="w-full bg-slate-100 h-2 rounded-full mt-4">
          <div class="bg-indigo-500 h-2 rounded-full" style="width: 45%"></div>
        </div>
        <p class="text-xs text-slate-500 mt-2">45% of your credit limit used</p>
      </div>

      <!-- AI Bulk Recommendations -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
        <div class="text-amber-600 font-bold text-sm mb-2 uppercase tracking-wider">AI Optimizer</div>
        <p class="text-slate-700 text-sm mb-4 font-medium italic">"Order 50 more units of Cleanser to unlock 15% wholesale discount"</p>
        <button class="w-full py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition">
          Apply Optimization
        </button>
      </div>

      <!-- Fleet Tracking -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
        <div class="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wider">Live Logistics</div>
        <div class="flex items-center gap-3 mb-4">
          <div class="animate-pulse bg-blue-500 w-3 h-3 rounded-full"></div>
          <span class="text-slate-700 font-bold">1 Order Out for Delivery</span>
        </div>
        <div class="text-xs text-slate-500">Estimated arrival: 14:30 (Company Fleet)</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Demand Forecast -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="font-bold text-lg mb-6 text-slate-800">Regional Demand Forecast</h3>
        <div class="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border-dashed border-2">
          [Interactive Demand Heatmap Placeholder]
        </div>
      </div>

      <!-- Inventory Across Branches -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="font-bold text-lg mb-6 text-slate-800">Branch Inventory Health</h3>
        <div class="space-y-4">
          <div v-for="branch in branches" :key="branch.name" class="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <div>
              <div class="font-bold text-slate-800">{{ branch.name }}</div>
              <div class="text-xs text-slate-500">{{ branch.status }}</div>
            </div>
            <div :class="branch.health === 'Good' ? 'text-green-600' : 'text-red-600'" class="font-black">
              {{ branch.health }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const branches = ref([
  { name: 'Nairobi Central Mall', status: '85% Stocked', health: 'Good' },
  { name: 'Mombasa Plaza', status: '12% Stocked', health: 'Critical' },
  { name: 'Kisumu Junction', status: '92% Stocked', health: 'Good' }
]);
</script>
