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
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @click="goToProduct(product.id)"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toast-notification';
import ProductCard from '@/components/product/ProductCard.vue';

const router = useRouter();
const auth = useAuthStore();
const cart = useCartStore();
const toast = useToast();

const products = ref([]);
const categories = ref([]);
const search = ref('');

const filteredProducts = computed(() => {
  return products.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
});

const goToProduct = (id) => {
  router.push(`/products/${id}`);
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
