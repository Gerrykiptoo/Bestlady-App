<template>
  <div 
    :class="[
      'flex flex-col items-center justify-center',
      fullscreen && 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50',
      className
    ]"
  >
    <!-- Spinner -->
    <div 
      :class="[
        'animate-spin rounded-full border-2 border-gray-200 border-t-primary-600',
        size === 'xs' && 'h-4 w-4 border-2',
        size === 'sm' && 'h-6 w-6 border-2',
        size === 'md' && 'h-8 w-8 border-2',
        size === 'lg' && 'h-12 w-12 border-3',
        size === 'xl' && 'h-16 w-16 border-4',
        // Color variants
        color === 'primary' && 'border-t-primary-600',
        color === 'secondary' && 'border-t-secondary-500',
        color === 'white' && 'border-t-white',
        color === 'gray' && 'border-t-gray-600',
        color === 'success' && 'border-t-green-600',
        color === 'danger' && 'border-t-red-600'
      ]"
    ></div>
    
    <!-- Loading Text -->
    <p v-if="text" :class="[
      'mt-3 text-sm font-medium',
      color === 'white' ? 'text-white' : 'text-gray-600'
    ]">
      {{ text }}
    </p>
    
    <!-- Progress Text (optional) -->
    <p v-if="progress !== undefined" class="mt-2 text-xs text-gray-500">
      {{ progress }}%
    </p>
    
    <!-- Additional Slot for Custom Content -->
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  // Size variants
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // Color variants
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'gray', 'success', 'danger'].includes(value)
  },
  // Optional loading text
  text: {
    type: String,
    default: ''
  },
  // Progress percentage (0-100)
  progress: {
    type: Number,
    default: undefined
  },
  // Fullscreen overlay
  fullscreen: {
    type: Boolean,
    default: false
  },
  // Custom class
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Smooth rotation animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}

/* Pulsing animation for loading text */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

p {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Fullscreen overlay transition */
.fixed {
  transition: opacity 0.3s ease;
}
</style>