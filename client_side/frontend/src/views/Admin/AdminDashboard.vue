<template>
  <div class="min-h-screen" style="background: #0b0f1a;">

    <!-- Dark command center header -->
    <div style="background: linear-gradient(135deg, #070b14 0%, #0d1424 50%, #111827 100%); position: relative; overflow: hidden; border-bottom: 1px solid rgba(139,92,246,0.15);">
      <div style="position:absolute;top:-80px;right:-40px;width:320px;height:320px;border-radius:50%;background:rgba(139,92,246,0.04);"></div>
      <div class="container-custom relative z-10 py-12">
        <p class="text-violet-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Platform Administration</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-5 justify-between">
          <div>
            <h1 class="font-serif text-4xl font-bold text-white leading-tight">Admin Command Centre</h1>
            <p class="text-slate-500 mt-2 text-sm">Products, users, revenue, analytics — full platform control.</p>
          </div>
          <div class="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 border" style="background: rgba(139,92,246,0.06); border-color: rgba(139,92,246,0.2);">
            <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-violet-300">{{ onlineCount }} online now</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8">

    <!-- Tabs — pill style on dark bg -->
    <div class="flex gap-1.5 mb-8 overflow-x-auto pb-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-5 py-2.5 font-semibold rounded-xl transition whitespace-nowrap text-sm',
          activeTab === tab.key
            ? 'text-violet-950 shadow-sm'
            : 'text-slate-500 hover:text-slate-300'
        ]"
        :style="activeTab === tab.key ? 'background: linear-gradient(135deg, #a78bfa, #7c3aed);' : 'background: rgba(255,255,255,0.04);'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ================= OVERVIEW TAB ================= -->
    <div v-if="activeTab === 'overview'">

      <!-- KPI cards — dark slate -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="rounded-2xl p-5 border transition hover:border-violet-500/30" style="background: #111827; border-color: rgba(139,92,246,0.15);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: rgba(96,165,250,0.1);">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <p class="font-serif text-3xl font-bold text-white">{{ orderStats.total || 0 }}</p>
          <div class="flex gap-2 mt-2">
            <span class="text-xs text-amber-400 border px-2 py-0.5 rounded-full font-bold" style="border-color: rgba(251,191,36,0.3);">{{ orderStats.pending || 0 }} pending</span>
            <span class="text-xs text-emerald-400 border px-2 py-0.5 rounded-full font-bold" style="border-color: rgba(52,211,153,0.3);">{{ orderStats.paid || 0 }} paid</span>
          </div>
        </div>
        <div class="rounded-2xl p-5 border transition hover:border-emerald-500/30" style="background: #111827; border-color: rgba(52,211,153,0.15);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue (30d)</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: rgba(52,211,153,0.1);">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p class="font-serif text-3xl font-bold text-emerald-400">KES {{ formatPrice(metrics.totalRevenue || 0) }}</p>
          <p class="text-xs text-slate-600 mt-2">Completed orders only</p>
        </div>
        <div class="rounded-2xl p-5 border transition hover:border-violet-500/30" style="background: #111827; border-color: rgba(139,92,246,0.15);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Pipeline</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: rgba(139,92,246,0.1);">
              <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <p class="font-serif text-3xl font-bold text-violet-400">{{ (orderStats.processing || 0) + (orderStats.dispatched || 0) }}</p>
          <p class="text-xs text-slate-600 mt-2">Processing + dispatched</p>
        </div>
        <div class="rounded-2xl p-5 border transition hover:border-cyan-500/30" style="background: #111827; border-color: rgba(34,211,238,0.15);">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online Now</p>
            <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background: rgba(34,211,238,0.1);">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <p class="font-serif text-3xl font-bold text-cyan-400">{{ onlineCount }}</p>
          <p class="text-xs text-slate-600 mt-2">Active sessions</p>
        </div>
      </div>

      <!-- Order status breakdown — dark pill row -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div v-for="s in statusBreakdown" :key="s.key" class="rounded-xl border p-4 text-center transition" style="background: #111827; border-color: rgba(255,255,255,0.05);">
          <div :class="['w-2.5 h-2.5 rounded-full mx-auto mb-2', s.dot]"></div>
          <p class="font-serif text-2xl font-bold" :class="s.color">{{ orderStats[s.key] || 0 }}</p>
          <p class="text-xs text-slate-600 capitalize font-medium mt-0.5">{{ s.label }}</p>
        </div>
      </div>

      <!-- Revenue Chart + Low stock -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2 rounded-2xl border p-6" style="background: #111827; border-color: rgba(139,92,246,0.15);">
          <h3 class="font-serif font-bold text-white mb-4">Revenue Trend — 30 Days</h3>
          <div class="h-72"><canvas ref="revenueChart"></canvas></div>
        </div>
        <div class="rounded-2xl border p-6" style="background: #111827; border-color: rgba(139,92,246,0.15);">
          <h3 class="font-serif font-bold text-white mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>Low Stock
          </h3>
          <div v-if="lowStockItems.length === 0" class="text-center py-8">
            <svg class="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-sm text-slate-500">All stock healthy</p>
          </div>
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="item in lowStockItems" :key="item.id" class="flex items-center justify-between p-3 rounded-lg border" style="background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.2);">
              <div>
                <p class="text-sm font-semibold text-slate-200">{{ item.name }}</p>
                <p class="text-xs text-slate-500">Reorder at {{ item.reorder_point }}</p>
              </div>
              <span class="text-sm font-black text-red-400">{{ item.current_stock }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top products — dark card -->
      <div class="rounded-2xl border p-6" style="background: #111827; border-color: rgba(139,92,246,0.15);">
        <h3 class="font-serif font-bold text-white mb-5">Top Selling Products (30d)</h3>
        <div v-if="topProducts.length === 0" class="text-center py-6 text-slate-600 text-sm">No sales data yet</div>
        <div v-else class="space-y-3">
          <div v-for="(prod, idx) in topProducts" :key="prod.product_id"
            class="flex items-center gap-4 p-3 rounded-xl transition border"
            style="border-color: rgba(255,255,255,0.04);"
            @mouseover="e => e.currentTarget.style.background='rgba(139,92,246,0.06)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
            <div class="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm text-violet-950" style="background: linear-gradient(135deg, #a78bfa, #7c3aed);">{{ idx+1 }}</div>
            <img :src="prod.Product?.image_url || '/placeholder.jpg'" class="w-10 h-10 rounded-lg object-cover" />
            <div class="flex-1">
              <p class="font-semibold text-slate-200">{{ prod.Product?.name }}</p>
              <p class="text-xs text-slate-500">{{ prod.totalSold }} units sold</p>
            </div>
            <p class="font-black text-violet-400">KES {{ formatPrice(prod.revenue || 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PRODUCTS TAB ================= -->
    <div v-if="activeTab === 'products'">
      <div class="rounded-2xl border overflow-hidden" style="background: #111827; border-color: rgba(139,92,246,0.15);">
        <div class="flex justify-between items-center px-6 py-5 border-b" style="border-color: rgba(139,92,246,0.1);">
          <h2 class="font-serif text-xl font-bold text-white">Products</h2>
          <button @click="openProductModal()" class="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-violet-950 transition hover:opacity-90" style="background: linear-gradient(135deg, #a78bfa, #7c3aed);">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add Product
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs text-slate-500 font-semibold uppercase tracking-wider" style="background: rgba(255,255,255,0.03);">
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
            <tbody>
              <tr v-for="prod in products" :key="prod.id"
                class="border-t transition"
                style="border-color: rgba(255,255,255,0.04);"
                @mouseover="e => e.currentTarget.style.background='rgba(139,92,246,0.05)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
                <td class="px-4 py-3"><img :src="prod.image_url || '/placeholder.jpg'" class="w-12 h-12 object-cover rounded-lg" /></td>
                <td class="px-4 py-3 font-semibold text-slate-200">{{ prod.name }}</td>
                <td class="px-4 py-3 text-sm text-slate-500">{{ prod.sku }}</td>
                <td class="px-4 py-3 text-sm text-slate-400">{{ prod.Category?.name || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm font-medium text-slate-300">KES {{ formatPrice(prod.retail_price) }}</td>
                <td class="px-4 py-3 text-sm font-medium text-slate-300">KES {{ formatPrice(prod.wholesale_price) }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-sm font-bold px-2 py-0.5 rounded-full', prod.current_stock <= prod.reorder_point ? 'text-red-400' : 'text-emerald-400']" :style="prod.current_stock <= prod.reorder_point ? 'background: rgba(239,68,68,0.1);' : 'background: rgba(52,211,153,0.1);'">
                    {{ prod.current_stock }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="openProductModal(prod)" class="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button @click="deleteProduct(prod.id)" class="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="8" class="px-4 py-14 text-center text-slate-600">No products yet. Click "Add Product" to get started.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= USERS TAB ================= -->
    <div v-if="activeTab === 'users'">
      <div class="rounded-2xl border overflow-hidden" style="background: #111827; border-color: rgba(139,92,246,0.15);">
        <div class="px-6 py-5 border-b flex justify-between items-center" style="border-color: rgba(139,92,246,0.1);">
          <div>
            <h3 class="font-serif font-bold text-lg text-white">User Management</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ users.length }} registered users</p>
          </div>
          <button @click="fetchUsers" class="text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead style="background: rgba(255,255,255,0.03);">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">Tier</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">Role</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">Credit Limit</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">KYC</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id"
                class="border-t transition"
                style="border-color: rgba(255,255,255,0.04);"
                @mouseover="e => e.currentTarget.style.background='rgba(139,92,246,0.05)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background: linear-gradient(135deg, #a78bfa, #ec4899);">
                      {{ (user.business_name || user.username || '?')[0].toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-200">{{ user.business_name || user.username }}</p>
                      <p class="text-xs text-slate-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="['text-xs font-bold px-2 py-1 rounded-full capitalize', user.tier === 'wholesale' ? 'text-blue-400' : 'text-pink-400']" :style="user.tier === 'wholesale' ? 'background: rgba(96,165,250,0.1);' : 'background: rgba(244,114,182,0.1);'">{{ user.tier }}</span>
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.role" @change="updateUserField(user, 'role', user.role)" class="text-sm rounded-lg px-2 py-1.5 outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);">
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <input type="number" v-model.number="user.credit_limit" @blur="updateUserField(user, 'credit_limit', user.credit_limit)" class="w-28 px-2 py-1.5 rounded-lg text-sm outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);" />
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.kyc_status" @change="updateUserField(user, 'kyc_status', user.kyc_status)" class="text-sm rounded-lg px-2 py-1.5 outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);">
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="toggleUserActive(user)"
                    :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none', user.is_active !== false ? 'bg-violet-600' : 'bg-slate-700']"
                    :title="user.is_active !== false ? 'Click to deactivate' : 'Click to activate'">
                    <span :class="['inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform', user.is_active !== false ? 'translate-x-6' : 'translate-x-1']"></span>
                  </button>
                  <span class="ml-2 text-xs font-medium" :class="user.is_active !== false ? 'text-emerald-400' : 'text-slate-600'">
                    {{ user.is_active !== false ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button @click="viewUserDetails(user)" class="text-sm text-violet-400 hover:text-violet-300 font-semibold transition">View</button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="7" class="text-center py-14 text-slate-600">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= ORDERS TAB ================= -->
    <div v-if="activeTab === 'orders'">
      <div class="rounded-2xl border overflow-hidden" style="background: #111827; border-color: rgba(139,92,246,0.15);">
        <div class="px-6 py-5 border-b flex flex-wrap justify-between items-center gap-3" style="border-color: rgba(139,92,246,0.1);">
          <div>
            <h3 class="font-serif font-bold text-lg text-white">All Orders &amp; Payments</h3>
            <p class="text-xs text-slate-500 mt-0.5">{{ allOrders.length }} orders · live platform-wide view</p>
          </div>
          <div class="flex items-center gap-2">
            <select v-model="orderFilter" class="text-sm rounded-lg px-3 py-1.5 outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button @click="fetchAllOrders" class="text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Payment summary strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-px" style="background: rgba(139,92,246,0.1);">
          <div class="p-4" style="background: #111827;">
            <p class="text-xs text-slate-500 uppercase tracking-wider">Total Orders</p>
            <p class="text-xl font-bold text-white">{{ allOrders.length }}</p>
          </div>
          <div class="p-4" style="background: #111827;">
            <p class="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
            <p class="text-xl font-bold text-emerald-400">{{ paidOrdersCount }}</p>
          </div>
          <div class="p-4" style="background: #111827;">
            <p class="text-xs text-slate-500 uppercase tracking-wider">Pending Payment</p>
            <p class="text-xl font-bold text-amber-400">{{ pendingPaymentCount }}</p>
          </div>
          <div class="p-4" style="background: #111827;">
            <p class="text-xs text-slate-500 uppercase tracking-wider">Revenue (paid)</p>
            <p class="text-xl font-bold text-white">KES {{ formatPrice(paidRevenue) }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead style="background: rgba(255,255,255,0.03);">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in filteredAdminOrders" :key="o.id" class="border-t" style="border-color: rgba(255,255,255,0.04);"
                @mouseover="e => e.currentTarget.style.background='rgba(139,92,246,0.05)'" @mouseleave="e => e.currentTarget.style.background='transparent'">
                <td class="px-5 py-3.5">
                  <p class="font-semibold text-slate-200 text-sm">#{{ o.order_number }}</p>
                  <p class="text-xs text-slate-500">{{ o.OrderItems?.length || 0 }} item(s) · {{ o.payment_method || '—' }}</p>
                </td>
                <td class="px-5 py-3.5">
                  <p class="text-sm text-slate-300">{{ o.User?.business_name || o.User?.username || '—' }}</p>
                  <p class="text-xs text-slate-500 capitalize">{{ o.User?.tier || '' }}</p>
                </td>
                <td class="px-5 py-3.5 font-bold text-white text-sm">KES {{ formatPrice(o.total_amount) }}</td>
                <td class="px-5 py-3.5">
                  <span class="text-xs font-bold px-2 py-1 rounded-full capitalize"
                    :style="['completed','paid'].includes(o.payment_status) ? 'background: rgba(16,185,129,0.12); color:#34d399;' : o.payment_status === 'failed' ? 'background: rgba(239,68,68,0.12); color:#f87171;' : 'background: rgba(245,158,11,0.12); color:#fbbf24;'">
                    {{ o.payment_status || 'pending' }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <span class="text-xs font-bold px-2 py-1 rounded-full capitalize text-slate-300" style="background: rgba(255,255,255,0.06);">{{ o.status }}</span>
                </td>
                <td class="px-5 py-3.5 text-xs text-slate-500">{{ formatDate(o.createdAt) }}</td>
              </tr>
              <tr v-if="filteredAdminOrders.length === 0">
                <td colspan="6" class="text-center py-14 text-slate-600">No orders found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= ANALYTICS TAB ================= -->
    <div v-if="activeTab === 'analytics'">
      <div class="rounded-2xl border p-6" style="background: #111827; border-color: rgba(139,92,246,0.15);">
        <h3 class="font-serif font-bold text-lg text-white mb-6">Download Financial Reports</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="rounded-xl border p-5" style="background: rgba(255,255,255,0.03); border-color: rgba(139,92,246,0.15);">
            <h4 class="font-bold text-slate-200 mb-4">Orders Report</h4>
            <div class="flex gap-2 mb-4">
              <input type="date" v-model="reportStartDate" class="flex-1 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);" />
              <input type="date" v-model="reportEndDate" class="flex-1 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);" />
            </div>
            <div class="flex gap-2">
              <button @click="downloadReport('orders', 'csv')" class="flex-1 py-2 rounded-lg text-sm font-bold text-violet-950 transition hover:opacity-90" style="background: linear-gradient(135deg, #a78bfa, #7c3aed);">CSV</button>
              <button @click="downloadReport('orders', 'pdf')" class="flex-1 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90" style="background: rgba(239,68,68,0.8);">PDF</button>
            </div>
          </div>
          <div class="rounded-xl border p-5" style="background: rgba(255,255,255,0.03); border-color: rgba(139,92,246,0.15);">
            <h4 class="font-bold text-slate-200 mb-4">Products Sold</h4>
            <div class="flex gap-2 mb-4">
              <input type="date" v-model="reportStartDate" class="flex-1 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);" />
              <input type="date" v-model="reportEndDate" class="flex-1 rounded-lg px-2 py-1.5 text-sm outline-none text-slate-300" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(139,92,246,0.2);" />
            </div>
            <div class="flex gap-2">
              <button @click="downloadReport('products_sold', 'csv')" class="flex-1 py-2 rounded-lg text-sm font-bold text-violet-950 transition hover:opacity-90" style="background: linear-gradient(135deg, #a78bfa, #7c3aed);">CSV</button>
              <button @click="downloadReport('products_sold', 'pdf')" class="flex-1 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90" style="background: rgba(239,68,68,0.8);">PDF</button>
            </div>
          </div>
          <div class="rounded-xl border p-5" style="background: rgba(255,255,255,0.03); border-color: rgba(139,92,246,0.15);">
            <h4 class="font-bold text-slate-200 mb-4">Stock Report</h4>
            <p class="text-xs text-slate-600 mb-4">Current inventory snapshot</p>
            <div class="flex gap-2 mt-6">
              <button @click="downloadReport('stock', 'csv')" class="flex-1 py-2 rounded-lg text-sm font-bold text-violet-950 transition hover:opacity-90" style="background: linear-gradient(135deg, #a78bfa, #7c3aed);">CSV</button>
              <button @click="downloadReport('stock', 'pdf')" class="flex-1 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90" style="background: rgba(239,68,68,0.8);">PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PRODUCT MODAL ================= -->
    <Modal :show="productModalVisible" @close="closeProductModal">
      <div class="max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="px-6 py-5 flex items-center gap-3" style="background: linear-gradient(135deg, #7c3aed, #a78bfa);">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <h3 class="font-serif text-xl font-bold text-white">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            <p class="text-xs text-white/70">{{ editingProduct ? 'Update the details below' : 'Fill in the details to list a new product' }}</p>
          </div>
        </div>

        <form @submit.prevent="saveProduct" class="p-6 space-y-5">
          <!-- Image dropzone -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>
            <label class="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition cursor-pointer">
              <div class="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                <img v-if="imagePreview || productForm.image_url" :src="imagePreview || productForm.image_url" class="w-full h-full object-cover" />
                <svg v-else class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-purple-700">Click to upload image</p>
                <p class="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
              </div>
              <input type="file" @change="onImageSelect" accept="image/*" class="hidden" />
            </label>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input v-model="productForm.name" type="text" required placeholder="e.g. Argan Oil Hair Serum 100ml"
              class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">SKU *</label>
              <input v-model="productForm.sku" type="text" required placeholder="ARG-100"
                class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select v-model="productForm.category_id" class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea v-model="productForm.description" rows="3" placeholder="Short description shown to customers…"
              class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-none transition"></textarea>
          </div>

          <!-- Pricing -->
          <div class="rounded-2xl bg-gray-50 p-4 space-y-4">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing & Stock</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Retail Price (KES)</label>
                <input v-model.number="productForm.retail_price" type="number" step="0.01" required
                  class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Wholesale Price (KES)</label>
                <input v-model.number="productForm.wholesale_price" type="number" step="0.01" required
                  class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white transition" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Current Stock</label>
                <input v-model.number="productForm.current_stock" type="number" required
                  class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Reorder At</label>
                <input v-model.number="productForm.reorder_point" type="number"
                  class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none bg-white transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Unit</label>
                <select v-model="productForm.unit" class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-purple-400 outline-none transition">
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="box">Box</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="closeProductModal" class="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-600">Cancel</button>
            <button type="submit" class="px-6 py-2.5 text-white rounded-xl transition text-sm font-bold hover:opacity-90 flex items-center gap-2" style="background: linear-gradient(135deg, #7c3aed, #a78bfa);">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ editingProduct ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- ================= DELETE PRODUCT CONFIRMATION ================= -->
    <div v-if="productToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="productToDelete = null">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <h3 class="font-serif text-xl font-bold text-gray-900 mb-1">Delete this product?</h3>
          <p class="text-sm text-gray-500 mb-1">
            <span class="font-semibold text-gray-700">{{ productToDelete.name || 'This product' }}</span> will be removed from your catalogue.
          </p>
          <p class="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="productToDelete = null" class="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-600">Cancel</button>
            <button @click="confirmDeleteProduct" :disabled="deletingProduct" class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl transition text-sm font-bold flex items-center justify-center gap-2">
              <svg v-if="deletingProduct" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ deletingProduct ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

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
  { key: 'orders', label: 'Orders' },
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

// ---------- All Orders (platform-wide) ----------
const allOrders = ref([])
const orderFilter = ref('all')

const fetchAllOrders = async () => {
  try {
    const { data } = await api.get('/orders?limit=200')
    allOrders.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to load all orders:', e)
  }
}

const filteredAdminOrders = computed(() =>
  orderFilter.value === 'all'
    ? allOrders.value
    : allOrders.value.filter(o => o.status === orderFilter.value)
)
const paidOrdersCount = computed(() =>
  allOrders.value.filter(o => ['completed', 'paid'].includes(o.payment_status)).length
)
const pendingPaymentCount = computed(() =>
  allOrders.value.filter(o => !['completed', 'paid'].includes(o.payment_status) && o.payment_status !== 'failed').length
)
const paidRevenue = computed(() =>
  allOrders.value
    .filter(o => ['completed', 'paid'].includes(o.payment_status))
    .reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0)
)

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

// Styled delete confirmation (replaces browser confirm)
const productToDelete = ref(null)
const deletingProduct = ref(false)

const deleteProduct = (id) => {
  productToDelete.value = products.value.find(p => p.id === id) || { id }
}

const confirmDeleteProduct = async () => {
  if (!productToDelete.value) return
  deletingProduct.value = true
  try {
    await api.delete(`/products/${productToDelete.value.id}`)
    toast.success('Product deleted')
    productToDelete.value = null
    fetchProducts()
  } catch {
    toast.error('Failed to delete product')
  } finally {
    deletingProduct.value = false
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
  fetchAllOrders()

  const socket = getSocket()
  if (socket) {
    socket.on('orderUpdate', () => { fetchAnalytics(); fetchAllOrders() })
    socket.on('walletUpdate', fetchUsers)
    socket.on('onlineCount', ({ count }) => { onlineCount.value = count })
    // A new order placed by any customer → refresh the live orders list
    socket.on('newOrder', () => { fetchAnalytics(); fetchAllOrders() })
    // Rider delivered + customer confirmed → refresh and notify
    socket.on('deliveryConfirmed', (data) => {
      toast.success(data.message || 'A delivery was confirmed by a customer')
      fetchAnalytics(); fetchAllOrders()
    })
  }
  pollInterval = setInterval(() => { fetchAnalytics(); fetchAllOrders() }, 60000)
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
