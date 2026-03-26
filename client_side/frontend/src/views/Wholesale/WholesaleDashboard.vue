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
        
        <!-- Dropzone with state-based styling -->
        <div 
          role="button"
          tabindex="0"
          :aria-label="'Upload bulk order file. ' + (uploadState === 'success' ? 'File uploaded successfully.' : 'Drag and drop or click to select.')"
          :aria-describedby="'upload-hint'"
          :class="[
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group',
            uploadState === 'dragging' ? 'border-green-500 bg-green-50 scale-[1.02]' :
            uploadState === 'uploading' ? 'border-blue-500 bg-blue-50' :
            uploadState === 'success' ? 'border-green-500 bg-green-50' :
            uploadState === 'error' ? 'border-red-500 bg-red-50' :
            'border-gray-300 hover:border-green-500 hover:bg-green-50/30'
          ]"
          @click="triggerFileUpload"
          @keydown.enter.prevent="triggerFileUpload"
          @keydown.space.prevent="triggerFileUpload"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept=".csv,.xlsx,.xls" 
            @change="handleFileUpload" 
            aria-hidden="true"
          />
          
          <!-- Upload Progress Indicator -->
          <div v-if="uploadState === 'uploading'" class="mb-4">
            <div class="flex items-center justify-center mb-2">
              <svg class="h-8 w-8 animate-bounce text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                :style="{ width: uploadProgress + '%' }"
                role="progressbar"
                :aria-valuenow="uploadProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p class="text-sm text-blue-600 font-medium">
              Uploading {{ uploadedFileName }}... {{ uploadProgress }}%
            </p>
          </div>
          
          <!-- Success State -->
          <div v-else-if="uploadState === 'success'" class="mb-4">
            <div class="flex items-center justify-center mb-2">
              <svg class="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-green-600 font-medium">{{ uploadedFileName }}</p>
            <p class="text-sm text-green-600 mt-1">Uploaded successfully!</p>
            <button 
              @click.stop="resetUpload"
              class="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Upload another file
            </button>
          </div>
          
          <!-- Error State -->
          <div v-else-if="uploadState === 'error'" class="mb-4">
            <div class="flex items-center justify-center mb-2">
              <svg class="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-red-600 font-medium">Upload Failed</p>
            <p class="text-sm text-red-500 mt-1">{{ uploadError }}</p>
            <button 
              @click.stop="resetUpload"
              class="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Try again
            </button>
          </div>
          
          <!-- Idle State - Default Upload UI -->
          <div v-else>
            <svg 
              :class="[
                'h-12 w-12 mx-auto mb-3 transition-colors duration-300',
                uploadState === 'dragging' ? 'text-green-500 scale-110' : 'text-gray-400 group-hover:text-green-500'
              ]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-sm text-gray-600">
              <span class="font-medium text-green-600">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-400 mt-1">CSV, XLSX or XLS files (max 10MB)</p>
          </div>
          
          <!-- Screen reader hint -->
          <span id="upload-hint" class="sr-only">
            Accepted formats: CSV, XLSX, XLS. Maximum file size: 10MB
          </span>
        </div>
        
        <!-- File Requirements Info -->
        <div class="mt-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-xs text-gray-500 mb-2 font-medium">📋 File Requirements:</p>
          <ul class="text-xs text-gray-400 space-y-1">
            <li>• Format: CSV, XLSX, or XLS</li>
            <li>• Max size: 10MB</li>
            <li>• Columns: Product ID, Quantity, Branch Code</li>
          </ul>
        </div>
        
        <button 
          @click="downloadTemplate"
          class="mt-4 w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
        >
          <svg class="h-4 w-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Bulk Order Template
        </button>
      </div>

      <!-- Regional Demand Forecast -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="font-bold text-lg text-gray-800">📊 Regional Demand Forecast</h3>
          </div>
          <select 
            v-model="demandPeriod" 
            class="text-xs border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div 
            v-for="region in regionalDemand" 
            :key="region.code"
            class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <p class="font-medium text-gray-800">{{ region.name }}</p>
                <p class="text-xs text-gray-500">{{ region.orders }} orders</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-800">{{ formatPrice(region.value) }}</p>
                <span 
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    region.trend === 'up' ? 'bg-green-100 text-green-600' :
                    region.trend === 'down' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ region.trend === 'up' ? '↑' : region.trend === 'down' ? '↓' : '→' }} {{ region.change }}%
                </span>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                :class="[
                  'h-1.5 rounded-full transition-all duration-500',
                  region.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  region.trend === 'down' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  'bg-gradient-to-r from-gray-400 to-gray-500'
                ]"
                :style="{ width: region.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p class="text-xs text-gray-500">Total Forecast</p>
          <p class="font-bold text-gray-800">KES {{ formatPrice(totalForecast) }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Bulk Orders -->
    <div class="bg-white rounded-2xl shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-lg text-gray-800">📋 Recent Bulk Orders</h2>
        <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All →
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs text-gray-500 border-b border-gray-100">
              <th class="pb-3 font-medium">Order ID</th>
              <th class="pb-3 font-medium">Products</th>
              <th class="pb-3 font-medium">Branch</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr 
              v-for="order in recentBulkOrders" 
              :key="order.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 font-medium text-gray-800">#{{ order.id }}</td>
              <td class="py-3 text-gray-600">{{ order.products }} items</td>
              <td class="py-3 text-gray-600">{{ order.branch }}</td>
              <td class="py-3 font-medium text-gray-800">KES {{ formatPrice(order.amount) }}</td>
              <td class="py-3">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </span>
              </td>
              <td class="py-3 text-gray-500">{{ order.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="recentBulkOrders.length === 0" class="text-center py-8">
        <svg class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">No bulk orders yet</p>
        <p class="text-sm text-gray-400">Upload a file to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

// ============================================
// BULK ORDER UPLOAD STATE & METHODS
// ============================================

const fileInput = ref(null);
const uploadState = ref('idle'); // idle | dragging | uploading | success | error
const uploadProgress = ref(0);
const uploadError = ref('');
const uploadedFileName = ref('');
const demandPeriod = ref('30');

// File validation constants
const ALLOWED_TYPES = ['.csv', '.xlsx', '.xls'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Triggers the hidden file input click
 * @description Accessibility: Allows keyboard and click activation
 */
const triggerFileUpload = () => {
  fileInput.value?.click();
};

/**
 * Validates file type and size
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
const validateFile = (file) => {
  // Check MIME type first
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Please upload CSV or Excel files only.`
    };
  }
  
  // Then check extension as secondary validation
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_TYPES.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension "${ext}". Allowed: ${ALLOWED_TYPES.join(', ')}`
    };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }
  
  // Check file is not empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please select a valid file.'
    };
  }
  
  return { valid: true };
};

/**
 * Handles drag over event - visual feedback for drag-and-drop
 */
const handleDragOver = () => {
  if (uploadState.value === 'idle' || uploadState.value === 'success' || uploadState.value === 'error') {
    uploadState.value = 'dragging';
  }
};

/**
 * Handles drag leave event - resets drag state
 */
const handleDragLeave = () => {
  if (uploadState.value === 'dragging') {
    uploadState.value = 'idle';
  }
};

/**
 * Processes the uploaded file with validation and upload simulation
 * @param {File} file - The file to process
 */
const processFile = async (file) => {
  const validation = validateFile(file);
  
  if (!validation.valid) {
    uploadState.value = 'error';
    uploadError.value = validation.error;
    return;
  }

  uploadState.value = 'uploading';
  uploadProgress.value = 0;
  uploadedFileName.value = file.name;
  uploadError.value = '';

  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'bulk_order');
    formData.append('timestamp', new Date().toISOString());
    
    // Actual API call with progress tracking
    // Note: Uncomment and configure when backend endpoint is ready
    /*
    const response = await api.post('/bulk-orders/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    });
    */
    
    // Temporary simulation until API is ready
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        uploadProgress.value += Math.random() * 15 + 5;
        if (uploadProgress.value >= 100) {
          uploadProgress.value = 100;
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });

    // Success state
    uploadState.value = 'success';
    
    // Optional: Auto-reset after delay
    // setTimeout(resetUpload, 10000);
    
  } catch (error) {
    uploadState.value = 'error';
    uploadError.value = error.response?.data?.message || error.message || 'Upload failed. Please check your connection and try again.';
  }
};

/**
 * Handles file drop from drag-and-drop
 * @param {DragEvent} event - The drag event containing files
 */
const handleDrop = async (event) => {
  const files = event.dataTransfer?.files;
  
  if (files?.length) {
    await processFile(files[0]);
  } else {
    // Only reset if no files were dropped
    uploadState.value = 'idle';
  }
};

/**
 * Handles file selection from click-to-upload
 * @param {Event} event - The change event from file input
 */
const handleFileUpload = async (event) => {
  const files = event.target?.files;
  
  if (files?.length) {
    await processFile(files[0]);
  }
  
  // Reset file input to allow re-selecting same file
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

/**
 * Resets upload state to idle
 */
const resetUpload = () => {
  uploadState.value = 'idle';
  uploadProgress.value = 0;
  uploadError.value = '';
  uploadedFileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

/**
 * Downloads the bulk order template
 * @description Creates and triggers download of a sample template file
 */
const downloadTemplate = () => {
  // Template data as CSV
  const templateData = [
    ['Product_ID', 'Quantity', 'Branch_Code', 'Notes'],
    ['PRD001', '50', 'NBO001', 'Urgent order'],
    ['PRD002', '100', 'NBO002', ''],
    ['PRD003', '25', 'NBO001', 'Fragile - handle with care']
  ];
  
  const csvContent = templateData
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bulk_order_template.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// EXISTING DATA & METHODS (Continued)
// ============================================

// Credit & Orders Data
const creditLimit = ref(500000);
const usedCredit = ref(125000);
const usedCreditPercent = computed(() => Math.round((usedCredit.value / creditLimit.value) * 100));
const activeOrders = ref(12);
const pendingDeliveries = ref(5);
const bulkOrdersCount = ref(48);
const bulkOrderGrowth = ref(15);
const savingsThisMonth = ref(24500);

// AI Recommendation
const aiRecommendation = ref('Based on your ordering patterns, consider increasing stock for "Shea Butter 500ml" and "Hair Food" by 20% for the upcoming holiday season.');

const applyOptimization = () => {
  // TODO: Implement AI optimization logic
  console.log('Applying AI optimization...');
};

// Fleet Tracking
const activeFleet = ref([
  { id: 1, name: 'Truck KDB 123A', driver: 'John Kamau', destination: 'Nairobi CBD', eta: '2:30 PM', status: 'delivering' },
  { id: 2, name: 'Van KDB 456B', driver: 'Mary Wanjiku', destination: 'Kasarani', eta: '3:15 PM', status: 'delivering' },
  { id: 3, name: 'Truck KDB 789C', driver: 'Peter Ochieng', destination: 'Westlands', eta: '4:00 PM', status: 'returning' },
  { id: 4, name: 'Van KDB 012D', driver: 'Susan Achieng', destination: 'Karen', eta: '5:30 PM', status: 'loading' },
]);

// Regional Demand Data
const regionalDemand = ref([
  { code: 'NBO', name: 'Nairobi Region', orders: 245, value: 1250000, trend: 'up', change: 18, percentage: 85 },
  { code: 'MBS', name: 'Mombasa Region', orders: 180, value: 890000, trend: 'up', change: 12, percentage: 65 },
  { code: 'KSM', name: 'Kisumu Region', orders: 95, value: 420000, trend: 'down', change: 5, percentage: 30 },
  { code: 'NKR', name: 'Nakuru Region', orders: 120, value: 560000, trend: 'stable', change: 0, percentage: 45 },
  { code: 'ELD', name: 'Eldoret Region', orders: 65, value: 280000, trend: 'up', change: 8, percentage: 22 },
]);

const totalForecast = computed(() => 
  regionalDemand.value.reduce((sum, region) => sum + region.value, 0)
);

// Recent Bulk Orders
const recentBulkOrders = ref([
  { id: 'BLK2024031', products: 15, branch: 'Nairobi CBD', amount: 45000, status: 'completed', date: 'Mar 24, 2024' },
  { id: 'BLK2024030', products: 8, branch: 'Westlands', amount: 28000, status: 'processing', date: 'Mar 23, 2024' },
  { id: 'BLK2024029', products: 22, branch: 'Mombasa', amount: 78000, status: 'completed', date: 'Mar 22, 2024' },
  { id: 'BLK2024028', products: 5, branch: 'Kisumu', amount: 18500, status: 'pending', date: 'Mar 21, 2024' },
  { id: 'BLK2024027', products: 12, branch: 'Nairobi CBD', amount: 42000, status: 'completed', date: 'Mar 20, 2024' },
]);

// Utility Functions
const formatPrice = (value) => {
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Lifecycle Hooks
onMounted(() => {
  // TODO: Fetch initial data from API
  // fetchDashboardData();
});
</script>

<style scoped>
/* Smooth animations for upload states */
@keyframes pulse-border {
  0%, 100% { border-color: theme('colors.green.400'); }
  50% { border-color: theme('colors.green.600'); }
}

.upload-dragging {
  animation: pulse-border 1.5s ease-in-out infinite;
}

/* Custom scrollbar for regional demand */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>