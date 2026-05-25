<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sticky top bar: search + category pills -->
    <div class="bg-white border-b shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <h2 class="text-lg font-bold text-gray-800 flex-shrink-0 hidden sm:block">Catalog</h2>
        <div class="flex-1 relative max-w-xl">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchInput" @input="onSearchInput" type="text" placeholder="Search products by name..." class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition" />
          <button v-if="searchInput" @click="clearSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <span class="text-sm text-gray-500 flex-shrink-0 hidden sm:block">{{ total }} products</span>
      </div>

      <!-- Category pills -->
      <div class="max-w-7xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          @click="selectCategory(null)"
          :class="['px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-all', !selectedCategory ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >All</button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          :class="['px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-all', selectedCategory === cat.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >{{ cat.name }}</button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Sort bar -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-gray-600">
          <span v-if="searchInput">Results for "<strong>{{ searchInput }}</strong>" — </span>
          {{ total }} products
        </p>
        <select v-model="sortOption" @change="onSortChange" class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white">
          <option value="">Newest First</option>
          <option value="retail_price:ASC">Price: Low to High</option>
          <option value="retail_price:DESC">Price: High to Low</option>
          <option value="name:ASC">Name: A-Z</option>
          <option value="current_stock:ASC">Low Stock First</option>
        </select>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 12" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div class="h-56 bg-gray-200 animate-pulse"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div class="h-8 bg-gray-200 rounded animate-pulse mt-3"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="products.length === 0" class="text-center py-24">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">No products found</h3>
        <p class="text-gray-500 mb-6">Try a different keyword or browse all categories</p>
        <button @click="clearFilters" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition">
          Clear Filters
        </button>
      </div>

      <!-- Product grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @click="goToProduct(product.id)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="w-9 h-9 rounded-lg border flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="changePage(p)"
          :class="['w-9 h-9 rounded-lg text-sm font-semibold transition', p === currentPage ? 'bg-primary-600 text-white shadow-sm' : 'border text-gray-600 hover:bg-gray-50']"
        >{{ p }}</button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="w-9 h-9 rounded-lg border flex items-center justify-center text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import ProductCard from '@/components/product/ProductCard.vue';

const router = useRouter();
const route = useRoute();

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const total = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const searchInput = ref('');
const selectedCategory = ref(null);
const sortOption = ref('');
let searchTimer = null;

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = { page: currentPage.value, limit: 12 };
    if (searchInput.value) params.search = searchInput.value;
    if (selectedCategory.value) params.category = selectedCategory.value;
    if (sortOption.value) params.sort = sortOption.value;
    const { data } = await api.get('/products', { params });
    products.value = data.products || data;
    total.value = data.total || products.value.length;
    totalPages.value = data.pages || 1;
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    loading.value = false;
  }
};

const syncFromRoute = () => {
  searchInput.value = route.query.search || '';
  selectedCategory.value = route.query.category ? parseInt(route.query.category) : null;
  currentPage.value = parseInt(route.query.page) || 1;
};

const pushRoute = () => {
  const query = {};
  if (searchInput.value) query.search = searchInput.value;
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (currentPage.value > 1) query.page = currentPage.value;
  router.replace({ path: '/products', query });
};

const onSearchInput = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    pushRoute();
    fetchProducts();
  }, 350);
};

const onSortChange = () => {
  currentPage.value = 1;
  fetchProducts();
};

const selectCategory = (catId) => {
  selectedCategory.value = catId;
  currentPage.value = 1;
  pushRoute();
  fetchProducts();
};

const changePage = (p) => {
  if (p < 1 || p > totalPages.value) return;
  currentPage.value = p;
  pushRoute();
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearFilters = () => {
  searchInput.value = '';
  selectedCategory.value = null;
  sortOption.value = '';
  currentPage.value = 1;
  pushRoute();
  fetchProducts();
};

const clearSearch = () => {
  searchInput.value = '';
  currentPage.value = 1;
  pushRoute();
  fetchProducts();
};

const goToProduct = (id) => {
  router.push(`/products/${id}`);
};

// React when navbar pushes a new ?search= query
watch(() => route.query, (newQ, oldQ) => {
  const searchChanged = newQ.search !== oldQ?.search;
  const catChanged = newQ.category !== oldQ?.category;
  if (searchChanged) searchInput.value = newQ.search || '';
  if (catChanged) selectedCategory.value = newQ.category ? parseInt(newQ.category) : null;
  if (searchChanged || catChanged) {
    currentPage.value = 1;
    fetchProducts();
  }
}, { deep: true });

onMounted(async () => {
  syncFromRoute();
  try {
    const catRes = await api.get('/categories');
    categories.value = catRes.data;
  } catch {}
  fetchProducts();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
