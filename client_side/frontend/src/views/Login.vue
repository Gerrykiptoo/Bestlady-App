<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- ══ Left Brand Panel ══ -->
    <div class="hidden lg:flex lg:w-[45%] xl:w-2/5 flex-col justify-between p-12 relative overflow-hidden" style="background: linear-gradient(145deg, #581c87 0%, #7e22ce 40%, #9333ea 70%, #db2777 100%)">
      <!-- Ambient background circles -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 -right-32 w-80 h-80 bg-pink-400/10 rounded-full"></div>
        <div class="absolute -bottom-10 left-1/3 w-64 h-64 bg-purple-300/10 rounded-full"></div>
      </div>

      <!-- Top: Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <span class="text-white font-black text-2xl tracking-tight">BestLady</span>
        <span class="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">AI</span>
      </div>

      <!-- Middle: Hero copy -->
      <div class="relative z-10 space-y-8">
        <div>
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 font-medium mb-6">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Trusted by 10,000+ businesses in Kenya
          </div>
          <h1 class="text-4xl xl:text-5xl font-black text-white leading-tight">
            Your Beauty<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Supply Chain</span><br/>
            Starts Here
          </h1>
          <p class="text-white/70 text-base mt-4 leading-relaxed max-w-sm">
            Premium beauty products with AI-powered recommendations, loyalty rewards, and real-time order tracking.
          </p>
        </div>

        <!-- Feature list -->
        <div class="space-y-3">
          <div v-for="f in features" :key="f.text" class="flex items-center gap-3 text-white/85 text-sm">
            <div class="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <component :is="'svg'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="f.icon"/>
              </component>
            </div>
            <span>{{ f.text }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom: Floating insight card -->
      <div class="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-sm">AI Insight</p>
            <p class="text-white/70 text-xs mt-0.5 leading-relaxed">"Platinum members save an average of KES 4,200 per month with AI discount recommendations."</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Right: Login Form ══ -->
    <div class="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:py-0">
      <div class="w-full max-w-[420px]">

        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow" style="background: linear-gradient(135deg, #7e22ce, #db2777)">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span class="font-black text-xl text-gray-900">BestLady</span>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-black text-gray-900">Welcome back</h2>
          <p class="text-gray-500 mt-1.5">Sign in to your BestLady account</p>
        </div>

        <!-- Role selector -->
        <div class="mb-6">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Sign in as</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="role in roles"
              :key="role.value"
              type="button"
              @click="credentials.userType = role.value"
              :class="[
                'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-150 text-xs font-semibold',
                credentials.userType === role.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="role.icon"/>
              </svg>
              {{ role.label }}
            </button>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-4.5 h-4.5 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                v-model="credentials.email"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-sm font-semibold text-gray-700">Password</label>
              <router-link to="/forgot-password" class="text-xs text-purple-600 hover:text-purple-700 font-semibold transition">
                Forgot password?
              </router-link>
            </div>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Enter your password"
                class="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition">
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
              </button>
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="auth.loading"
            class="btn-primary w-full py-3.5 text-base mt-2"
          >
            <svg v-if="auth.loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
            {{ auth.loading ? 'Signing in…' : 'Sign In to Account' }}
          </button>
        </form>

        <!-- Divider + register link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            New to BestLady?
            <router-link to="/register" class="font-bold text-purple-600 hover:text-purple-700 transition ml-1">
              Create a free account →
            </router-link>
          </p>
        </div>

        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-5 mt-8 text-xs text-gray-400">
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            SSL Secured
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Encrypted
          </span>
          <span class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            M-Pesa Ready
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const showPassword = ref(false)

const credentials = reactive({ email: '', password: '', userType: 'user' })

const roles = [
  { value: 'user',  label: 'User',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { value: 'staff', label: 'Staff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { value: 'agent', label: 'Agent', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { value: 'admin', label: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const features = [
  { text: 'AI-powered product recommendations', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { text: 'Loyalty rewards up to 15% discount', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { text: 'M-Pesa & wallet payments built-in', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { text: 'Real-time order & delivery tracking', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
]

const handleLogin = async () => {
  try {
    const response = await auth.login(credentials)
    if (credentials.userType !== 'user' && response.user.role !== credentials.userType) {
      toast.error(`You don't have ${credentials.userType} privileges`)
      auth.logout()
      return
    }
    toast.success('Welcome back!')
    router.push('/dashboard')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
  }
}
</script>
