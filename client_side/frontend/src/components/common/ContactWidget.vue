<template>
  <!-- Floating contact bubble — bottom-left corner (AI assistant is bottom-right) -->
  <div class="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">

    <!-- Expanded options (shown when open) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div v-if="isOpen" class="flex flex-col gap-2.5 mb-1">

        <!-- WhatsApp button -->
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 bg-white rounded-2xl shadow-lg px-4 py-3 hover:shadow-xl transition-all group"
          style="border: 1px solid #ede9e3;"
          @click="isOpen = false"
        >
          <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #25D366;">
            <!-- WhatsApp SVG icon -->
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-800 group-hover:text-green-700 transition">Chat on WhatsApp</p>
            <p class="text-[10px] text-gray-400">We reply instantly</p>
          </div>
        </a>

        <!-- Email button -->
        <a
          :href="emailUrl"
          class="flex items-center gap-3 bg-white rounded-2xl shadow-lg px-4 py-3 hover:shadow-xl transition-all group"
          style="border: 1px solid #ede9e3;"
          @click="isOpen = false"
        >
          <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #7e22ce;">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-800 group-hover:text-purple-700 transition">Send an Email</p>
            <p class="text-[10px] text-gray-400">{{ businessEmail }}</p>
          </div>
        </a>

        <!-- Label -->
        <p class="text-xs text-gray-400 font-medium text-left ml-1">Need help?</p>
      </div>
    </Transition>

    <!-- Main toggle button -->
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
      :style="isOpen
        ? 'background: #6b7280;'
        : 'background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);'"
      :title="isOpen ? 'Close' : 'Contact us'"
    >
      <!-- WhatsApp icon when closed, X when open -->
      <Transition mode="out-in">
        <svg v-if="!isOpen" key="wa" class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        <svg v-else key="close" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </Transition>
    </button>

    <!-- Notification dot (shows when closed) -->
    <span v-if="!isOpen" class="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isOpen = ref(false)

const businessWhatsApp = import.meta.env.VITE_BUSINESS_WHATSAPP || '254703888085'
const businessEmail    = import.meta.env.VITE_BUSINESS_EMAIL    || 'kipgerry02@gmail.com'

const whatsappUrl = computed(() =>
  `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent('Hello BestLady Beauty! I need some help.')}`
)

const emailUrl = computed(() =>
  `mailto:${businessEmail}?subject=${encodeURIComponent('Inquiry – BestLady Beauty')}`
)
</script>
