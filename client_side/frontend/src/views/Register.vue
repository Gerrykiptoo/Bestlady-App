<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- ══ Left Brand Panel ══ -->
    <div class="hidden lg:flex lg:w-[45%] xl:w-2/5 flex-col justify-between p-12 relative overflow-hidden" style="background: linear-gradient(145deg, #581c87 0%, #7e22ce 40%, #9333ea 70%, #db2777 100%)">
      <!-- Ambient circles -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full"></div>
        <div class="absolute top-1/2 -right-32 w-80 h-80 bg-pink-400/10 rounded-full"></div>
        <div class="absolute -bottom-10 left-1/3 w-64 h-64 bg-purple-300/10 rounded-full"></div>
      </div>

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <span class="text-white font-black text-2xl tracking-tight">BestLady</span>
        <span class="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">AI</span>
      </div>

      <!-- Middle content -->
      <div class="relative z-10 space-y-8">
        <div>
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 font-medium mb-6">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Join 10,000+ beauty professionals in Kenya
          </div>
          <h1 class="text-4xl xl:text-5xl font-black text-white leading-tight">
            Grow Your<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Beauty Business</span><br/>
            With AI
          </h1>
          <p class="text-white/70 text-base mt-4 leading-relaxed max-w-sm">
            Get access to premium products, AI-powered pricing, loyalty rewards, and real-time tracking — all in one platform.
          </p>
        </div>

        <div class="space-y-3">
          <div v-for="f in features" :key="f.text" class="flex items-center gap-3 text-white/85 text-sm">
            <div class="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="f.icon"/>
              </svg>
            </div>
            <span>{{ f.text }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom stats -->
      <div class="relative z-10 grid grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-2xl font-black text-white">500+</p>
          <p class="text-white/60 text-xs mt-0.5">Products</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-black text-white">10K+</p>
          <p class="text-white/60 text-xs mt-0.5">Businesses</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-black text-white">15%</p>
          <p class="text-white/60 text-xs mt-0.5">Max Savings</p>
        </div>
      </div>
    </div>

    <!-- ══ Right: Registration Form ══ -->
    <div class="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:py-8">
      <div class="w-full max-w-[440px]">

        <!-- Mobile logo -->
        <div class="flex items-center gap-2 mb-8 lg:hidden">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow" style="background: linear-gradient(135deg, #7e22ce, #db2777)">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span class="font-black text-xl text-gray-900">BestLady</span>
        </div>

        <!-- Header with progress -->
        <div class="mb-7">
          <h2 class="text-3xl font-black text-gray-900">Create your account</h2>
          <p class="text-gray-500 mt-1.5">Step {{ step }} of 2 — {{ step === 1 ? 'Personal details' : 'Business information' }}</p>
          <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :style="`width: ${step === 1 ? 50 : 100}%; background: linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #db2777 100%)`"></div>
          </div>
        </div>

        <!-- Step 1: Personal Info -->
        <form v-if="step === 1" @submit.prevent="nextStep" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input v-model="form.username" type="text" required placeholder="e.g. janedoe_beauty"
                class="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" style="border: 2px solid #ede9e3; background: white; --tw-ring-color: rgba(126,34,206,0.1);"" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input v-model="form.email" type="email" required placeholder="you@example.com" autocomplete="email"
                class="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" style="border: 2px solid #ede9e3; background: white; --tw-ring-color: rgba(126,34,206,0.1);"" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="Min. 6 characters" autocomplete="new-password"
                class="w-full pl-11 pr-12 py-3 rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" style="border: 2px solid #ede9e3; background: white; --tw-ring-color: rgba(126,34,206,0.1);"" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition">
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
              </button>
            </div>
            <div v-if="form.password" class="mt-2 flex gap-1">
              <div v-for="i in 4" :key="i" class="flex-1 h-1 rounded-full transition-all duration-300"
                :class="passwordStrength >= i ? strengthBarColor : 'bg-gray-200'"></div>
            </div>
            <p v-if="form.password" class="text-xs mt-1 font-medium" :class="strengthTextColor">{{ strengthLabel }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">M-Pesa Phone Number</label>
            <div class="relative flex">
              <span class="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-600 font-semibold">+254</span>
              <input v-model="form.phone" type="tel" required placeholder="712 345 678" autocomplete="tel"
                class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400" />
            </div>
            <p class="text-xs text-gray-400 mt-1">Used for M-Pesa payments and order notifications</p>
          </div>

          <button type="submit" class="btn-primary w-full py-3.5 text-base mt-2">
            Continue to Business Details
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </form>

        <!-- Step 2: Business Info -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <!-- Business name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <input v-model="form.business_name" type="text" required placeholder="e.g. Jane's Beauty Salon"
                class="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all text-gray-800 placeholder-gray-400" style="border: 2px solid #ede9e3; background: white; --tw-ring-color: rgba(126,34,206,0.1);"" />
            </div>
          </div>

          <!-- Business type -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Business Type</label>
            <div class="relative">
              <div class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </div>
              <select v-model="form.business_type" required
                class="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 appearance-none">
                <option value="">Select your business type…</option>
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
            </div>
            <p class="text-xs text-gray-400 mt-1">Your pricing tier is automatically set based on business type</p>
          </div>

          <!-- Tier preview -->
          <div v-if="tierPreview" class="flex items-center gap-3 rounded-xl px-4 py-3 border border-purple-100 bg-purple-50">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg, #7e22ce, #db2777)">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-purple-800">You'll join as <span class="capitalize">{{ tierPreview }}</span></p>
              <p class="text-xs text-purple-600 mt-0.5">{{ tierPreview === 'wholesale' ? 'Bulk pricing & exclusive wholesale deals' : 'Retail pricing with AI loyalty rewards' }}</p>
            </div>
          </div>

          <!-- Role selector (admin only) -->
          <div v-if="isAdmin">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Account Role</p>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="r in roleOptions" :key="r.value" type="button" @click="form.role = r.value"
                :class="form.role === r.value ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' : 'hover:text-gray-700'"
                class="flex flex-col items-center gap-1.5 py-3 border-2 rounded-xl transition-all text-xs font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="r.icon"/>
                </svg>
                {{ r.label }}
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-1">
            <button type="button" @click="step = 1" class="btn-outline flex-1 py-3.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back
            </button>
            <button type="submit" :disabled="loading" class="btn-primary flex-1 py-3.5 text-base">
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ loading ? 'Creating Account…' : 'Create Account' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Already have an account?
            <router-link to="/login" class="font-bold text-purple-600 hover:text-purple-700 transition ml-1">Sign in →</router-link>
          </p>
        </div>

        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-5 mt-8 text-xs text-gray-400 border-t border-gray-100 pt-6">
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
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(false)
const showPassword = ref(false)
const step = ref(1)

const form = reactive({
  username: '',
  email: '',
  password: '',
  phone: '',
  business_name: '',
  business_type: '',
  role: 'user',
})

const isAdmin = computed(() => auth.isAuthenticated && auth.user?.role === 'admin')

const wholesaleTypes = ['mall', 'large_supermarket', 'chain_store', 'distributor', 'exporter', 'institution']
const tierPreview = computed(() => {
  if (!form.business_type) return null
  return wholesaleTypes.includes(form.business_type) ? 'wholesale' : 'retail'
})

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthBarColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-400'
  if (passwordStrength.value === 2) return 'bg-amber-400'
  if (passwordStrength.value === 3) return 'bg-yellow-400'
  return 'bg-green-500'
})

const strengthTextColor = computed(() => {
  if (passwordStrength.value <= 1) return 'text-red-500'
  if (passwordStrength.value === 2) return 'text-amber-500'
  if (passwordStrength.value === 3) return 'text-yellow-600'
  return 'text-green-600'
})

const strengthLabel = computed(() => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[passwordStrength.value] || ''
})

const roleOptions = [
  { value: 'user',  label: 'Customer', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { value: 'staff', label: 'Staff',    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { value: 'agent', label: 'Agent',    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]

const features = [
  { text: 'AI-powered product recommendations', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { text: 'Loyalty tier rewards up to 15% discount', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { text: 'M-Pesa & wallet payments built-in', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { text: 'Real-time order & delivery tracking', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
]

const nextStep = () => {
  if (!form.username.trim()) return toast.error('Please enter a username')
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
  if (!emailRegex.test(form.email)) return toast.error('Please enter a valid email address')
  if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
  if (!form.phone.trim()) return toast.error('Please enter your phone number')
  step.value = 2
}

const handleRegister = async () => {
  if (!form.business_name.trim()) return toast.error('Please enter your business name')
  if (!form.business_type) return toast.error('Please select a business type')

  const rawPhone = form.phone.trim().replace(/\s+/g, '')
  const phoneRegex = /^(254|0)[0-9]{9}$/
  if (!phoneRegex.test(rawPhone)) return toast.error('Enter a valid Kenyan phone number (e.g. 2547XXXXXXXX or 07XXXXXXXX)')

  loading.value = true
  try {
    const payload = { ...form, phone: rawPhone }
    const { data } = await api.post('/auth/register', payload)
    auth.setAuth(data)
    toast.success('Account created! Welcome to BestLady!')
    router.push('/dashboard')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
