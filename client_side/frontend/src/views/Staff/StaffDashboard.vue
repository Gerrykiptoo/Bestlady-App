<template>
  <div class="min-h-screen" style="background: #f8f7f5;">

    <!-- Staff operations header — charcoal with amber accent -->
    <div style="background: linear-gradient(135deg, #18181b 0%, #27272a 60%, #1c1c1e 100%); position: relative; overflow: hidden; border-bottom: 3px solid #f59e0b;">
      <div style="position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:rgba(245,158,11,0.04);"></div>
      <div class="container-custom relative z-10 py-10">
        <p class="text-amber-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Operations Centre</p>
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 class="font-serif text-4xl font-bold text-white">Logistics Command</h1>
            <p class="text-zinc-500 mt-2 text-sm">Pack orders, dispatch fleet, publish content — everything in one queue.</p>
          </div>
          <div class="flex items-center gap-2.5 rounded-xl px-4 py-2.5 border border-zinc-700" style="background: rgba(255,255,255,0.04);">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
            <span class="text-sm font-semibold text-zinc-300">Live feed active</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom py-8 space-y-8">

      <!-- ══ Kanban lane tab buttons ══ -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Unpaid lane -->
        <button @click="activeTab = 'unpaid'"
          class="rounded-2xl p-5 text-left transition-all duration-200 border-2"
          :style="activeTab === 'unpaid' ? 'background: #fff8e6; border-color: #f59e0b; box-shadow: 0 4px 20px rgba(245,158,11,0.15);' : 'background: white; border-color: #e5e7eb;'"
          :class="activeTab !== 'unpaid' ? 'hover:border-amber-200 hover:shadow-md' : ''">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="activeTab === 'unpaid' ? 'background: rgba(245,158,11,0.12);' : 'background: #fef3c7;'">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-700" :style="activeTab === 'unpaid' ? 'border-color: rgba(245,158,11,0.5); background: rgba(245,158,11,0.1);' : 'border-color: #fde68a; background: #fef3c7;'">Unpaid</span>
          </div>
          <p class="font-serif text-3xl font-bold text-zinc-800">{{ counts.pendingOrders || 0 }}</p>
          <p class="text-sm text-zinc-500 mt-1 font-medium">Awaiting Payment</p>
        </button>

        <!-- Paid/Pack lane -->
        <button @click="activeTab = 'paid'"
          class="rounded-2xl p-5 text-left transition-all duration-200 border-2"
          :style="activeTab === 'paid' ? 'background: #f0fdf4; border-color: #22c55e; box-shadow: 0 4px 20px rgba(34,197,94,0.12);' : 'background: white; border-color: #e5e7eb;'"
          :class="activeTab !== 'paid' ? 'hover:border-green-200 hover:shadow-md' : ''">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="activeTab === 'paid' ? 'background: rgba(34,197,94,0.12);' : 'background: #dcfce7;'">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border text-green-700" :style="activeTab === 'paid' ? 'border-color: rgba(34,197,94,0.5); background: rgba(34,197,94,0.1);' : 'border-color: #bbf7d0; background: #dcfce7;'">Ready to Pack</span>
          </div>
          <p class="font-serif text-3xl font-bold text-zinc-800">{{ (counts.paidOrders || 0) + (counts.processingOrders || 0) }}</p>
          <p class="text-sm text-zinc-500 mt-1 font-medium">Paid Orders</p>
        </button>

        <!-- Dispatch lane -->
        <button @click="activeTab = 'logistics'"
          class="rounded-2xl p-5 text-left transition-all duration-200 border-2"
          :style="activeTab === 'logistics' ? 'background: #eff6ff; border-color: #3b82f6; box-shadow: 0 4px 20px rgba(59,130,246,0.12);' : 'background: white; border-color: #e5e7eb;'"
          :class="activeTab !== 'logistics' ? 'hover:border-blue-200 hover:shadow-md' : ''">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="activeTab === 'logistics' ? 'background: rgba(59,130,246,0.12);' : 'background: #dbeafe;'">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-700" :style="activeTab === 'logistics' ? 'border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.1);' : 'border-color: #bfdbfe; background: #dbeafe;'">Dispatch</span>
          </div>
          <p class="font-serif text-3xl font-bold text-zinc-800">{{ counts.readyOrders || 0 }}</p>
          <p class="text-sm text-zinc-500 mt-1 font-medium">Ready to Ship</p>
        </button>

        <!-- CMS lane -->
        <button @click="activeTab = 'content'"
          class="rounded-2xl p-5 text-left transition-all duration-200 border-2"
          :style="activeTab === 'content' ? 'background: #faf5ff; border-color: #9333ea; box-shadow: 0 4px 20px rgba(147,51,234,0.12);' : 'background: white; border-color: #e5e7eb;'"
          :class="activeTab !== 'content' ? 'hover:border-purple-200 hover:shadow-md' : ''">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="activeTab === 'content' ? 'background: rgba(147,51,234,0.12);' : 'background: #f3e8ff;'">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border text-purple-700" :style="activeTab === 'content' ? 'border-color: rgba(147,51,234,0.5); background: rgba(147,51,234,0.1);' : 'border-color: #e9d5ff; background: #f3e8ff;'">CMS</span>
          </div>
          <p class="font-serif text-3xl font-bold text-zinc-800">{{ contentItems.length }}</p>
          <p class="text-sm text-zinc-500 mt-1 font-medium">Content Items</p>
        </button>

      </div>

      <!-- ══ UNPAID ORDERS TAB ══ -->
      <div v-if="activeTab === 'unpaid'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Order list -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 class="font-bold text-slate-800">Unpaid Orders — Awaiting Payment</h3>
              <span class="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ unpaidQueue.length }}</span>
            </div>
            <button @click="fetchStats" class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          <!-- New order live alert -->
          <Transition name="fade-slide">
            <div v-if="liveNewOrder" class="flex items-center gap-3 px-6 py-3 bg-blue-50 border-b border-blue-100">
              <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black text-blue-800">New Order Incoming!</p>
                <p class="text-xs text-blue-600 truncate">
                  <strong>{{ liveNewOrder.clientName }}</strong> · KES {{ formatPrice(liveNewOrder.totalAmount) }} · {{ liveNewOrder.paymentMethod }}
                </p>
              </div>
              <button @click="liveNewOrder = null" class="text-blue-400 hover:text-blue-600 transition p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </Transition>

          <!-- Loading -->
          <div v-if="statsLoading" class="divide-y divide-slate-100">
            <div v-for="i in 4" :key="i" class="p-5 flex gap-4">
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-100 rounded animate-pulse w-1/3"></div>
                <div class="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
                <div class="h-3 bg-slate-100 rounded animate-pulse w-2/3"></div>
              </div>
              <div class="w-24 h-10 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="unpaidQueue.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="font-bold text-slate-600">All Clear!</p>
            <p class="text-sm text-slate-400 mt-1">No unpaid orders at the moment.</p>
          </div>

          <!-- Order rows -->
          <div v-else class="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            <div v-for="order in unpaidQueue" :key="order.id"
              :class="order._isNew ? 'bg-green-50 border-l-4 border-green-400' : 'hover:bg-slate-50'"
              class="p-5 transition-colors">
              <div class="flex items-start gap-4">
                <!-- Order icon -->
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 bg-amber-400">
                  {{ (order.order_number || '').slice(-3) }}
                </div>
                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <p class="text-sm font-black text-slate-900">Order #{{ order.order_number }}</p>
                    <span v-if="order._isNew" class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">NEW</span>
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unpaid</span>
                  </div>
                  <p class="text-sm font-semibold text-slate-700">{{ order.User?.business_name || order.User?.username || 'Unknown Customer' }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ formatDateTime(order.createdAt) }} &nbsp;·&nbsp; {{ order.payment_method }} &nbsp;·&nbsp; {{ order.delivery_channel || 'delivery' }}
                  </p>
                  <!-- Items chips -->
                  <div v-if="order.OrderItems?.length" class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="item in order.OrderItems.slice(0, 4)" :key="item.id"
                      class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {{ item.Product?.name || 'Product' }} ×{{ item.quantity }}
                    </span>
                    <span v-if="order.OrderItems.length > 4" class="text-[10px] text-slate-400 font-medium">
                      +{{ order.OrderItems.length - 4 }} more
                    </span>
                  </div>
                </div>
                <!-- Amount + actions -->
                <div class="flex-shrink-0 text-right">
                  <p class="text-base font-black text-slate-900">KES {{ formatPrice(order.total_amount) }}</p>
                  <p class="text-xs text-amber-600 font-semibold mt-0.5 capitalize">{{ order.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="space-y-5">
          <!-- Low stock alerts -->
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <h4 class="font-bold text-slate-800 text-sm">Low Stock Alerts</h4>
            </div>
            <div v-if="lowStockItems.length === 0" class="py-8 text-center text-slate-400 text-sm">
              <svg class="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              All stock levels OK
            </div>
            <div v-else class="divide-y divide-slate-50">
              <div v-for="item in lowStockItems" :key="item.id" class="flex items-center gap-3 px-5 py-3">
                <img v-if="item.image_url" :src="item.image_url" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                <div v-else class="w-9 h-9 rounded-lg bg-slate-100 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-red-600 font-semibold">{{ item.current_stock }} {{ item.unit || 'units' }} left</p>
                </div>
                <span class="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex-shrink-0">Low</span>
              </div>
            </div>
          </div>

          <!-- Tip card -->
          <div class="rounded-2xl p-5 text-white" style="background: #18181b;">
            <p class="font-bold text-sm mb-2">Logistics Note</p>
            <p class="text-xs text-slate-400 leading-relaxed">Standard delivery window for Nairobi is 2 hours. Ensure all 'Ready' orders are dispatched before 4:00 PM today.</p>
          </div>
        </div>
      </div>

      <!-- ══ PAID ORDERS TAB ══ -->
      <div v-if="activeTab === 'paid'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-green-100 bg-green-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <h3 class="font-bold text-slate-800">Paid Orders — Ready to Pack</h3>
              <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ paidQueue.length }}</span>
            </div>
            <button @click="fetchStats" class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          <div v-if="statsLoading" class="divide-y divide-slate-100">
            <div v-for="i in 4" :key="i" class="p-5 flex gap-4">
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-100 rounded animate-pulse w-1/3"></div>
                <div class="h-3 bg-slate-100 rounded animate-pulse w-2/3"></div>
              </div>
              <div class="w-28 h-10 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>

          <div v-else-if="paidQueue.length === 0" class="py-16 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <p class="font-bold text-slate-600">Queue Empty</p>
            <p class="text-sm text-slate-400 mt-1">No paid orders waiting to be packed.</p>
          </div>

          <div v-else class="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            <div v-for="order in paidQueue" :key="order.id"
              class="p-5 hover:bg-slate-50 transition-colors">
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  :class="order.status === 'paid' ? 'bg-green-500' : 'bg-blue-500'">
                  {{ (order.order_number || '').slice(-3) }}
                </div>
                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <p class="text-sm font-black text-slate-900">Order #{{ order.order_number }}</p>
                    <span class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid</span>
                    <span :class="order.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'"
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border">{{ order.status }}</span>
                  </div>
                  <p class="text-sm font-semibold text-slate-700">{{ order.User?.business_name || order.User?.username || 'Unknown Customer' }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ formatDateTime(order.createdAt) }} &nbsp;·&nbsp; {{ order.payment_method }} &nbsp;·&nbsp; {{ order.delivery_channel || 'delivery' }}
                  </p>
                  <!-- Items -->
                  <div v-if="order.OrderItems?.length" class="mt-2 flex flex-wrap gap-1.5">
                    <span v-for="item in order.OrderItems.slice(0, 4)" :key="item.id"
                      class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {{ item.Product?.name || 'Product' }} ×{{ item.quantity }}
                    </span>
                    <span v-if="order.OrderItems.length > 4" class="text-[10px] text-slate-400 font-medium">
                      +{{ order.OrderItems.length - 4 }} more
                    </span>
                  </div>
                </div>
                <!-- Amount + actions -->
                <div class="flex-shrink-0 text-right">
                  <p class="text-base font-black text-slate-900">KES {{ formatPrice(order.total_amount) }}</p>
                  <div class="mt-2 flex flex-col gap-1.5">
                    <button v-if="order.status === 'paid'"
                      @click="updateStatus(order.id, 'processing')"
                      class="text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                      Start Packing
                    </button>
                    <button v-if="order.status === 'processing'"
                      @click="updateStatus(order.id, 'ready')"
                      class="text-[11px] font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                      Mark Ready
                    </button>
                    <button v-if="order.status === 'ready'"
                      @click="updateStatus(order.id, 'dispatched')"
                      class="text-[11px] font-bold bg-slate-800 hover:bg-black text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                      Dispatch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar (same stock alerts) -->
        <div class="space-y-5">
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <h4 class="font-bold text-slate-800 text-sm">Low Stock Alerts</h4>
            </div>
            <div v-if="lowStockItems.length === 0" class="py-8 text-center text-slate-400 text-sm">All stock levels OK</div>
            <div v-else class="divide-y divide-slate-50">
              <div v-for="item in lowStockItems" :key="item.id" class="flex items-center gap-3 px-5 py-3">
                <img v-if="item.image_url" :src="item.image_url" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" @error="e => e.target.style.display='none'" />
                <div v-else class="w-9 h-9 rounded-lg bg-slate-100 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-red-600 font-semibold">{{ item.current_stock }} {{ item.unit || 'units' }} left</p>
                </div>
                <span class="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex-shrink-0">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ LOGISTICS TAB ══ -->
      <div v-if="activeTab === 'logistics'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-800">All Recent Orders</h3>
            <button @click="fetchStats" class="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          <div v-if="statsLoading" class="divide-y divide-slate-100">
            <div v-for="i in 5" :key="i" class="p-4 flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3.5 bg-slate-100 rounded animate-pulse w-1/3"></div>
                <div class="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
              </div>
              <div class="w-20 h-6 bg-slate-100 rounded animate-pulse"></div>
            </div>
          </div>

          <div v-else-if="recentOrders.length === 0" class="py-14 text-center text-slate-400 text-sm">No orders yet.</div>

          <div v-else class="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            <div v-for="order in recentOrders" :key="order.id"
              class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0"
                :class="statusBg(order.status)">
                {{ (order.order_number || '').slice(-3) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-slate-800">Order #{{ order.order_number }}</p>
                  <span :class="statusClass(order.status)" class="text-[10px] font-black uppercase px-2 py-0.5 rounded">{{ order.status }}</span>
                  <span :class="order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'" class="text-[10px] font-bold px-2 py-0.5 rounded">
                    {{ order.payment_status === 'completed' ? 'Paid' : 'Unpaid' }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">{{ order.User?.business_name || 'Individual Customer' }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ formatDateTime(order.createdAt) }} · {{ order.OrderItems?.length || 0 }} item(s) · KES {{ formatPrice(order.total_amount) }}</p>
              </div>
              <div class="flex-shrink-0">
                <button v-if="order.status === 'paid'" @click="updateStatus(order.id, 'processing')"
                  class="text-[10px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Pack
                </button>
                <button v-else-if="order.status === 'processing'" @click="updateStatus(order.id, 'ready')"
                  class="text-[10px] font-bold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                  Ready
                </button>
                <button v-else-if="order.status === 'ready'" @click="updateStatus(order.id, 'dispatched')"
                  class="text-[10px] font-bold bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-black transition">
                  Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <h4 class="font-bold text-slate-800 text-sm">Low Stock Alerts</h4>
            </div>
            <div v-if="lowStockItems.length === 0" class="py-6 text-center text-slate-400 text-sm">All stock levels OK</div>
            <div v-else class="divide-y divide-slate-50">
              <div v-for="item in lowStockItems" :key="item.id" class="flex items-center gap-3 px-5 py-3">
                <img v-if="item.image_url" :src="item.image_url" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" @error="e => e.target.style.display='none'" />
                <div v-else class="w-9 h-9 rounded-lg bg-slate-100 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-red-600 font-semibold">{{ item.current_stock }} {{ item.unit || 'units' }} left</p>
                </div>
                <span class="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Low</span>
              </div>
            </div>
          </div>
          <div class="rounded-2xl p-5 text-white" style="background: #18181b;">
            <p class="font-bold text-sm text-white mb-2">Logistics Note</p>
            <p class="text-xs text-slate-400 leading-relaxed">Standard delivery for Nairobi is 2 hrs. Dispatch all 'Ready' orders before 4:00 PM.</p>
          </div>
        </div>
      </div>

      <!-- ══ CONTENT TAB ══ -->
      <div v-if="activeTab === 'content'" class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Content list -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Type pills -->
          <div class="flex flex-wrap gap-2">
            <button v-for="ct in contentTypes" :key="ct.key"
              @click="selectContentType(ct.key)"
              :class="activeContentType === ct.key
                ? 'text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-700'"
              :style="activeContentType === ct.key ? 'background: var(--brand-gradient)' : ''"
              class="px-4 py-2 rounded-full text-sm font-semibold transition">
              {{ ct.label }}
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-bold text-slate-800">{{ contentTypes.find(c => c.key === activeContentType)?.label }}</h3>
              <button @click="openContentEditor()" class="btn-primary text-sm px-4 py-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                New {{ activeContentType === 'blog' ? 'Post' : 'Item' }}
              </button>
            </div>

            <div v-if="contentLoading" class="p-6 space-y-3">
              <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded-xl animate-pulse"></div>
            </div>
            <div v-else-if="contentItems.length === 0" class="py-14 text-center">
              <svg class="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p class="text-sm text-slate-500 font-medium">No content yet</p>
              <p class="text-xs text-slate-400 mt-1">Create your first item above.</p>
            </div>
            <div v-else class="divide-y divide-slate-100">
              <div v-for="item in contentItems" :key="item.id"
                class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <span :class="item.is_published ? 'bg-green-500' : 'bg-slate-300'" class="w-2 h-2 rounded-full flex-shrink-0"></span>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-slate-800 truncate">{{ item.title || '(untitled)' }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ item.is_published ? 'Published' : 'Draft' }} &nbsp;·&nbsp; {{ formatDate(item.updatedAt) }}
                  </p>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button @click="openContentEditor(item)" title="Edit"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="deleteContent(item)" title="Delete"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content sidebar -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h4 class="font-bold text-slate-800 mb-3 text-sm">Content Tips</h4>
            <ul class="space-y-2 text-xs text-slate-500">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></span>
                Blog posts appear on the public blog page.
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></span>
                FAQs are displayed on the FAQ page sorted by date.
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></span>
                Set status to <strong>Published</strong> for content to go live.
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div><!-- end container -->

    <!-- ══ Content Editor Modal ══ -->
    <Modal :show="showContentModal" @close="showContentModal = false" size="lg">
      <div class="p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-lg font-black text-slate-800 mb-5">
          {{ editingContent ? 'Edit' : 'New' }} {{ contentTypes.find(c => c.key === activeContentType)?.label }}
        </h3>
        <form @submit.prevent="saveContent" class="space-y-4">
          <div v-if="['blog', 'faq', 'shipping_info', 'return_policy', 'track_orders'].includes(activeContentType)">
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              {{ activeContentType === 'faq' ? 'Question' : 'Title' }}
            </label>
            <input v-model="contentForm.title" type="text" required
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">
              {{ activeContentType === 'faq' ? 'Answer' : 'Content' }}
            </label>
            <textarea v-model="contentForm.body" rows="10" required
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-y font-mono transition"></textarea>
            <p class="text-xs text-slate-400 mt-1">Basic HTML tags supported: &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;</p>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" @click="contentForm.is_published = !contentForm.is_published"
              :class="contentForm.is_published ? 'bg-green-500' : 'bg-slate-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
              <span :class="contentForm.is_published ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform"></span>
            </button>
            <span class="text-sm font-semibold text-slate-700">
              {{ contentForm.is_published ? 'Published (visible to public)' : 'Draft (hidden from public)' }}
            </span>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showContentModal = false" class="btn-outline px-5 py-2.5">
              Cancel
            </button>
            <button type="submit" :disabled="contentSaving" class="btn-primary px-6 py-2.5">
              {{ contentSaving ? 'Saving...' : 'Save Content' }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '@/services/api'
import { formatPrice, formatDate, formatDateTime } from '@/utils/formatters'
import { useToast } from 'vue-toast-notification'
import Modal from '@/components/common/Modal.vue'
import { getSocket } from '@/services/socket'

const toast = useToast()

// ── Tab ──
const activeTab = ref('unpaid')

// ── Order queues ──
const counts = ref({ pendingOrders: 0, paidOrders: 0, processingOrders: 0, readyOrders: 0 })
const paidQueue = ref([])
const unpaidQueue = ref([])
const recentOrders = ref([])
const lowStockItems = ref([])
const statsLoading = ref(true)
const liveNewOrder = ref(null)
let flashTimeout = null

// ── Content Management ──
const contentTypes = [
  { key: 'blog',          label: 'Blog Posts' },
  { key: 'faq',           label: 'FAQs' },
  { key: 'shipping_info', label: 'Shipping Info' },
  { key: 'return_policy', label: 'Return Policy' },
  { key: 'track_orders',  label: 'Order Tracking Guide' },
]
const activeContentType = ref('blog')
const contentItems = ref([])
const contentLoading = ref(false)
const showContentModal = ref(false)
const editingContent = ref(null)
const contentSaving = ref(false)
const contentForm = ref({ title: '', body: '', is_published: false })

// ── Helpers ──
const statusClass = (status) => {
  const map = {
    pending:    'bg-amber-100 text-amber-700',
    paid:       'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    ready:      'bg-teal-100 text-teal-700',
    dispatched: 'bg-slate-200 text-slate-700',
    delivered:  'bg-emerald-100 text-emerald-700',
    cancelled:  'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const statusBg = (status) => {
  const map = {
    pending:    'bg-amber-100 text-amber-700',
    paid:       'bg-green-500 text-white',
    processing: 'bg-blue-500 text-white',
    ready:      'bg-teal-500 text-white',
    dispatched: 'bg-slate-500 text-white',
    delivered:  'bg-emerald-500 text-white',
    cancelled:  'bg-red-400 text-white',
  }
  return map[status] || 'bg-slate-100 text-slate-600'
}

// ── Data fetching ──
const fetchStats = async () => {
  statsLoading.value = true
  try {
    const { data } = await api.get('/staff/stats')
    counts.value     = data.counts       || {}
    paidQueue.value  = data.paidQueue    || []
    unpaidQueue.value = data.unpaidQueue || []
    recentOrders.value = data.recentOrders || []
    lowStockItems.value = data.lowStock  || []
  } catch (error) {
    console.error('Staff stats error:', error)
    toast.error('Failed to load staff data')
  } finally {
    statsLoading.value = false
  }
}

const updateStatus = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, { status })
    toast.success(`Order updated to ${status}`)
    fetchStats()
  } catch {
    toast.error('Failed to update order status')
  }
}

// ── Content ──
const selectContentType = async (type) => {
  activeContentType.value = type
  await loadContentItems()
}

const loadContentItems = async () => {
  contentLoading.value = true
  try {
    const { data } = await api.get(`/content/staff/${activeContentType.value}`)
    contentItems.value = data
  } catch {
    contentItems.value = []
  } finally {
    contentLoading.value = false
  }
}

const openContentEditor = (item = null) => {
  editingContent.value = item
  contentForm.value = item
    ? { title: item.title || '', body: item.body || '', is_published: !!item.is_published }
    : { title: '', body: '', is_published: false }
  showContentModal.value = true
}

const saveContent = async () => {
  contentSaving.value = true
  try {
    if (editingContent.value) {
      await api.put(`/content/${editingContent.value.id}`, contentForm.value)
      toast.success('Content updated')
    } else {
      await api.post('/content', { ...contentForm.value, type: activeContentType.value })
      toast.success('Content created')
    }
    showContentModal.value = false
    await loadContentItems()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save content')
  } finally {
    contentSaving.value = false
  }
}

const deleteContent = async (item) => {
  if (!confirm(`Delete "${item.title || 'this item'}"?`)) return
  try {
    await api.delete(`/content/${item.id}`)
    toast.success('Deleted')
    await loadContentItems()
  } catch {
    toast.error('Failed to delete')
  }
}

// ── Socket ──
let socketListeners = []

const setupSocket = () => {
  const socket = getSocket()
  if (!socket) return

  const onNewOrder = (data) => {
    // Prepend to unpaid queue
    unpaidQueue.value.unshift({
      id: data.id,
      order_number: data.orderNumber,
      total_amount: data.totalAmount,
      status: 'pending',
      payment_status: 'pending',
      payment_method: data.paymentMethod,
      delivery_channel: data.deliveryChannel,
      createdAt: data.createdAt,
      User: { business_name: data.clientName, username: data.clientName },
      OrderItems: [],
      _isNew: true
    })
    counts.value.pendingOrders = (counts.value.pendingOrders || 0) + 1

    // Show live alert banner
    liveNewOrder.value = data
    activeTab.value = 'unpaid'
    clearTimeout(flashTimeout)
    flashTimeout = setTimeout(() => {
      liveNewOrder.value = null
      const idx = unpaidQueue.value.findIndex(o => o.id === data.id)
      if (idx !== -1) unpaidQueue.value[idx]._isNew = false
    }, 10000)

    toast.info(`New order: ${data.clientName} — KES ${formatPrice(data.totalAmount)}`, { duration: 6000 })
  }

  const onOrderUpdate = () => {
    // Refresh queues when any payment/status changes
    fetchStats()
  }

  socket.on('newOrder', onNewOrder)
  socket.on('orderUpdate', onOrderUpdate)
  socketListeners = [['newOrder', onNewOrder], ['orderUpdate', onOrderUpdate]]
}

onMounted(() => {
  fetchStats()
  loadContentItems()
  setupSocket()
})

onBeforeUnmount(() => {
  const socket = getSocket()
  if (socket) socketListeners.forEach(([e, fn]) => socket.off(e, fn))
  clearTimeout(flashTimeout)
})
</script>

<style scoped>
.fade-slide-enter-active { transition: all 0.3s ease; }
.fade-slide-leave-active { transition: all 0.2s ease; }
.fade-slide-enter-from   { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
