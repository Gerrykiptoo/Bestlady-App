<template>
  <button 
    :type="type"
    :class="[
      'relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
      // Variants
      variant === 'primary' && 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-md hover:shadow-lg',
      variant === 'secondary' && 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      variant === 'danger' && 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md hover:shadow-lg',
      variant === 'success' && 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-md hover:shadow-lg',
      variant === 'warning' && 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-500 shadow-md hover:shadow-lg',
      variant === 'outline' && 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
      variant === 'ghost' && 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
      variant === 'dark' && 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-gray-950 focus:ring-gray-700 shadow-md hover:shadow-lg',
      // Sizes
      size === 'xs' && 'px-2.5 py-1.5 text-xs gap-1',
      size === 'sm' && 'px-4 py-2 text-sm gap-1.5',
      size === 'md' && 'px-6 py-3 text-base gap-2',
      size === 'lg' && 'px-8 py-4 text-lg gap-2',
      size === 'xl' && 'px-10 py-5 text-xl gap-3',
      block && 'w-full',
      loading && 'cursor-wait opacity-90'
    ]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="absolute inset-0 bg-black/10 flex items-center justify-center">
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- Icon Support -->
    <component 
      v-if="icon" 
      :is="icon" 
      class="transition-transform group-hover:scale-110"
      :class="[
        size === 'xs' && 'h-4 w-4',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-6 w-6',
        size === 'xl' && 'h-7 w-7'
      ]"
    />
    
    <!-- Slot for text/content -->
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
    
    <!-- Ripple Effect on Click -->
    <span 
      v-if="ripple"
      class="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
    >
      <span 
        v-for="n in 1" 
        :key="n"
        class="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full animate-ripple"
        :style="{
          left: rippleX + 'px',
          top: rippleY + 'px'
        }"
      ></span>
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { 
    type: String, 
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning', 'outline', 'ghost', 'dark'].includes(value)
  },
  size: { 
    type: String, 
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  icon: { type: Object, default: null },
  ripple: { type: Boolean, default: false }
})

defineEmits(['click'])

// Ripple effect coordinates
const rippleX = ref(0)
const rippleY = ref(0)

// Handle ripple effect on click (optional)
const handleRipple = (event) => {
  if (props.ripple) {
    const rect = event.currentTarget.getBoundingClientRect()
    rippleX.value = event.clientX - rect.left
    rippleY.value = event.clientY - rect.top
    setTimeout(() => {
      rippleX.value = -100
      rippleY.value = -100
    }, 500)
  }
}
</script>

<style scoped>
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}

button {
  position: relative;
  isolation: isolate;
}

/* Hover effect for ghost variant */
button[variant="ghost"]:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0.1;
  border-radius: inherit;
  pointer-events: none;
}

/* Active state for all buttons */
button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Focus visible outline */
button:focus-visible {
  outline: none;
  ring: 2px solid;
  ring-offset: 2px;
}
</style>