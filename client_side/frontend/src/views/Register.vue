<template>
  <div class="max-w-md mx-auto py-12">
    <div class="bg-white p-8 rounded-lg shadow">
      <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <Input v-model="form.username" label="Username" placeholder="Enter username" required />
        </div>
        <div class="mb-4">
          <Input v-model="form.email" type="email" label="Email" placeholder="Enter email" required />
        </div>
        <div class="mb-4">
          <Input v-model="form.password" type="password" label="Password" placeholder="Enter password" required />
        </div>
        <div class="mb-4">
          <Input v-model="form.phone" label="Phone Number" placeholder="2547XXXXXXXX" required />
        </div>
        <div class="mb-4">
          <Input v-model="form.business_name" label="Business Name" placeholder="Enter business name" required />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <select v-model="form.business_type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
            <option value="">Select Business Type</option>
            <option value="salon">Salon (Individual)</option>
            <option value="mini_supermarket">Mini Supermarket</option>
            <option value="beauty_shop">Beauty Shop</option>
            <option value="freelance">Freelance Stylist</option>
            <option value="mall">Mall</option>
            <option value="large_supermarket">Large Supermarket</option>
            <option value="chain_store">Chain Store</option>
            <option value="distributor">Distributor</option>
            <option value="exporter">Exporter</option>
            <option value="institution">Institution</option>
          </select>
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>
      <p class="text-center mt-4">
        Already have an account? <router-link to="/login" class="text-primary-600 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'
import Input from '@/components/common/Input.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  phone: '',
  business_name: '',
  business_type: '',
  role: 'user'
})

const handleRegister = async () => {
  loading.value = true
  try {
    const { data } = await api.post('/auth/register', form)
    auth.setAuth(data)
    toast.success('Registration successful! Welcome to BestLady!')
    router.push('/')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
