<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 relative overflow-hidden py-12">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-36 h-36 bg-white rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>
    
    <!-- Decorative Beauty Icons -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-20 left-20 text-white/20 text-6xl animate-float">💄</div>
      <div class="absolute top-1/3 right-16 text-white/20 text-5xl animate-float delay-1000">🧴</div>
      <div class="absolute bottom-32 left-16 text-white/20 text-5xl animate-float delay-2000">💅</div>
      <div class="absolute top-1/2 left-1/4 text-white/30 text-4xl animate-pulse">✨</div>
    </div>

    <div class="w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl relative z-10">
      <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <Input v-model="form.username" label="Username" placeholder="Enter username" required />
        </div>
        <div class="mb-4">
          <Input v-model="form.email" type="email" label="Email" placeholder="Enter email" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              autocomplete="new-password"
              placeholder="Enter password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 focus:outline-none"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
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
const showPassword = ref(false)

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

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}
</style>
