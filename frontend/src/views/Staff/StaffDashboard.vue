<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Staff Operations Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">Pending Pickups</h2>
        <div class="text-gray-500 italic text-sm">No pending pickups for your current shift.</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h2 class="font-bold text-lg mb-4">Warehouse Status</h2>
        <div class="flex justify-between items-center text-sm font-medium">
          <span>Active Shipments</span>
          <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded">5</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
