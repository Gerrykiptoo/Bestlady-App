<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Page hero -->
    <div class="page-hero">
      <div class="container-custom relative z-10 py-10">
        <p class="section-tag text-white/70">Administration</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="text-3xl font-black text-white">Admin Dashboard</h1>
            <p class="text-white/70 mt-1 text-sm">Full platform control — products, users, analytics.</p>
          </div>
          <div class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-white">{{ onlineCount }} users online</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-5 py-2.5 font-semibold rounded-t-lg transition whitespace-nowrap text-sm',
          activeTab === tab.key
            ? 'bg-white text-purple-700 border-x border-t border-gray-200 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ================= OVERVIEW TAB ================= -->
    <div v-if="activeTab === 'overview'">
      <!-- KPI cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-gray-800">{{ orderStats.total || 0 }}</p>
          <div class="flex gap-2 mt-2">
            <span class="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{{ orderStats.pending || 0 }} pending</span>
            <span class="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{{ orderStats.paid || 0 }} paid</span>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue (30d)</p>
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-green-600">KES {{ formatPrice(metrics.totalRevenue || 0) }}</p>
          <p class="text-xs text-gray-400 mt-2">Completed orders only</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Processing</p>
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-purple-700">{{ (orderStats.processing || 0) + (orderStats.dispatched || 0) }}</p>
          <p class="text-xs text-gray-400 mt-2">Processing + dispatched</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Online Now</p>
            <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <p class="text-3xl font-black text-teal-600">{{ onlineCount }}</p>
          <p class="text-xs text-gray-400 mt-2">Active sessions</p>
        </div>
      </div>

      <!-- Order status breakdown -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div v-for="s in statusBreakdown" :key="s.key" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div :class="['w-3 h-3 rounded-full mx-auto mb-2', s.dot]"></div>
          <p class="text-2xl font-black" :class="s.color">{{ orderStats[s.key] || 0 }}</p>
          <p class="text-xs text-gray-500 capitalize font-medium mt-0.5">{{ s.label }}</p>
        </div>
      </div>

      <!-- Revenue Chart + Low stock -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-bold text-gray-800 mb-4">Revenue Trend (30 Days)</h3>
          <div class="h-72"><canvas ref="revenueChart"></canvas></div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>Low Stock
          </h3>
          <div v-if="lowStockItems.length === 0" class="text-center py-8">
            <svg class="w-10 h-10 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-sm text-gray-500">All stock healthy</p>
          </div>
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="item in lowStockItems" :key="item.id" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p class="text-sm font-semibold text-gray-800">{{ item.name }}</p>
                <p class="text-xs text-gray-500">Reorder at {{ item.reorder_point }}</p>
              </div>
              <span class="text-sm font-black text-red-600">{{ item.current_stock }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top products -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-800 mb-4">Top Selling Products (30d)</h3>
        <div v-if="topProducts.length === 0" class="text-center py-6 text-gray-400 text-sm">No sales data yet</div>
        <div v-else class="space-y-3">
          <div v-for="(prod, idx) in topProducts" :key="prod.product_id" class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
            <div class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center">{{ idx+1 }}</div>
            <img :src="prod.Product?.image_url || '/placeholder.jpg'" class="w-10 h-10 rounded-lg object-cover" />
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ prod.Product?.name }}</p>
              <p class="text-xs text-gray-500">{{ prod.totalSold }} units sold</p>
            </div>
            <p class="font-black text-purple-700">KES {{ formatPrice(prod.revenue || 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PRODUCTS TAB ================= -->
    <div v-if="activeTab === 'products'">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Products</h2>
          <button @click="openProductModal()" class="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition flex items-center gap-2 text-sm font-semibold shadow">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add Product
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
                <th class="px-4 py-3">Image</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">SKU</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Retail</th>
                <th class="px-4 py-3">Wholesale</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="prod in products" :key="prod.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3"><img :src="prod.image_url || '/placeholder.jpg'" class="w-12 h-12 object-cover rounded-lg" /></td>
                <td class="px-4 py-3 font-semibold text-gray-800">{{ prod.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">{{ prod.sku }}</td>
                <td class="px-4 py-3 text-sm">{{ prod.Category?.name || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm font-medium">KES {{ formatPrice(prod.retail_price) }}</td>
                <td class="px-4 py-3 text-sm font-medium">KES {{ formatPrice(prod.wholesale_price) }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-sm font-bold px-2 py-0.5 rounded-full', prod.current_stock <= prod.reorder_point ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                    {{ prod.current_stock }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="openProductModal(prod)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button @click="deleteProduct(prod.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="8" class="px-4 py-12 text-center text-gray-400">No products. Click "Add Product" to get started.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= USERS TAB ================= -->
    <div v-if="activeTab === 'users'">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-lg text-gray-800">User Management</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ users.length }} registered users</p>
          </div>
          <button @click="fetchUsers" class="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1.5 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tier</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">Credit Limit</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">KYC</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                      {{ (user.business_name || user.username || '?')[0].toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800">{{ user.business_name || user.username }}</p>
                      <p class="text-xs text-gray-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="['text-xs font-bold px-2 py-1 rounded-full capitalize', user.tier === 'wholesale' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">{{ user.tier }}</span>
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.role" @change="updateUserField(user, 'role', user.role)" class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-purple-400 outline-none">
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <input type="number" v-model.number="user.credit_limit" @blur="updateUserField(user, 'credit_limit', user.credit_limit)" class="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.kyc_status" @change="updateUserField(user, 'kyc_status', user.kyc_status)" class="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-purple-400 outline-none">
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <!-- Toggle button -->
                  <button
                    @click="toggleUserActive(user)"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1',
                      user.is_active !== false ? 'bg-green-500' : 'bg-gray-300'
                    ]"
                    :title="user.is_active !== false ? 'Click to deactivate' : 'Click to activate'"
                  >
                    <span :class="['inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform', user.is_active !== false ? 'translate-x-6' : 'translate-x-1']"></span>
                  </button>
                  <span class="ml-2 text-xs font-medium" :class="user.is_active !== false ? 'text-green-600' : 'text-gray-400'">
                    {{ user.is_active !== false ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button @click="viewUserDetails(user)" class="text-sm text-purple-600 hover:text-purple-800 font-semibold transition">View</button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="7" class="text-center py-12 text-gray-400">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= ANALYTICS TAB ================= -->
    <div v-if="activeTab === 'analytics'">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 class="font-bold text-lg text-gray-800 mb-4">Download Financial Reports</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border border-gray-200 rounded-xl p-4">
            <h4 class="font-semibold text-gray-800 mb-3">Orders Report</h4>
            <div class="flex gap-2 mb-3">
              <input type="date" v-model="reportStartDate" class="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
              <input type="date" v-model="reportEndDate" class="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div class="flex gap-2">
              <button @click="downloadReport('orders', 'csv')" class="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition font-semibold">CSV</button>
              <button @click="downloadReport('orders', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition font-semibold">PDF</button>
            </div>
          </div>
          <div class="border border-gray-200 rounded-xl p-4">
            <h4 class="font-semibold text-gray-800 mb-3">Products Sold</h4>
            <div class="flex gap-2 mb-3">
              <input type="date" v-model="reportStartDate" class="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
              <input type="date" v-model="reportEndDate" class="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div class="flex gap-2">
              <button @click="downloadReport('products_sold', 'csv')" class="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition font-semibold">CSV</button>
              <button @click="downloadReport('products_sold', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition font-semibold">PDF</button>
            </div>
          </div>
          <div class="border border-gray-200 rounded-xl p-4">
            <h4 class="font-semibold text-gray-800 mb-3">Stock Report</h4>
            <p class="text-xs text-gray-400 mb-3">Current inventory snapshot</p>
            <div class="flex gap-2 mt-6">
              <button @click="downloadReport('stock', 'csv')" class="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition font-semibold">CSV</button>
              <button @click="downloadReport('stock', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition font-semibold">PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PRODUCT MODAL ================= -->
    <Modal :show="productModalVisible" @close="closeProductModal">
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-6">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Product Name *</label>
            <input v-model="productForm.name" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">SKU *</label>
            <input v-model="productForm.sku" type="text" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Description</label>
            <textarea v-model="productForm.description" rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Category</label>
              <select v-model="productForm.category_id" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Unit</label>
              <select v-model="productForm.unit" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none">
                <option value="piece">Piece</option>
                <option value="dozen">Dozen</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Retail Price (KES)</label>
              <input v-model.number="productForm.retail_price" type="number" step="0.01" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Wholesale Price (KES)</label>
              <input v-model.number="productForm.wholesale_price" type="number" step="0.01" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Current Stock</label>
              <input v-model.number="productForm.current_stock" type="number" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Reorder Point</label>
              <input v-model.number="productForm.reorder_point" type="number" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1">Product Image</label>
            <input type="file" @change="onImageSelect" accept="image/*" class="w-full text-sm" />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2 h-24 object-cover rounded-xl" />
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="closeProductModal" class="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold">Cancel</button>
            <button type="submit" class="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-semibold">Save</button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- ================= USER DETAILS MODAL ================= -->
    <Modal :show="userDetailsModalVisible" @close="closeUserDetailsModal" size="lg">
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ selectedUser?.business_name || selectedUser?.username }}</h3>
            <p class="text-sm text-gray-500">{{ selectedUser?.email }}</p>
          </div>
          <button @click="downloadUserData" class="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition">Download JSON</button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl text-sm">
          <div><span class="font-semibold text-gray-600">Phone:</span> {{ selectedUser?.phone || 'N/A' }}</div>
          <div><span class="font-semibold text-gray-600">Tier:</span> {{ selectedUser?.tier }}</div>
          <div><span class="font-semibold text-gray-600">Role:</span> {{ selectedUser?.role }}</div>
          <div><span class="font-semibold text-gray-600">KYC:</span> {{ selectedUser?.kyc_status || 'pending' }}</div>
          <div><span class="font-semibold text-gray-600">Wallet:</span> KES {{ formatPrice(selectedUser?.wallet_balance) }}</div>
          <div><span class="font-semibold text-gray-600">Credit Limit:</span> KES {{ formatPrice(selectedUser?.credit_limit) }}</div>
          <div><span class="font-semibold text-gray-600">Joined:</span> {{ formatDate(selectedUser?.createdAt) }}</div>
          <div><span class="font-semibold text-gray-600">Active:</span> <span :class="selectedUser?.is_active !== false ? 'text-green-600' : 'text-red-500'">{{ selectedUser?.is_active !== false ? 'Yes' : 'No' }}</span></div>
        </div>
        <h4 class="font-bold text-gray-800 mb-3">Orders ({{ userOrders.length }})</h4>
        <div class="overflow-x-auto mb-6 rounded-xl border border-gray-100">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50"><tr class="text-left text-xs text-gray-500 font-semibold"><th class="px-4 py-3">Order #</th><th class="px-4 py-3">Date</th><th class="px-4 py-3">Amount</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Payment</th></tr></thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in userOrders" :key="order.id" class="hover:bg-gray-50"><td class="px-4 py-3 font-medium">{{ order.order_number }}</td><td class="px-4 py-3 text-gray-500">{{ formatDate(order.createdAt) }}</td><td class="px-4 py-3 font-semibold">KES {{ formatPrice(order.total_amount) }}</td><td class="px-4 py-3 capitalize">{{ order.status }}</td><td class="px-4 py-3 capitalize">{{ order.payment_status }}</td></tr>
              <tr v-if="userOrders.length === 0"><td colspan="5" class="text-center py-6 text-gray-400">No orders found</td></tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end"><button @click="closeUserDetailsModal" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-semibold text-sm">Close</button></div>
      </div>
    </Modal>

    <!-- Confirm activation modal -->
    <div v-if="confirmToggleUser" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-lg text-gray-800 mb-2">
          {{ confirmToggleUser.is_active !== false ? 'Deactivate User?' : 'Activate User?' }}
        </h3>
        <p class="text-sm text-gray-600 mb-6">
          {{ confirmToggleUser.is_active !== false
            ? `${confirmToggleUser.business_name || confirmToggleUser.username} will be blocked from logging in.`
            : `${confirmToggleUser.business_name || confirmToggleUser.username} will regain full access.` }}
        </p>
        <div class="flex gap-3">
          <button @click="confirmToggleUser = null" class="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold text-sm">Cancel</button>
          <button @click="doToggleActive" :class="['flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition', confirmToggleUser.is_active !== false ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600']">
            {{ confirmToggleUser.is_active !== false ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>
    </div>

    </div><!-- end container-custom -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/services/api'
import Modal from '@/components/common/Modal.vue'
import { useToast } from 'vue-toast-notification'
import { formatPrice, formatDate } from '@/utils/formatters'
import { getSocket } from '@/services/socket'

Chart.register(...registerables)

const toast = useToast()

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'products', label: 'Products' },
  { key: 'users', label: 'Users' },
  { key: 'analytics', label: 'Reports' }
]
const activeTab = ref('overview')

const statusBreakdown = [
  { key: 'pending', label: 'Pending', dot: 'bg-amber-400', color: 'text-amber-600' },
  { key: 'paid', label: 'Paid', dot: 'bg-green-400', color: 'text-green-600' },
  { key: 'processing', label: 'Processing', dot: 'bg-blue-400', color: 'text-blue-600' },
  { key: 'dispatched', label: 'Dispatched', dot: 'bg-purple-400', color: 'text-purple-600' },
  { key: 'delivered', label: 'Delivered', dot: 'bg-teal-400', color: 'text-teal-600' },
  { key: 'cancelled', label: 'Cancelled', dot: 'bg-red-400', color: 'text-red-600' }
]

// ---------- Reports ----------
const reportStartDate = ref(new Date().toISOString().slice(0,10))
const reportEndDate = ref(new Date().toISOString().slice(0,10))

// ---------- Products ----------
const products = ref([])
const categories = ref([])
const productModalVisible = ref(false)
const editingProduct = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')
const productForm = ref({
  name: '', sku: '', description: '', category_id: '',
  retail_price: 0, wholesale_price: 0, unit: 'piece',
  current_stock: 0, reorder_point: 10
})

// ---------- Users ----------
const users = ref([])
const userDetailsModalVisible = ref(false)
const selectedUser = ref(null)
const userOrders = ref([])
const userTransactions = ref([])
const confirmToggleUser = ref(null)

// ---------- Analytics / Overview ----------
const metrics = ref({ totalRevenue: 0, totalOrders: 0 })
const orderStats = ref({ total: 0, pending: 0, paid: 0, processing: 0, dispatched: 0, delivered: 0, cancelled: 0 })
const lowStockItems = ref([])
const topProducts = ref([])
const onlineCount = ref(0)
const revenueChart = ref(null)
let revenueChartInstance = null
let pollInterval = null

// ---------- Products ----------
const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    products.value = data.products || []
  } catch (err) { toast.error('Failed to load products') }
}

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data
  } catch (err) { console.error(err) }
}

const openProductModal = (product = null) => {
  editingProduct.value = product
  if (product) {
    productForm.value = { ...product }
    imagePreview.value = product.image_url || ''
  } else {
    productForm.value = { name: '', sku: '', description: '', category_id: '', retail_price: 0, wholesale_price: 0, unit: 'piece', current_stock: 0, reorder_point: 10 }
    imagePreview.value = ''
    imageFile.value = null
  }
  productModalVisible.value = true
}

const closeProductModal = () => {
  productModalVisible.value = false
  editingProduct.value = null
  imageFile.value = null
  imagePreview.value = ''
}

const onImageSelect = (e) => {
  const file = e.target.files[0]
  if (file) { imageFile.value = file; imagePreview.value = URL.createObjectURL(file) }
}

const saveProduct = async () => {
  const formData = new FormData()
  Object.keys(productForm.value).forEach(key => {
    if (productForm.value[key] !== undefined && productForm.value[key] !== null) formData.append(key, productForm.value[key])
  })
  if (imageFile.value) formData.append('image', imageFile.value)
  try {
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product updated')
    } else {
      await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product created')
    }
    closeProductModal()
    fetchProducts()
  } catch (err) { toast.error(err.response?.data?.message || 'Failed to save product') }
}

const deleteProduct = async (id) => {
  if (confirm('Delete this product?')) {
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch { toast.error('Failed to delete product') }
  }
}

// ---------- Users ----------
const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/users')
    users.value = data.users || []
  } catch { toast.error('Failed to load users') }
}

const updateUserField = async (user, field, value) => {
  try {
    await api.put(`/admin/users/${user.id}`, { [field]: value })
    toast.success(`Updated successfully`)
  } catch {
    toast.error(`Failed to update`)
    fetchUsers()
  }
}

const toggleUserActive = (user) => {
  confirmToggleUser.value = user
}

const doToggleActive = async () => {
  const user = confirmToggleUser.value
  if (!user) return
  const newVal = user.is_active === false ? true : false
  confirmToggleUser.value = null
  try {
    await api.put(`/admin/users/${user.id}`, { is_active: newVal })
    user.is_active = newVal
    toast.success(newVal ? 'User activated' : 'User deactivated')
  } catch { toast.error('Failed to update status'); fetchUsers() }
}

const viewUserDetails = async (user) => {
  selectedUser.value = user
  userDetailsModalVisible.value = true
  try {
    const [ordersRes] = await Promise.all([api.get(`/orders?userId=${user.id}&limit=50`)])
    userOrders.value = ordersRes.data || []
  } catch { toast.error('Could not load user details') }
}

const closeUserDetailsModal = () => {
  userDetailsModalVisible.value = false
  selectedUser.value = null
  userOrders.value = []
}

const downloadUserData = () => {
  if (!selectedUser.value) return
  const data = { user: selectedUser.value, orders: userOrders.value }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `user_${selectedUser.value.id}_data.json`; a.click(); URL.revokeObjectURL(url)
  toast.success('Data downloaded')
}

// ---------- Reports ----------
const downloadReport = async (type, format = 'csv') => {
  try {
    let url = `/admin/reports/financial?reportType=${type}&format=${format}`
    if (type !== 'stock') url += `&startDate=${reportStartDate.value}&endDate=${reportEndDate.value}`
    const response = await api.get(url, { responseType: 'blob' })
    const isPdf = format === 'pdf'
    const blob = new Blob([response.data], { type: isPdf ? 'application/pdf' : 'text/csv' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${type}_report_${new Date().toISOString().slice(0,10)}.${isPdf ? 'pdf' : 'csv'}`; link.click(); URL.revokeObjectURL(link.href)
    toast.success(`Report downloaded`)
  } catch { toast.error('Failed to download report') }
}

// ---------- Analytics / Overview ----------
const fetchAnalytics = async () => {
  try {
    const [salesRes, inventoryRes, statsRes] = await Promise.all([
      api.get('/admin/analytics/sales'),
      api.get('/admin/analytics/inventory'),
      api.get('/admin/analytics/order-stats')
    ])

    const dailySales = salesRes.data.dailySales || []
    metrics.value.totalRevenue = salesRes.data.totals?.totalRevenue || 0
    metrics.value.totalOrders = salesRes.data.totals?.totalOrders || 0

    lowStockItems.value = inventoryRes.data.lowStock?.items || []
    topProducts.value = inventoryRes.data.topSelling || []

    orderStats.value = statsRes.data
    onlineCount.value = statsRes.data.onlineCount || 0

    await nextTick()
    renderChart(dailySales)
  } catch (err) { console.error('Analytics error:', err) }
}

const renderChart = (dailySales) => {
  if (revenueChartInstance) revenueChartInstance.destroy()
  if (!revenueChart.value) return
  revenueChartInstance = new Chart(revenueChart.value, {
    type: 'line',
    data: {
      labels: dailySales.map(d => d.date),
      datasets: [{
        label: 'Revenue (KES)',
        data: dailySales.map(d => d.totalRevenue || 0),
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.08)',
        tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#9333ea'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { callback: v => 'KES ' + Number(v).toLocaleString() } } }
    }
  })
}

// ---------- Lifecycle ----------
onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchUsers()
  fetchAnalytics()

  const socket = getSocket()
  if (socket) {
    socket.on('orderUpdate', fetchAnalytics)
    socket.on('walletUpdate', fetchUsers)
    socket.on('onlineCount', ({ count }) => { onlineCount.value = count })
  }
  pollInterval = setInterval(fetchAnalytics, 60000)
})

onUnmounted(() => {
  const socket = getSocket()
  if (socket) {
    socket.off('orderUpdate', fetchAnalytics)
    socket.off('walletUpdate', fetchUsers)
    socket.off('onlineCount')
  }
  if (pollInterval) clearInterval(pollInterval)
  if (revenueChartInstance) revenueChartInstance.destroy()
})
</script>
