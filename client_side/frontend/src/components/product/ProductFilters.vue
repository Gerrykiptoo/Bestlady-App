<template>
  <div class="space-y-6">
    <!-- Search Filter (Mobile) -->
    <div class="lg:hidden">
      <div class="bg-white p-4 rounded-2xl shadow-md">
        <h3 class="font-semibold mb-3 flex items-center gap-2">
          <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Products
        </h3>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search by name..."
          class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          @input="$emit('update:search', searchQuery)"
        />
      </div>
    </div>

    <!-- Categories Filter -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleSection('categories')"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Categories
        </h3>
        <svg 
          class="h-5 w-5 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': expandedSections.categories }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <transition name="slide-down">
        <div v-show="expandedSections.categories" class="px-4 pb-4 border-t border-gray-100">
          <div class="space-y-2 mt-3">
            <!-- Search within categories -->
            <div class="relative mb-3">
              <input 
                v-model="categorySearch"
                type="text"
                placeholder="Search categories..."
                class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <svg class="absolute right-3 top-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <label 
                v-for="cat in filteredCategories" 
                :key="cat.id" 
                class="flex items-center group cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  :value="cat.id"
                  :checked="selectedCategories.includes(cat.id)"
                  @change="$emit('update:categories', $event.target.checked ? [...selectedCategories, cat.id] : selectedCategories.filter(id => id !== cat.id))"
                  class="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                  {{ cat.name }}
                </span>
                <span class="ml-auto text-xs text-gray-400">{{ cat.productCount || 0 }}</span>
              </label>
            </div>
            
            <!-- Clear Categories Button -->
            <button 
              v-if="selectedCategories.length"
              @click="$emit('update:categories', [])"
              class="mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all ({{ selectedCategories.length }})
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Price Range Filter with Visual Slider -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleSection('price')"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price Range
        </h3>
        <svg 
          class="h-5 w-5 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': expandedSections.price }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <transition name="slide-down">
        <div v-show="expandedSections.price" class="px-4 pb-4 border-t border-gray-100">
          <div class="pt-4">
            <!-- Dual Range Slider -->
            <div class="relative pt-6 pb-8">
              <input 
                type="range" 
                :value="priceRange[0]"
                @input="updateMinPrice($event.target.value)"
                :min="0" 
                :max="maxPrice"
                step="100"
                class="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
                :style="{ zIndex: priceRange[0] > maxPrice - 100 ? 1 : 2 }"
              />
              <input 
                type="range" 
                :value="priceRange[1]"
                @input="updateMaxPrice($event.target.value)"
                :min="0" 
                :max="maxPrice"
                step="100"
                class="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto"
              />
              <div class="relative h-2 bg-gray-200 rounded-full">
                <div 
                  class="absolute h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  :style="{ left: (priceRange[0] / maxPrice) * 100 + '%', right: 100 - (priceRange[1] / maxPrice) * 100 + '%' }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-2">
              <div class="flex-1 mr-2">
                <label class="block text-xs text-gray-500 mb-1">Min (KES)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">KES</span>
                  <input 
                    type="number" 
                    :value="priceRange[0]"
                    @input="updateMinPrice($event.target.value)"
                    :min="0" 
                    :max="priceRange[1]"
                    step="100"
                    class="w-full pl-12 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div class="flex-1 ml-2">
                <label class="block text-xs text-gray-500 mb-1">Max (KES)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">KES</span>
                  <input 
                    type="number" 
                    :value="priceRange[1]"
                    @input="updateMaxPrice($event.target.value)"
                    :min="priceRange[0]" 
                    :max="maxPrice"
                    step="100"
                    class="w-full pl-12 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            
            <!-- Quick Price Buttons -->
            <div class="flex gap-2 mt-4">
              <button 
                v-for="preset in pricePresets" 
                :key="preset.label"
                @click="setPricePreset(preset.max)"
                class="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:border-primary-400 hover:text-primary-600 transition-colors"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Rating Filter -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleSection('rating')"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Rating
        </h3>
        <svg 
          class="h-5 w-5 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': expandedSections.rating }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <transition name="slide-down">
        <div v-show="expandedSections.rating" class="px-4 pb-4 border-t border-gray-100">
          <div class="space-y-2 mt-3">
            <label v-for="rating in [5,4,3,2,1]" :key="rating" class="flex items-center cursor-pointer group">
              <input 
                type="radio" 
                :value="rating"
                :checked="selectedRating === rating"
                @change="$emit('update:rating', rating)"
                name="rating"
                class="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center gap-1">
                <span v-for="star in 5" :key="star" class="text-lg">
                  <span v-if="star <= rating" class="text-yellow-400">★</span>
                  <span v-else class="text-gray-300">★</span>
                </span>
                <span class="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
            <button 
              v-if="selectedRating"
              @click="$emit('update:rating', null)"
              class="mt-2 text-xs text-primary-600 hover:text-primary-700"
            >
              Clear rating
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Sort Options -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleSection('sort')"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort By
        </h3>
        <svg 
          class="h-5 w-5 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': expandedSections.sort }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <transition name="slide-down">
        <div v-show="expandedSections.sort" class="px-4 pb-4 border-t border-gray-100">
          <div class="space-y-2 mt-3">
            <label 
              v-for="option in sortOptions" 
              :key="option.value"
              class="flex items-center cursor-pointer group"
            >
              <input 
                type="radio" 
                :value="option.value"
                :checked="sortBy === option.value"
                @change="$emit('update:sortBy', option.value)"
                name="sort"
                class="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                {{ option.label }}
              </span>
            </label>
          </div>
        </div>
      </transition>
    </div>

    <!-- Availability Filter -->
    <div class="bg-white rounded-2xl shadow-md overflow-hidden">
      <div 
        class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        @click="toggleSection('availability')"
      >
        <h3 class="font-semibold flex items-center gap-2">
          <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Availability
        </h3>
        <svg 
          class="h-5 w-5 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': expandedSections.availability }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <transition name="slide-down">
        <div v-show="expandedSections.availability" class="px-4 pb-4 border-t border-gray-100">
          <div class="space-y-2 mt-3">
            <label class="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                :checked="inStockOnly"
                @change="$emit('update:inStockOnly', $event.target.checked)"
                class="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">In Stock Only</span>
            </label>
            <label class="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                :checked="onSaleOnly"
                @change="$emit('update:onSaleOnly', $event.target.checked)"
                class="mr-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">On Sale Only</span>
            </label>
          </div>
        </div>
      </transition>
    </div>

    <!-- Filter Actions -->
    <div class="flex gap-3 pt-2">
      <button 
        @click="applyFilters"
        class="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        Apply Filters
      </button>
      <button 
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="bg-primary-50 rounded-xl p-3">
      <p class="text-xs text-primary-700 font-medium mb-2">Active Filters:</p>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="catId in selectedCategories" 
          :key="catId"
          class="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-primary-700"
        >
          {{ getCategoryName(catId) }}
          <button @click="removeCategory(catId)" class="hover:text-red-500">×</button>
        </span>
        <span v-if="priceRange[0] > 0 || priceRange[1] < maxPrice" class="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-primary-700">
          KES {{ priceRange[0] }} - {{ priceRange[1] }}
          <button @click="resetPriceRange" class="hover:text-red-500">×</button>
        </span>
        <span v-if="selectedRating" class="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-primary-700">
          {{ selectedRating }}+ stars
          <button @click="$emit('update:rating', null)" class="hover:text-red-500">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },
  selectedCategories: { type: Array, default: () => [] },
  priceRange: { type: Array, default: () => [0, 10000] },
  maxPrice: { type: Number, default: 10000 },
  sortBy: { type: String, default: 'name' },
  selectedRating: { type: Number, default: null },
  inStockOnly: { type: Boolean, default: false },
  onSaleOnly: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' }
})

