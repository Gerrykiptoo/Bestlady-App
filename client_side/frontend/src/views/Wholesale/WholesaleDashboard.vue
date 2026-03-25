]<template>
  <div class="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Wholesale Dashboard
      </h1>
      <p class="text-gray-500 mt-1">Manage bulk orders, track fleet, and monitor inventory across branches.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Credit Limit Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 group">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition">
            <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span class="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">Available</span>
        </div>
        <p class="text-sm text-gray-500">Credit Limit</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(creditLimit) }}</p>
        <div class="mt-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Used: {{ usedCreditPercent }}%</span>
            <span>KES {{ formatPrice(usedCredit) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" :style="{ width: usedCreditPercent + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Active Orders Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">Active Orders</p>
        <p class="text-2xl font-bold text-gray-800">{{ activeOrders }}</p>
        <p class="text-xs text-yellow-600 mt-1">{{ pendingDeliveries }} awaiting dispatch</p>
      </div>

      <!-- Bulk Orders Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">Bulk Orders (30d)</p>
        <p class="text-2xl font-bold text-gray-800">{{ bulkOrdersCount }}</p>
        <p class="text-xs text-green-600 mt-1">↑ {{ bulkOrderGrowth }}% vs last month</p>
      </div>

      <!-- Savings Card -->
      <div class="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-500">Savings (Wholesale)</p>
        <p class="text-2xl font-bold text-gray-800">KES {{ formatPrice(savingsThisMonth) }}</p>
        <p class="text-xs text-green-600 mt-1">Compared to retail prices</p>
      </div>
    </div>

    <!-- AI Optimizer & Fleet Tracking -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- AI Bulk Recommendations -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 relative overflow-hidden group">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-amber-200 rounded-full blur-2xl opacity-30 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="flex items-center gap-3 mb-4 relative z-10">
          <div class="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-2">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="font-bold text-xl text-gray-800">🤖 AI Bulk Optimizer</h3>
        </div>
        <p class="text-amber-800 font-medium italic mb-4 relative z-10">"{{ aiRecommendation }}"</p>
        <button @click="applyOptimization" class="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative z-10">
          Apply Optimization
        </button>
      </div>

      <!-- Fleet Tracking -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="bg-blue-600 rounded-full p-2">
              <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-800">🚚 Live Fleet Tracking</h3>
          </div>
          <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full animate-pulse">Active</span>
        </div>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div v-for="vehicle in activeFleet" :key="vehicle.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="vehicle.status === 'delivering' ? 'bg-green-500 animate-pulse' : vehicle.status === 'returning' ? 'bg-yellow-500' : 'bg-blue-500'"></div>
              <div>
                <p class="font-medium text-gray-800">{{ vehicle.name }}</p>
                <p class="text-xs text-gray-500">Driver: {{ vehicle.driver }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">{{ vehicle.destination }}</p>
              <p class="text-xs text-gray-500">ETA: {{ vehicle.eta }}</p>
            </div>
          </div>
        </div>
        <button class="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
          View All Fleet →
        </button>
      </div>
    </div>

    <!-- Bulk Order Upload & Regional Demand -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Bulk Order Upload -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 class="font-bold text-lg text-gray-800">📤 Bulk Order Upload</h3>
        </div>
        <div 
          class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer group"
          @click="triggerFileUpload"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input type="file" ref="fileInput" class="hidden" accept=".csv,.xlsx,.xls" @change="handleFileUpload" />
          <svg class="h-12 w-12 mx-auto text-gray-400 mb-3 group-hover:text-green-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-sm text-gray-600">Drag and drop CSV/Excel file or click to upload</p>
          <p class="text-xs text-gray-400 mt-1">Supports bulk product orders with quantities</p>
        </div>
        <button class="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-medium">
          Download Bulk Order Template
        </button>
      </div>

      <!-- Regional Demand Forecast -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex items