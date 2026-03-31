<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 relative overflow-hidden py-12">
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
      <!-- Back to Home Link -->
      <div class="mb-4">
        <router-link 
          to="/" 
          class="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors font-medium"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </router-link>
      </div>

      <h2 class="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
        Create Account
      </h2>
      <p class="text-center text-gray-500 mb-6">Join BestLady today</p>
      
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <Input v-model="form.username" label="Username" placeholder="Enter username" required />
        </div>
        
        <div>
          <Input v-model="form.email" type="email" label="Email" placeholder="Enter email" required autocomplete="email" />
        </div>
        
        <div>
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
        
        <div>
          <Input v-model="form.phone" label="Phone Number" placeholder="2547XXXXXXXX" required autocomplete="tel" />
        </div>
        
        <div>
          <Input v-model="form.business_name" label="Business Name" placeholder="Enter business name" required />
        </div>
        
        <!-- User Role (Only visible to admin) -->
        <div v-if="isAdmin">
          <label class="block text-sm font-medium text-gray-700 mb-1">User Role</label>
          <select v-model="form.role" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white">
            <option value="user">Customer/User</option>
            <option value="staff">Staff</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <select v-model="form.business_type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white" required>
            <option value="">Select Business Type</option>
            <optgroup label="Retail">
              <option value="salon">Salon (Individual)</option>
              <option value="mini_supermarket">Mini Supermarket</option>
              <option value="beauty_shop">Beauty Shop</option>
              <option value="freelance">Freelance Stylist</option>
            </optgroup>
            <optgroup label="Wholesale">
              <option value="mall">Mall</option>
              <option value="large_supermarket">Large Supermarket</option>
              <option value="chain_store">Chain Store</option>
              <option value="distributor">Distributor</option>
              <option value="exporter">Exporter</option>
              <option value="institution">Institution</option>
            </optgroup>
          </select>
          <p class="text-xs text-gray-500 mt-1 mt-1">
            Your tier will be automatically determined based on business type
          </p>
        </div>
        
        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
          <span v-else>Create Account</span>
        </button>
      </form>
      
      <p class="text-center mt-6 text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-primary-600 font-semibold hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
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

// Check if current user is admin (for creating staff/agent accounts)
const isAdmin = computed(() => {
  return auth.isAuthenticated && auth.user?.role === 'admin'
})

const handleRegister = async () => {
  // Validation
  if (!form.username || !form.email || !form.password || !form.phone || !form.business_name || !form.business_type) {
    toast.error('Please fill in all required fields')
    return
  }
  
  // Phone validation (Kenyan format)
  const phoneRegex = /^(254|0)[0-9]{9}$/
  if (!phoneRegex.test(form.phone)) {
    toast.error('Please enter a valid Kenyan phone number (e.g., 2547XXXXXXXX or 07XXXXXXXX)')
    return
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    toast.error('Please enter a valid email address')
    return
  }
  
  // Password length validation
  if (form.password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return
  }
  
  loading.value = true
  try {
    const { data } = await api.post('/auth/register', form)
    auth.setAuth(data)
    toast.success('Registration successful! Welcome to BestLady!')
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
    toast.error(errorMessage)
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

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 3s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}
</style>
