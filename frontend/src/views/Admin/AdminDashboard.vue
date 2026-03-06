<template>
  <div class="p-6">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Admin BI Dashboard</h1>
        <p class="text-gray-600">Overview of BestLady's performance</p>
      </div>
      <div class="flex gap-4">
        <button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          Export Report
        </button>
      </div>
    </header>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="metric in metrics" :key="metric.label" class="bg-white p-6 rounded-xl shadow-sm border">
        <div class="text-sm text-gray-500 mb-1">{{ metric.label }}</div>
        <div class="text-2xl font-bold" :class="metric.color">{{ metric.value }}</div>
        <div class="text-xs mt-2" :class="metric.trend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}% from last month
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Inventory Health -->
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h3 class="font-bold text-lg mb-4 text-gray-800">Inventory Health</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-red-50 rounded text-red-700">
            <span>Low Stock Items</span>
            <span class="font-bold">12</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-yellow-50 rounded text-yellow-700">
            <span>Overstock Risk</span>
            <span class="font-bold">5</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded text-gray-700">
            <span>Dead Stock (60d)</span>
            <span class="font-bold">8</span>
          </div>
        </div>
      </div>

      <!-- Sales Forecast -->
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h3 class="font-bold text-lg mb-4 text-gray-800">AI Demand Forecast (30 Days)</h3>
        <p class="text-sm text-gray-500 mb-4">Predicted demand across all categories.</p>
        <!-- Chart Placeholder -->
        <div class="h-48 bg-gray-50 rounded flex items-center justify-center text-gray-400 border-dashed border-2">
          Chart: Revenue Prediction vs Actual
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const metrics = ref([
  { label: 'Total Revenue', value: 'KES 2.4M', trend: 12, color: 'text-gray-800' },
  { label: 'Active Retailers', value: '1,240', trend: 8, color: 'text-blue-600' },
  { label: 'Active Wholesalers', value: '85', trend: -2, color: 'text-indigo-600' },
  { label: 'Order Fulfillment', value: '98%', trend: 1, color: 'text-green-600' }
]);
</script>
