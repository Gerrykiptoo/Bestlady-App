<template>
  <div class="flex flex-col md:flex-row gap-8 p-6 bg-gray-50 min-h-screen">
    <!-- Sidebar: Filters & AI Assistant -->
    <aside class="w-full md:w-64 space-y-6">
      <!-- Search -->
      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-bold mb-3">Search</h3>
        <input v-model="search" type="text" placeholder="Search products..." class="w-full border rounded-lg p-2 text-sm" />
      </div>

      <!-- Categories -->
      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-bold mb-3">Categories</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li v-for="cat in categories" :key="cat.id" class="cursor-pointer hover:text-primary">
            {{ cat.name }}
          </li>
        </ul>
      </div>

      <!-- AI Sidebar Widget -->
      <div v-if="auth.isAuthenticated" class="bg-primary text-white p-4 rounded-xl shadow-md">
        <h3 class="font-bold mb-2 flex items-center gap-2">
          <span>✨ AI Assistant</span>
        </h3>
        <p class="text-xs opacity-90 mb-4">Stock alert: 3 items are running low!</p>
        <button class="w-full py-2 bg-white text-primary rounded-lg text-xs font-bold">
          View AI Insights
        </button>
      </div>
    </aside>

    <!-- Main Content: Product Grid -->
    <main class="flex-1">
      <header class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Product Catalog</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">Showing {{ filteredProducts.length }} products</span>
        </div>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-xl shadow-sm border overflow-hidden group">
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <img v-if="product.image_url" :src="product.image_url" class="object-cover h-full w-full" />
            <span v-else class="text-gray-400">No Image</span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 group-hover:text-primary transition">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 mb-2">{{ product.Category?.name }}</p>
            
            <div class="flex justify-between items-end mt-4">
              <div>
                <span class="text-lg font-black text-gray-900">KES {{ getPrice(product) }}</span>
                <span v-if="auth.user?.tier === 'wholesale'" class="block text-[10px] text-indigo-600 font-bold uppercase">Wholesale Price</span>
              </div>
              <button @click="addToCart(product)" class="bg-primary text-white p-2 rounded-lg hover:opacity-90 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toast-notification';

const auth = useAuthStore();
const cart = useCartStore();
const toast = useToast();

const products = ref([]);
const categories = ref([]);
const search = ref('');

const filteredProducts = computed(() => {
  return products.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
});

const getPrice = (product) => {
  return auth.user?.tier === 'wholesale' ? product.wholesale_price : product.retail_price;
};

const addToCart = (product) => {
  cart.addItem(product, getPrice(product));
  toast.success(`${product.name} added to cart!`);
};

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ]);
    products.value = prodRes.data.products || prodRes.data;
    categories.value = catRes.data;
  } catch (err) {
    console.error('Fetch error:', err);
  }
});
</script>
