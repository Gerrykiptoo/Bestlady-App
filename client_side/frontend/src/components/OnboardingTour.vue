<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" style="background: rgba(15,10,30,0.75); backdrop-filter: blur(4px)">
        <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
          <!-- Gradient top bar -->
          <div class="h-1.5 w-full" style="background: linear-gradient(90deg, #7e22ce 0%, #9333ea 50%, #db2777 100%)"></div>

          <!-- Step indicator strip -->
          <div class="flex items-center gap-1.5 px-6 pt-5">
            <div v-for="i in steps.length" :key="i"
              class="flex-1 h-1 rounded-full transition-all duration-500"
              :class="i <= currentStep ? 'bg-purple-600' : 'bg-gray-200'">
            </div>
          </div>

          <!-- Content -->
          <div class="px-8 py-6">
            <!-- Illustration area -->
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                style="background: linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #db2777 100%)">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="currentStepData.icon"/>
                </svg>
                <!-- Subtle shine -->
                <div class="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-2xl"></div>
              </div>
            </div>

            <!-- Step tag -->
            <p class="text-center text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">
              Step {{ currentStep }} of {{ steps.length }}
            </p>

            <!-- Title -->
            <h2 class="text-2xl font-black text-gray-900 text-center leading-tight">{{ currentStepData.title }}</h2>

            <!-- Description -->
            <p class="text-gray-500 text-center mt-3 leading-relaxed text-sm">{{ currentStepData.description }}</p>

            <!-- Feature highlights -->
            <div v-if="currentStepData.highlights" class="mt-5 space-y-2">
              <div v-for="item in currentStepData.highlights" :key="item" class="flex items-start gap-3 text-sm text-gray-600">
                <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style="background: linear-gradient(135deg, #9333ea, #db2777)">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span>{{ item }}</span>
              </div>
            </div>

            <!-- Action tip -->
            <div v-if="currentStepData.tip" class="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <svg class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-xs text-amber-700 font-medium leading-relaxed">{{ currentStepData.tip }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 px-8 pb-7">
            <button @click="skip" class="text-sm text-gray-400 hover:text-gray-600 transition font-medium px-3 py-2 rounded-xl hover:bg-gray-50">
              Skip tour
            </button>
            <div class="flex-1"></div>
            <button v-if="currentStep > 1" @click="currentStep--" class="px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm">
              Back
            </button>
            <button @click="next" class="px-6 py-2.5 text-white font-bold rounded-xl transition hover:opacity-90 hover:shadow-lg text-sm flex items-center gap-2"
              style="background: linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #db2777 100%)">
              {{ currentStep === steps.length ? 'Get Started!' : 'Next' }}
              <svg v-if="currentStep < steps.length" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const visible = ref(false)
const currentStep = ref(1)

const ONBOARDING_KEY = (id) => `bl_onboarded_${id}`

const steps = [
  {
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Welcome to BestLady!',
    description: "You're now part of Kenya's #1 AI-powered beauty supply platform. Let's take a quick tour so you feel right at home.",
    highlights: [
      'Over 500 premium beauty products',
      'AI-powered recommendations tailored to you',
      'Loyalty rewards that grow with every purchase',
    ],
    tip: "This tour takes less than 60 seconds. You can always revisit it from your Profile settings.",
  },
  {
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    title: 'Browse & Shop Products',
    description: 'Use the Products page to explore our full catalogue. Filter by category, sort by price or popularity, and add items to your cart.',
    highlights: [
      'Search by product name or category',
      'View images, descriptions, and stock levels',
      'Add to cart with one click',
    ],
    tip: "Try the search bar at the top — it's fast and works across all product names and categories.",
  },
  {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'Meet Your AI Assistant',
    description: 'The AI chat assistant (bottom-right button) can recommend products, check your order status, and answer questions about anything in the store.',
    highlights: [
      'Ask "What\'s good for dry hair?"',
      'Get AI-negotiated discounts on bulk orders',
      'Check order status by asking naturally',
    ],
    tip: 'The AI learns your preferences over time and gives better recommendations with every interaction.',
  },
  {
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    title: 'Wallet & M-Pesa Payments',
    description: "Top up your BestLady wallet via M-Pesa STK Push and use it to pay for orders instantly. It's fast, secure, and earns you loyalty points.",
    highlights: [
      'Top up from KES 10 — no minimum',
      'Pay for orders directly from wallet',
      'Download PDF statements anytime',
    ],
    tip: 'Your wallet balance appears at the top of your Profile and in the user menu for quick reference.',
  },
  {
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    title: 'Your Dashboard & Orders',
    description: 'Your Dashboard shows sales analytics, quick stats, and recent activity. The Orders page lets you track every purchase with real-time status updates.',
    highlights: [
      'Real-time order status: pending → delivered',
      'Download order history as PDF',
      'Track loyalty tier progress',
    ],
    tip: 'Bookmark your dashboard — it updates in real time and gives you the full picture of your business.',
  },
]

const currentStepData = computed(() => steps[currentStep.value - 1])

const finish = () => {
  if (auth.user?.id) {
    localStorage.setItem(ONBOARDING_KEY(auth.user.id), '1')
  }
  visible.value = false
  currentStep.value = 1
}

const next = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  } else {
    finish()
  }
}

const skip = () => finish()

const maybeShow = (user) => {
  if (!user?.id) return
  if (!localStorage.getItem(ONBOARDING_KEY(user.id))) {
    currentStep.value = 1
    visible.value = true
  }
}

watch(() => auth.user, (user) => {
  if (user) maybeShow(user)
}, { immediate: true })
</script>

<style scoped>
.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 0.25s ease;
}
.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}
.tour-fade-enter-active .relative,
.tour-fade-leave-active .relative {
  transition: transform 0.25s ease;
}
.tour-fade-enter-from .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
