<template>
  <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <p class="text-gray-500">Manage products, users, and platform analytics.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b mb-6">
      <button
        v-for="tab in ['products', 'users', 'analytics']"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-6 py-2 font-semibold rounded-t-lg transition',
          activeTab === tab
            ? 'bg-white text-primary-600 border-x border-t border-gray-200'
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- ================= PRODUCTS TAB ================= -->
    <div v-if="activeTab === 'products'">
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">📦 Products</h2>
          <button
            @click="openProductModal()"
            class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Image</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">SKU</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Retail</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Wholesale</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="prod in products" :key="prod.id" class="hover:bg-gray-50">
                <td class="px-4 py-3"><img :src="prod.image_url || '/placeholder.jpg'" class="w-12 h-12 object-cover rounded" /></td>
                <td class="px-4 py-3 font-medium">{{ prod.name }}</td>
                <td class="px-4 py-3 text-sm">{{ prod.sku }}</td>
                <td class="px-4 py-3 text-sm">{{ prod.Category?.name || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm">KES {{ formatPrice(prod.retail_price) }}</td>
                <td class="px-4 py-3 text-sm">KES {{ formatPrice(prod.wholesale_price) }}</td>
                <td class="px-4 py-3 text-sm">
                  <span :class="prod.current_stock <= prod.reorder_point ? 'text-red-600 font-semibold' : ''">
                    {{ prod.current_stock }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="openProductModal(prod)" class="text-blue-600 hover:text-blue-800" title="Edit">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteProduct(prod.id)" class="text-red-600 hover:text-red-800" title="Delete">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500">No products found. Click "Add Product" to create one.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= USERS TAB ================= -->
    <div v-if="activeTab === 'users'">
      <div class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-800">👥 User Management</h3>
          <button @click="fetchUsers" class="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Tier</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Credit Limit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">KYC</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Active</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium">{{ user.business_name || user.username }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 capitalize">{{ user.tier }}</td>
                <td class="px-6 py-4">
                  <select v-model="user.role" @change="updateUserField(user, 'role', user.role)" class="text-sm border rounded px-2 py-1">
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <input
                    type="number"
                    v-model.number="user.credit_limit"
                    @blur="updateUserField(user, 'credit_limit', user.credit_limit)"
                    class="w-28 px-2 py-1 border rounded"
                  />
                </td>
                <td class="px-6 py-4">
                  <select v-model="user.kyc_status" @change="updateUserField(user, 'kyc_status', user.kyc_status)" class="text-sm border rounded px-2 py-1">
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <input type="checkbox" v-model="user.is_active" @change="updateUserField(user, 'is_active', user.is_active)" class="toggle" />
                </td>
                <td class="px-6 py-4">
                  <button @click="viewUserDetails(user)" class="text-primary-600 hover:underline">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ================= ANALYTICS TAB ================= -->
    <div v-if="activeTab === 'analytics'">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500">Total Revenue (30d)</p>
          <p class="text-2xl font-bold text-green-600">KES {{ formatPrice(metrics.totalRevenue || 0) }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500">Total Orders (30d)</p>
          <p class="text-2xl font-bold text-blue-600">{{ metrics.totalOrders || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500">Low Stock Items</p>
          <p class="text-2xl font-bold text-red-600">{{ lowStockCount }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <p class="text-sm text-gray-500">Active Users</p>
          <p class="text-2xl font-bold text-purple-600">{{ activeUsers || 0 }}</p>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 class="font-bold text-lg mb-4">📈 Revenue Trend (Last 30 Days)</h3>
        <div class="h-80">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Inventory & Top Products -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4">⚠️ Low Stock Items</h3>
          <div v-if="lowStockItems.length === 0" class="text-gray-500 text-center py-4">✅ All stock levels are healthy</div>
          <div v-else class="space-y-3">
            <div v-for="item in lowStockItems" :key="item.id" class="border-l-4 border-red-500 bg-red-50 p-3 rounded">
              <div class="flex justify-between">
                <span class="font-semibold">{{ item.name }}</span>
                <span class="text-red-600 font-bold">{{ item.current_stock }} units left</span>
              </div>
              <div class="text-sm text-gray-500">Reorder at: {{ item.reorder_point }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-md p-6">
          <h3 class="font-bold text-lg mb-4">🏆 Top Selling Products (30d)</h3>
          <div v-if="topProducts.length === 0" class="text-gray-500 text-center py-4">No sales data yet</div>
          <div v-else class="space-y-4">
            <div v-for="(prod, idx) in topProducts" :key="prod.product_id" class="flex items-center gap-3">
              <div class="w-6 text-center font-bold">{{ idx+1 }}</div>
              <img :src="prod.Product?.image_url || '/placeholder.jpg'" class="w-10 h-10 rounded object-cover" />
              <div class="flex-1">
                <p class="font-medium">{{ prod.Product?.name }}</p>
                <p class="text-xs text-gray-500">{{ prod.totalSold }} units sold</p>
              </div>
              <p class="font-semibold text-primary-600">KES {{ formatPrice(prod.revenue || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Reports -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h3 class="font-bold text-lg mb-4">📊 Download Financial Reports</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold">Orders Report</h4>
            <div class="flex gap-2 mt-2">
              <input type="date" v-model="reportStartDate" class="border rounded px-2 py-1 text-sm" />
              <span>to</span>
              <input type="date" v-model="reportEndDate" class="border rounded px-2 py-1 text-sm" />
            </div>
            <div class="flex gap-2 mt-3">
              <button @click="downloadReport('orders', 'csv')" class="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700">
                CSV
              </button>
              <button @click="downloadReport('orders', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">
                PDF
              </button>
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold">Products Sold Report</h4>
            <div class="flex gap-2 mt-2">
              <input type="date" v-model="reportStartDate" class="border rounded px-2 py-1 text-sm" />
              <span>to</span>
              <input type="date" v-model="reportEndDate" class="border rounded px-2 py-1 text-sm" />
            </div>
            <div class="flex gap-2 mt-3">
              <button @click="downloadReport('products_sold', 'csv')" class="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700">
                CSV
              </button>
              <button @click="downloadReport('products_sold', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">
                PDF
              </button>
            </div>
          </div>
          <div class="border rounded-lg p-4">
            <h4 class="font-semibold">Stock Report</h4>
            <div class="flex gap-2 mt-8">
              <button @click="downloadReport('stock', 'csv')" class="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm hover:bg-primary-700">
                CSV
              </button>
              <button @click="downloadReport('stock', 'pdf')" class="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PRODUCT MODAL ================= -->
    <Modal :show="productModalVisible" @close="closeProductModal">
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Product Name *</label>
            <input v-model="productForm.name" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">SKU *</label>
            <input v-model="productForm.sku" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea v-model="productForm.description" rows="3" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select v-model="productForm.category_id" class="w-full border rounded-lg px-3 py-2">
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Unit</label>
              <select v-model="productForm.unit" class="w-full border rounded-lg px-3 py-2">
                <option value="piece">Piece</option>
                <option value="dozen">Dozen</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Retail Price (KES)</label>
              <input v-model.number="productForm.retail_price" type="number" step="0.01" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Wholesale Price (KES)</label>
              <input v-model.number="productForm.wholesale_price" type="number" step="0.01" required class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Current Stock</label>
              <input v-model.number="productForm.current_stock" type="number" required class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Reorder Point</label>
              <input v-model.number="productForm.reorder_point" type="number" class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Product Image</label>
            <input type="file" @change="onImageSelect" accept="image/*" class="w-full" />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2 h-24 object-cover rounded" />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="closeProductModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- ================= USER DETAILS MODAL ================= -->
    <Modal :show="userDetailsModalVisible" @close="closeUserDetailsModal" size="lg">
      <div class="p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">User Details: {{ selectedUser?.business_name || selectedUser?.username }}</h3>
          <button @click="downloadUserData" class="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700">📥 Download JSON</button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div><span class="font-semibold">Email:</span> {{ selectedUser?.email }}</div>
          <div><span class="font-semibold">Phone:</span> {{ selectedUser?.phone || 'N/A' }}</div>
          <div><span class="font-semibold">Tier:</span> {{ selectedUser?.tier }}</div>
          <div><span class="font-semibold">Role:</span> {{ selectedUser?.role }}</div>
          <div><span class="font-semibold">KYC Status:</span> {{ selectedUser?.kyc_status || 'pending' }}</div>
          <div><span class="font-semibold">Wallet Balance:</span> KES {{ formatPrice(selectedUser?.wallet_balance) }}</div>
          <div><span class="font-semibold">Credit Limit:</span> KES {{ formatPrice(selectedUser?.credit_limit) }}</div>
          <div><span class="font-semibold">Joined:</span> {{ formatDate(selectedUser?.createdAt) }}</div>
          <div><span class="font-semibold">Active:</span> {{ selectedUser?.is_active ? '✅ Yes' : '❌ No' }}</div>
          <div><span class="font-semibold">Business Name:</span> {{ selectedUser?.business_name || 'N/A' }}</div>
          <div v-if="selectedUser?.agent_id"><span class="font-semibold">Agent ID:</span> {{ selectedUser.agent_id }}</div>
          <div v-if="selectedUser?.commission_rate != null"><span class="font-semibold">Commission Rate:</span> {{ selectedUser.commission_rate }}%</div>
        </div>
        <h4 class="font-semibold text-lg mt-4 mb-2">📦 Orders</h4>
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full text-sm border">
            <thead class="bg-gray-100"><tr><th class="px-3 py-2">Order #</th><th>Date</th><th>Amount</th><th>Status</th><th>Payment Status</th></tr></thead>
            <tbody>
              <tr v-for="order in userOrders" :key="order.id" class="border-b"><td class="px-3 py-2">{{ order.order_number }}</td><td>{{ formatDate(order.createdAt) }}</td><td>KES {{ formatPrice(order.total_amount) }}</td><td class="capitalize">{{ order.status }}</td><td class="capitalize">{{ order.payment_status }}</td></tr>
              <tr v-if="userOrders.length === 0"><td colspan="5" class="text-center py-3 text-gray-500">No orders found</td></tr>
            </tbody>
          </table>
        </div>
        <h4 class="font-semibold text-lg mt-4 mb-2">💰 Wallet Transactions</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border">
            <thead class="bg-gray-100"><tr><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th>Reference</th></tr></thead>
            <tbody>
              <tr v-for="tx in userTransactions" :key="tx.id" class="border-b"><td class="capitalize">{{ tx.transaction_type }}</td><td>KES {{ formatPrice(tx.amount) }}</td><td class="capitalize">{{ tx.status }}</td><td>{{ formatDate(tx.createdAt) }}</td><td>{{ tx.reference_id || '-' }}</td></tr>
              <tr v-if="userTransactions.length === 0"><td colspan="5" class="text-center py-3 text-gray-500">No transactions found</td></tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-6"><button @click="closeUserDetailsModal" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Close</button></div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '@/services/api'
import Modal from '@/components/common/Modal.vue'
import { useToast } from 'vue-toast-notification'
import { formatPrice, formatDate } from '@/utils/formatters'
import { getSocket } from '@/services/socket'

Chart.register(...registerables)

const toast = useToast()
const activeTab = ref('products')

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

// ---------- Analytics ----------
const metrics = ref({ totalRevenue: 0, totalOrders: 0 })
const lowStockItems = ref([])
const lowStockCount = ref(0)
const topProducts = ref([])
const activeUsers = ref(0)
const revenueChart = ref(null)
let revenueChartInstance = null
let pollInterval = null

// ---------- Products API ----------
const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products')
    products.value = data.products || []
    console.log('Products loaded:', products.value.length)
  } catch (err) {
    console.error('Failed to load products', err)
    toast.error('Failed to load products')
  }
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
    productForm.value = {
      name: '', sku: '', description: '', category_id: '',
      retail_price: 0, wholesale_price: 0, unit: 'piece',
      current_stock: 0, reorder_point: 10
    }
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
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const saveProduct = async () => {
  const formData = new FormData()
  Object.keys(productForm.value).forEach(key => {
    if (productForm.value[key] !== undefined && productForm.value[key] !== null) {
      formData.append(key, productForm.value[key])
    }
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
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save product')
  }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch (err) { toast.error('Failed to delete product') }
  }
}

// ---------- Users API ----------
const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/users')
    users.value = data.users || []
  } catch (err) { toast.error('Failed to load users') }
}

const updateUserField = async (user, field, value) => {
  try {
    await api.put(`/admin/users/${user.id}`, { [field]: value })
    toast.success(`${field} updated`)
  } catch (err) {
    toast.error(`Failed to update ${field}`)
    fetchUsers()
  }
}

const viewUserDetails = async (user) => {
  selectedUser.value = user
  userDetailsModalVisible.value = true
  try {
    const [ordersRes, walletRes] = await Promise.all([
      api.get(`/orders?userId=${user.id}&limit=50`),
      api.get(`/wallet/transactions?userId=${user.id}&limit=50`)
    ])
    userOrders.value = ordersRes.data || []
    userTransactions.value = walletRes.data || []
  } catch (error) {
    console.error('Failed to fetch user details', error)
    toast.error('Could not load user details')
  }
}

const closeUserDetailsModal = () => {
  userDetailsModalVisible.value = false
  selectedUser.value = null
  userOrders.value = []
  userTransactions.value = []
}

const downloadUserData = () => {
  if (!selectedUser.value) return
  const data = { user: selectedUser.value, orders: userOrders.value, transactions: userTransactions.value }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `user_${selectedUser.value.id}_data.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('User data downloaded')
}

// ---------- Reports ----------
const downloadReport = async (type, format = 'csv') => {
  try {
    let url = `/admin/reports/financial?reportType=${type}&format=${format}`
    if (type !== 'stock') url += `&startDate=${reportStartDate.value}&endDate=${reportEndDate.value}`
    const response = await api.get(url, { responseType: 'blob' })
    const isPdf = format === 'pdf'
    const mimeType = isPdf ? 'application/pdf' : 'text/csv'
    const ext = isPdf ? 'pdf' : 'csv'
    const blob = new Blob([response.data], { type: mimeType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${type}_report_${new Date().toISOString().slice(0,10)}.${ext}`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success(`Report downloaded as ${ext.toUpperCase()}`)
  } catch (error) { toast.error('Failed to download report') }
}

// ---------- Analytics ----------
const fetchAnalytics = async () => {
  try {
    const salesRes = await api.get('/admin/analytics/sales')
    const dailySales = salesRes.data.dailySales || []
    metrics.value.totalRevenue = salesRes.data.totals?.totalRevenue || 0
    metrics.value.totalOrders = salesRes.data.totals?.totalOrders || 0

    const inventoryRes = await api.get('/admin/analytics/inventory')
    lowStockItems.value = inventoryRes.data.lowStock?.items || []
    lowStockCount.value = inventoryRes.data.lowStock?.total || 0
    topProducts.value = inventoryRes.data.topSelling || []

    const platformRes = await api.get('/admin/analytics/platform')
    activeUsers.value = platformRes.data.totalUsers || 0

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
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { callback: (val) => 'KES ' + val.toLocaleString() } } }
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
    socket.on('orderUpdate', () => {
      console.log('📦 Order update received, refreshing analytics...')
      fetchAnalytics()
    })
    socket.on('walletUpdate', () => {
       console.log('💰 Wallet update received, refreshing users...')
       fetchUsers()
    })
  }
  
  pollInterval = setInterval(fetchAnalytics, 60000) // Increased to 60s since we have real-time now
})

onUnmounted(() => {
  const socket = getSocket()
  if (socket) {
    socket.off('orderUpdate')
    socket.off('walletUpdate')
  }
  if (pollInterval) clearInterval(pollInterval)
  if (revenueChartInstance) revenueChartInstance.destroy()
})
</script>

<style scoped>
.toggle {
  width: 34px;
  height: 18px;
  appearance: none;
  background: #ccc;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: 0.2s;
}
.toggle:checked {
  background: #10b981;
}
.toggle::before {
  content: '';
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: 0.2s;
}
.toggle:checked::before {
  left: 18px;
}
</style>