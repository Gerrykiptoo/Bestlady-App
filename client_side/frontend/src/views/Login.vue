<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-36 h-36 bg-white rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div class="absolute bottom-40 right-1/3 w-28 h-28 bg-white rounded-full blur-3xl animate-pulse delay-3000"></div>
    </div>
    
    <!-- Decorative Beauty Icons -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Lipstick Icon -->
      <div class="absolute top-20 left-20 text-white/20 text-6xl animate-float">💄</div>
      <!-- Perfume Icon -->
      <div class="absolute top-1/3 right-16 text-white/20 text-5xl animate-float delay-1000">🧴</div>
      <!-- Makeup Brush -->
      <div class="absolute bottom-32 left-16 text-white/20 text-5xl animate-float delay-2000">💅</div>
      <!-- Sparkles -->
      <div class="absolute top-1/2 left-1/4 text-white/30 text-4xl animate-pulse">✨</div>
      <div class="absolute bottom-1/4 right-1/4 text-white/30 text-4xl animate-pulse delay-1000">✨</div>
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
        Welcome Back
      </h2>
      <p class="text-center text-gray-500 mb-6">Login to your BestLady account</p>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Login As</label>
          <select 
            v-model="credentials.userType"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          >
            <option value="user">Registered User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            v-model="credentials.email" 
            type="email" 
            required 
            autocomplete="email"
            placeholder="Enter your email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="credentials.password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              autocomplete="current-password"
              placeholder="Enter your password"
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
        
        <!-- Enhanced Login Button -->
        <button 
          type="submit" 
          :disabled="auth.loading" 
          class="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg hover:from-primary-700 hover:to-primary-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="auth.loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
          <span v-else class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to Account
          </span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign up here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toast-notification';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const showPassword = ref(false);
const credentials = reactive({
  email: '',
  password: '',
  userType: 'user'
});

const handleLogin = async () => {
  try {
    const response = await auth.login(credentials);
    
    // Validate role if logging in as admin
    if (credentials.userType === 'admin' && response.user.role !== 'admin') {
      toast.error('You do not have admin privileges');
      auth.logout();
      return;
    }

    toast.success('Login successful!');
    router.push('/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
};
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

.delay-3000 {
  animation-delay: 3s;
}
</style>
