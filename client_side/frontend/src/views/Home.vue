<template>
  <div class="bg-[#faf9f7]">

    <!-- ══ Hero ══ -->
    <section class="relative overflow-hidden min-h-[90vh] flex items-center" style="background: linear-gradient(140deg, #1a0533 0%, #3b0764 45%, #7e1d6b 100%);">
      <!-- Organic texture overlay -->
      <div class="absolute inset-0 pointer-events-none" style="background: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      <!-- Warm light leaks -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-20 right-1/3 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl" style="background: radial-gradient(circle, #f59e0b 0%, transparent 70%);"></div>
        <div class="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style="background: radial-gradient(circle, #ec4899 0%, transparent 70%);"></div>
      </div>

      <div class="container-custom relative z-10 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <!-- Left copy -->
          <div class="lg:col-span-7">
            <!-- Eyebrow -->
            <div class="inline-flex items-center gap-2.5 mb-8 text-amber-300/80 text-sm font-medium tracking-wide">
              <span class="w-8 h-px bg-amber-400/60"></span>
              Kenya's Beauty Supply Partner Since 2024
              <span class="w-8 h-px bg-amber-400/60"></span>
            </div>

            <!-- Headline — Playfair Display gives this the magazine/editorial feel -->
            <h1 class="font-serif text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-6">
              Beauty that moves.<br>
              <span class="italic text-amber-300">Business that grows.</span>
            </h1>

            <p class="text-lg text-white/65 mb-10 leading-relaxed max-w-lg font-light">
              Premium beauty supplies for salons, distributors and retailers across Kenya.
              Wholesale pricing, AI-powered restocking, and M-Pesa payments — all in one place.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 mb-12">
              <router-link to="/products"
                class="inline-flex items-center justify-center gap-2.5 bg-amber-400 text-amber-900 px-8 py-4 rounded-2xl font-bold text-base hover:bg-amber-300 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-amber-900/30">
                Shop the Collection
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </router-link>
              <router-link to="/register"
                class="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                Become a Partner
              </router-link>
            </div>

            <!-- Trust signals -->
            <div class="flex flex-wrap gap-x-8 gap-y-3 text-white/50 text-sm">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                Free returns within 48 hrs
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                M-Pesa & wallet payments
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                24–48 hr delivery
              </span>
            </div>
          </div>

          <!-- Right: editorial product showcase -->
          <div class="hidden lg:block lg:col-span-5">
            <div class="relative">
              <!-- Main card -->
              <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-7 shadow-2xl">
                <div class="flex items-center gap-3 mb-5">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #f59e0b, #d97706)">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  </div>
                  <div>
                    <p class="text-white font-semibold text-sm">This Week's Best Seller</p>
                    <p class="text-white/50 text-xs">Organic Skincare Range</p>
                  </div>
                </div>
                <div class="h-px bg-white/10 mb-5"></div>
                <div class="grid grid-cols-2 gap-3 mb-5">
                  <div class="bg-white/8 rounded-xl p-3">
                    <p class="text-white/50 text-[10px] uppercase tracking-wider mb-1">Category</p>
                    <p class="text-white text-sm font-semibold">Skincare</p>
                  </div>
                  <div class="bg-white/8 rounded-xl p-3">
                    <p class="text-white/50 text-[10px] uppercase tracking-wider mb-1">In Stock</p>
                    <p class="text-emerald-400 text-sm font-semibold">Available</p>
                  </div>
                  <div class="bg-white/8 rounded-xl p-3">
                    <p class="text-white/50 text-[10px] uppercase tracking-wider mb-1">Retail Price</p>
                    <p class="text-white text-sm font-semibold">KES 1,200</p>
                  </div>
                  <div class="bg-white/8 rounded-xl p-3">
                    <p class="text-white/50 text-[10px] uppercase tracking-wider mb-1">Wholesale</p>
                    <p class="text-amber-300 text-sm font-semibold">KES 850</p>
                  </div>
                </div>
                <router-link to="/products"
                  class="block w-full text-center bg-amber-400 text-amber-900 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors">
                  View Product
                </router-link>
              </div>

              <!-- Floating loyalty badge -->
              <div class="absolute -bottom-5 -left-6 bg-white rounded-2xl shadow-2xl px-5 py-4 border border-gray-100">
                <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Your Loyalty Tier</p>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-800">Gold Member</p>
                    <p class="text-xs text-purple-600 font-medium">12% discount active</p>
                  </div>
                </div>
              </div>

              <!-- Floating AI chip -->
              <div class="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-purple-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center" style="background: var(--brand-gradient)">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400">AI Insight</p>
                    <p class="text-xs font-semibold text-gray-700">Restock in 4 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══ Stats strip ══ -->
    <section class="bg-white border-b border-[#ede9e3]">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#ede9e3]">
          <div v-for="stat in stats" :key="stat.label" class="py-8 px-6 text-center">
            <div class="font-serif text-3xl lg:text-4xl font-bold text-purple-700">{{ stat.value }}</div>
            <div class="text-sm text-[#9e8f87] mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Who We Serve ══ -->
    <section class="py-16 bg-[#faf9f7]">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="section-tag">Who we serve</p>
          <h2 class="font-serif text-4xl font-bold text-gray-900">Built for Kenya's Beauty Trade</h2>
          <p class="text-[#5c524c] max-w-xl mx-auto mt-3 text-base">Whether you run a salon, distribute to retailers, or manage a supermarket shelf — BestLady has a plan for you.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="seg in segments" :key="seg.title"
            class="group bg-white rounded-3xl p-8 border border-[#ede9e3] hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :style="{ background: seg.bg }">
              <svg class="w-7 h-7" :class="seg.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="seg.icon"/>
              </svg>
            </div>
            <h3 class="font-semibold text-xl text-gray-800 mb-3">{{ seg.title }}</h3>
            <p class="text-[#5c524c] text-sm leading-relaxed mb-4">{{ seg.desc }}</p>
            <span class="text-xs font-bold uppercase tracking-wider" :class="seg.tagColor">{{ seg.tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Categories ══ -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="section-tag">Collections</p>
            <h2 class="font-serif text-4xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <router-link to="/products" class="hidden sm:inline-flex items-center gap-1.5 text-purple-600 font-semibold text-sm hover:text-purple-800 transition">
            All products
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="group cursor-pointer"
            @click="navigateToCategory(cat.id)"
          >
            <div class="bg-[#faf9f7] rounded-2xl p-5 text-center group-hover:bg-purple-50 group-hover:border-purple-200 border border-[#ede9e3] group-hover:-translate-y-1 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style="background: var(--brand-gradient)">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <h3 class="font-semibold text-gray-700 text-sm">{{ cat.name }}</h3>
              <p class="text-[10px] text-[#9e8f87] mt-1 group-hover:text-purple-500 transition-colors font-medium uppercase tracking-wide">Browse →</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Featured Products ══ -->
    <section class="py-16 bg-[#faf9f7]">
      <div class="container-custom">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="section-tag">Trending Now</p>
            <h2 class="font-serif text-4xl font-bold text-gray-900">Our Favourites</h2>
            <p class="text-[#5c524c] mt-2 text-sm">Products our customers come back for, week after week.</p>
          </div>
          <router-link to="/products" class="hidden sm:inline-flex items-center gap-1.5 text-purple-600 font-semibold hover:text-purple-800 transition text-sm">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </router-link>
        </div>
        <div v-if="featuredProducts.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
        <div class="text-center mt-8 sm:hidden">
          <router-link to="/products" class="btn-secondary text-sm px-6 py-3">View All Products</router-link>
        </div>
      </div>
    </section>

    <!-- ══ How It Works ══ -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <p class="section-tag">Simple Process</p>
          <h2 class="font-serif text-4xl font-bold text-gray-900">Order in 4 Easy Steps</h2>
          <p class="text-[#5c524c] mt-3 max-w-md mx-auto text-sm">From browsing to doorstep delivery in as little as 24 hours.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div class="hidden md:block absolute top-8 left-[15%] right-[15%] h-px border-t border-dashed border-purple-200"></div>
          <div v-for="(step, i) in howItWorks" :key="i" class="text-center relative group">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:-translate-y-1 transition-transform duration-300" :style="{ background: step.gradient }">
              <svg class="w-8 h-8" :class="step.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="step.icon"/>
              </svg>
            </div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-purple-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{{ i + 1 }}</div>
            <h3 class="font-semibold text-gray-800 mb-1.5">{{ step.title }}</h3>
            <p class="text-sm text-[#9e8f87] leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Testimonials ══ -->
    <section class="py-16 bg-[#faf9f7]">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="section-tag">What Customers Say</p>
          <h2 class="font-serif text-4xl font-bold text-gray-900">Real Businesses. Real Results.</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-white rounded-3xl p-8 border border-[#ede9e3] shadow-sm hover:shadow-md transition-shadow">
            <!-- Stars -->
            <div class="flex gap-1 mb-5">
              <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <p class="text-[#5c524c] text-sm leading-relaxed mb-6 italic">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3 pt-4 border-t border-[#ede9e3]">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" :style="{ background: t.avatar }">
                {{ t.name.charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ t.name }}</p>
                <p class="text-[#9e8f87] text-xs">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Platform Insights ══ -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="section-tag">Live Analytics</p>
          <h2 class="font-serif text-4xl font-bold text-gray-900">Platform Insights</h2>
          <p class="text-[#5c524c] max-w-xl mx-auto mt-3 text-sm">See what's moving across our beauty ecosystem right now.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-[#faf9f7] rounded-2xl p-6 border border-[#ede9e3]">
            <h3 class="font-semibold text-gray-700 mb-5 flex items-center gap-2 text-sm">
              <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Category Demand
            </h3>
            <div class="h-56">
              <Bar :data="demandChartData" :options="chartOptions" />
            </div>
          </div>
          <div class="bg-[#faf9f7] rounded-2xl p-6 border border-[#ede9e3]">
            <h3 class="font-semibold text-gray-700 mb-5 flex items-center gap-2 text-sm">
              <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              Top Selling Products
            </h3>
            <div class="h-56">
              <Bar :data="salesChartData" :options="salesChartOptions" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          <div class="bg-purple-50 border border-purple-100 rounded-2xl p-6">
            <p class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Top Product</p>
            <h4 class="font-serif text-xl font-bold text-gray-800">{{ topProduct }}</h4>
            <p class="text-sm text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              {{ topConfidence }}% demand growth
            </p>
          </div>
          <div class="bg-pink-50 border border-pink-100 rounded-2xl p-6">
            <p class="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Orders — Live
            </p>
            <h4 class="font-serif text-xl font-bold text-gray-800 tabular-nums transition-all duration-500" :class="orderFlash ? 'text-emerald-600' : ''">
              {{ liveOrderCount.toLocaleString() }}+
            </h4>
            <p class="text-sm text-purple-600 font-medium mt-2">{{ platformData?.platformStats?.activeusers || '5,000' }} active businesses</p>
          </div>
          <div class="bg-white border border-[#ede9e3] rounded-2xl p-6">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Platform Health</p>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-xs mb-1.5"><span class="text-[#9e8f87]">Order Fulfillment</span><span class="font-bold text-purple-600">98.4%</span></div>
                <div class="w-full bg-gray-100 rounded-full h-1.5"><div class="h-1.5 rounded-full bg-purple-500" style="width: 98.4%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1.5"><span class="text-[#9e8f87]">Customer Satisfaction</span><span class="font-bold text-pink-600">4.9 / 5.0</span></div>
                <div class="w-full bg-gray-100 rounded-full h-1.5"><div class="h-1.5 rounded-full bg-pink-500" style="width: 98%"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Benefits ══ -->
    <section class="py-16 bg-[#faf9f7]">
      <div class="container-custom">
        <div class="text-center mb-12">
          <p class="section-tag">Why BestLady</p>
          <h2 class="font-serif text-4xl font-bold text-gray-900">Everything Your Business Needs</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="benefit in benefits" :key="benefit.title"
            class="bg-white rounded-3xl p-8 border border-[#ede9e3] hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg group">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :style="{ background: benefit.gradient }">
              <svg class="w-7 h-7" :class="benefit.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="benefit.icon"/>
              </svg>
            </div>
            <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ benefit.title }}</h3>
            <p class="text-[#5c524c] text-sm leading-relaxed">{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ AI Banner ══ -->
    <section class="py-20 relative overflow-hidden" style="background: linear-gradient(140deg, #1a0533 0%, #3b0764 45%, #7e1d6b 100%);">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15" style="background: radial-gradient(circle, #f59e0b, transparent)"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-10" style="background: radial-gradient(circle, #ec4899, transparent)"></div>
      </div>
      <div class="container-custom relative z-10 text-center">
        <div class="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full px-5 py-2 mb-8 text-sm font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          AI-Powered Recommendations
        </div>
        <h2 class="font-serif text-4xl lg:text-5xl text-white font-bold mb-5 max-w-2xl mx-auto leading-tight">
          Your AI restocking partner, <em class="text-amber-300 not-italic">always on.</em>
        </h2>
        <p class="text-lg text-white/60 mb-10 max-w-xl mx-auto font-light">
          BestLady learns your order patterns and tells you exactly what to stock and when —
          with loyalty discounts up to 15% off for repeat customers.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="openAIChat"
            class="inline-flex items-center justify-center gap-2 bg-amber-400 text-amber-900 px-8 py-4 rounded-2xl font-bold hover:bg-amber-300 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-amber-900/20">
            Talk to AI Assistant
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </button>
          <router-link to="/register"
            class="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
            Create Free Account
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { useUIStore } from '@/stores/ui'
import { useToast } from 'vue-toast-notification'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getSocket } from '@/services/socket'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const router = useRouter()
const cart = useCartStore()
const ui = useUIStore()
const toast = useToast()

const categories = ref([])
const featuredProducts = ref([])
const platformData = ref(null)
const liveOrderCount = ref(10000)
const orderFlash = ref(false)

const stats = [
  { value: '500+', label: 'Premium Products' },
  { value: '50+', label: 'Trusted Brands' },
  { value: '10K+', label: 'Happy Businesses' },
  { value: '24/7', label: 'AI Support' },
]

const segments = [
  {
    icon: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z',
    color: 'text-rose-600',
    bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    title: 'Salons & Studios',
    desc: 'Retail prices, low MOQ. Order exactly what you need when you need it — never over-stock or run dry.',
    tag: 'Retail Tier',
    tagColor: 'text-rose-500',
  },
  {
    icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    color: 'text-purple-600',
    bg: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
    title: 'Wholesale Distributors',
    desc: 'Bulk pricing, credit limits, and AI demand forecasting to help you keep stock moving across your network.',
    tag: 'Wholesale Tier',
    tagColor: 'text-purple-500',
  },
  {
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    color: 'text-amber-600',
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    title: 'Supermarkets & Stores',
    desc: 'Manage multiple product lines from one dashboard. Set reorder points and let AI handle the rest.',
    tag: 'Hybrid Tier',
    tagColor: 'text-amber-600',
  },
]

const howItWorks = [
  { icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', iconColor: 'text-indigo-600', title: 'Create Account', desc: 'Sign up free. Choose retail or wholesale. Takes 2 minutes.', gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', iconColor: 'text-rose-500', title: 'Browse & Order', desc: 'Explore 500+ products, get AI recommendations, add to cart.', gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', iconColor: 'text-emerald-600', title: 'Pay with M-Pesa', desc: 'One STK push. Or use your BestLady wallet for instant checkout.', gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
  { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', iconColor: 'text-amber-600', title: 'Fast Delivery', desc: 'Same-day dispatch in Nairobi. Real-time tracking on your phone.', gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
]

const testimonials = [
  {
    name: 'Wanjiku Kamau',
    role: 'Salon Owner, Westlands',
    quote: 'I used to spend Saturdays calling suppliers. Now I reorder from BestLady in 3 minutes on my phone. The AI even tells me when I\'m about to run out of Argan oil.',
    avatar: 'linear-gradient(135deg, #9333ea, #db2777)',
  },
  {
    name: 'Brian Otieno',
    role: 'Wholesale Distributor, Mombasa',
    quote: 'The wholesale pricing is genuinely competitive, and the bulk optimizer saves me a lot of thinking. My Gold tier discount pays for itself every month.',
    avatar: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    name: 'Amina Hassan',
    role: 'Supermarket Buyer, Kisumu',
    quote: 'Delivery is always on time and the products are exactly as described. The WhatsApp order alerts are super helpful — I know the moment my order is confirmed.',
    avatar: 'linear-gradient(135deg, #10b981, #059669)',
  },
]

const benefits = [
  { icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', iconColor: 'text-indigo-600', title: 'Quality Guaranteed', desc: 'Every product is sourced from verified manufacturers with quality certification. No counterfeits, ever.', gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', iconColor: 'text-rose-500', title: 'Same-Day Dispatch', desc: 'Orders placed before 2 PM in Nairobi are dispatched the same day. Delivered in 24–48 hours.', gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', iconColor: 'text-emerald-600', title: 'Best Wholesale Prices', desc: 'Bulk discounts, loyalty tiers from Bronze to Platinum, and AI-optimized pricing for maximum margins.', gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
]

const openAIChat = () => ui.openAIChat()

const topProduct = computed(() => platformData.value?.predictions?.[0]?.Product?.name || 'Organic Shea Butter')
const topConfidence = computed(() => platformData.value?.predictions?.[0]?.confidence || '24')

const demandChartData = ref({
  labels: ['Skincare', 'Haircare', 'Makeup', 'Body Care', 'Fragrance', 'Tools'],
  datasets: [{
    label: 'Market Demand (%)',
    backgroundColor: ['#7c3aed', '#9333ea', '#a855f7', '#c084fc', '#e879f9', '#f0abfc'],
    borderRadius: 8,
    data: [85, 72, 94, 58, 45, 66]
  }]
})

const salesChartData = ref({
  labels: ['Shea Butter', 'Aloe Vera', 'Rose Water', 'Argan Oil', 'Coconut Oil'],
  datasets: [{
    label: 'Units Sold',
    backgroundColor: ['#ec4899', '#f43f5e', '#fb7185', '#f9a8d4', '#fce7f3'],
    borderRadius: 8,
    data: [450, 320, 600, 210, 540]
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
}
const salesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
}

const navigateToCategory = (categoryId) => router.push({ path: '/products', query: { category: categoryId } })
const goToProduct = (id) => router.push(`/products/${id}`)
const handleAddToCart = (product) => toast.success(`${product.name} added to cart!`, { duration: 2000, position: 'bottom-right' })

const fetchPlatformData = async () => {
  try {
    const { data } = await api.get('/ai/user/dashboard')
    platformData.value = data
    if (data.platformStats?.totalorders) liveOrderCount.value = parseInt(data.platformStats.totalorders) || 10000
    if (data.predictions?.length > 0) {
      demandChartData.value = {
        labels: data.predictions.map(p => p.Product?.name || 'Unknown'),
        datasets: [{ label: 'Demand (%)', backgroundColor: ['#7c3aed','#9333ea','#a855f7','#c084fc','#e879f9','#f0abfc'], borderRadius: 8, data: data.predictions.map(p => parseFloat(p.confidence)) }]
      }
    }
  } catch {}
}

let socketHandler = null

onMounted(async () => {
  fetchPlatformData()
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?limit=8')
    ])
    categories.value = catRes.data || []
    featuredProducts.value = prodRes.data?.products || []
  } catch (error) {
    console.error('Failed to load home data:', error)
  }

  const socket = getSocket()
  if (socket) {
    socketHandler = () => {
      liveOrderCount.value++
      orderFlash.value = true
      setTimeout(() => { orderFlash.value = false }, 1500)
    }
    socket.on('newOrder', socketHandler)
  }
})

onBeforeUnmount(() => {
  const socket = getSocket()
  if (socket && socketHandler) socket.off('newOrder', socketHandler)
})
</script>
