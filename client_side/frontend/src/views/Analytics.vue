<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero -->
    <div class="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold mb-4">BestLady Business Intelligence</h1>
        <p class="text-xl">Real-time insights into Kenya's beauty market trends</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <div class="text-2xl font-bold text-primary-600">500+</div>
          <div class="text-gray-500">Products</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div class="text-2xl font-bold text-primary-600">1,240+</div>
          <div class="text-gray-500">Retailers</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </div>
          <div class="text-2xl font-bold text-primary-600">15.2K</div>
          <div class="text-gray-500">Orders</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="text-2xl font-bold text-primary-600">KES 2.4M</div>
          <div class="text-gray-500">Revenue</div>
        </div>
      </div>

      <!-- Demand Chart -->
      <div class="bg-white rounded-lg shadow p-6 mb-12">
        <h2 class="text-xl font-bold mb-6">Product Demand by Category</h2>
        <div class="space-y-4">
          <div v-for="cat in categories" :key="cat.name" class="flex items-center gap-4">
            <div class="w-24 text-sm font-medium">{{ cat.name }}</div>
            <div class="flex-1">
              <div class="bg-gray-200 rounded-full h-4">
                <div class="bg-primary-600 h-4 rounded-full" :style="{ width: cat.percentage + '%' }"></div>
              </div>
            </div>
            <div class="w-12 text-right font-bold">{{ cat.percentage }}%</div>
          </div>
        </div>
      </div>

      <!-- Regional Demand -->
      <div class="bg-white rounded-lg shadow p-6 mb-12">
        <h2 class="text-xl font-bold mb-6">Regional Demand Analysis</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="region in regions" :key="region.name" class="p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="font-bold">{{ region.name }}</span>
              <span :class="region.trend === 'up' ? 'text-green-600' : 'text-red-600'" class="text-sm">
                {{ region.trend === 'up' ? '↑' : '↓' }} {{ region.change }}%
              </span>
            </div>
            <div class="mb-2">
              <div class="flex justify-between text-sm mb-1">
                <span>Market Share</span>
                <span>{{ region.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-500 h-2 rounded-full" :style="{ width: region.percentage + '%' }"></div>
              </div>
            </div>
            <div class="text-xs text-gray-500">Top: {{ region.topProduct }}</div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 text-center">
        <h3 class="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
        <div class="flex gap-4 justify-center">
          <router-link to="/register" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700">
            Register Now
          </router-link>
          <router-link to="/products" class="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50">
            Browse Products
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { name: 'Skincare', percentage: 85 },
  { name: 'Makeup', percentage: 72 },
  { name: 'Haircare', percentage: 68 },
  { name: 'Body Care', percentage: 45 },
  { name: 'Fragrance', percentage: 38 },
  { name: 'Tools', percentage: 42 }
]

const regions = [
  { name: 'Nairobi', trend: 'up', change: 18, percentage: 45, topProduct: 'Vitamin C Serum' },
  { name: 'Mombasa', trend: 'up', change: 12, percentage: 25, topProduct: 'Sunscreen' },
  { name: 'Kisumu', trend: 'down', change: 5, percentage: 15, topProduct: 'Shea Butter' },
  { name: 'Nakuru', trend: 'up', change: 8, percentage: 10, topProduct: 'Hair Oil' },
  { name: 'Eldoret', trend: 'up', change: 15, percentage: 5, topProduct: 'Body Lotion' }
]
</script>