const emit = defineEmits([
  'update:categories', 'update:priceRange', 'update:sortBy', 'update:rating',
  'update:inStockOnly', 'update:onSaleOnly', 'update:search', 'apply-filters', 'reset-filters'
])

// Expanded sections state
const expandedSections = ref({
  categories: true,
  price: true,
  rating: true,
  sort: false,
  availability: false
})

// Category search
const categorySearch = ref('')

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!categorySearch.value) return props.categories
  return props.categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

// Sort options
const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Popularity' }
]

// Price presets
const pricePresets = [
  { label: 'Under 500', max: 500 },
  { label: '500 - 1000', max: 1000 },
  { label: '1000 - 2000', max: 2000 },
  { label: '2000+', max: props.maxPrice }
]

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return props.selectedCategories.length > 0 ||
         props.priceRange[0] > 0 ||
         props.priceRange[1] < props.maxPrice ||
         props.selectedRating !== null ||
         props.inStockOnly ||
         props.onSaleOnly ||
         props.searchQuery
})

// Toggle section expansion
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// Update price range
const updateMinPrice = (value) => {
  const newMin = Math.min(parseInt(value), props.priceRange[1] - 100)
  emit('update:priceRange', [newMin, props.priceRange[1]])
}

const updateMaxPrice = (value) => {
  const newMax = Math.max(parseInt(value), props.priceRange[0] + 100)
  emit('update:priceRange', [props.priceRange[0], newMax])
}

const setPricePreset = (max) => {
  emit('update:priceRange', [0, max])
}

// Get category name by ID
const getCategoryName = (id) => {
  const cat = props.categories.find(c => c.id === id)
  return cat ? cat.name : ''
}

// Remove a category filter
const removeCategory = (id) => {
  emit('update:categories', props.selectedCategories.filter(c => c !== id))
}

// Reset price range
const resetPriceRange = () => {
  emit('update:priceRange', [0, props.maxPrice])
}

// Apply all filters
const applyFilters = () => {
  emit('apply-filters')
}

// Reset all filters
const resetFilters = () => {
  emit('update:categories', [])
  emit('update:priceRange', [0, props.maxPrice])
  emit('update:sortBy', 'name')
  emit('update:rating', null)
  emit('update:inStockOnly', false)
  emit('update:onSaleOnly', false)
  emit('update:search', '')
  emit('reset-filters')
}
</script>

<style scoped>
/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Range slider styling */
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 9999px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #8B4513;
  margin-top: -6px;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #7a3b10;
  transform: scale(1.2);
}
</style>