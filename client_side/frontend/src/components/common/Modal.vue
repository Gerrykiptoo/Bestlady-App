<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 transition-all duration-300"
          :class="[
            backdrop === 'blur' ? 'backdrop-blur-sm bg-black/30' : 'bg-black/50',
            'transition-opacity'
          ]"
          @click="close"
        ></div>
        
        <!-- Modal Container -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <transition name="modal-zoom">
            <div 
              v-if="show"
              :class="[
                'relative bg-white rounded-2xl shadow-2xl w-full transition-all duration-300',
                size === 'sm' && 'max-w-md',
                size === 'md' && 'max-w-lg',
                size === 'lg' && 'max-w-2xl',
                size === 'xl' && 'max-w-4xl',
                size === 'full' && 'max-w-6xl',
                className
              ]"
            >
              <!-- Header -->
              <div v-if="$slots.header || title" class="border-b border-gray-100 px-6 py-4">
                <slot name="header">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
                    <button 
                      v-if="showClose" 
                      @click="close" 
                      class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
                </slot>
              </div>
              
              <!-- Content -->
              <div :class="[
                'overflow-y-auto',
                scrollable ? 'max-h-[70vh]' : '',
                padding === 'none' ? 'p-0' : `p-${padding}`
              ]">
                <slot />
              </div>
              
              <!-- Footer -->
              <div v-if="$slots.footer" class="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <slot name="footer" />
              </div>
              
              <!-- Close Button (if no header) -->
              <button 
                v-if="showClose && !$slots.header && !title" 
                @click="close" 
                class="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  showClose: { type: Boolean, default: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: { 
    type: String, 
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  padding: { 
    type: String, 
    default: '6',
    validator: (value) => ['0', '2', '4', '6', '8'].includes(value)
  },
  scrollable: { type: Boolean, default: false },
  backdrop: { 
    type: String, 
    default: 'dark',
    validator: (value) => ['dark', 'blur', 'none'].includes(value)
  },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  className: { type: String, default: '' }
})

const emit = defineEmits(['close', 'open'])

const close = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

// Handle ESC key
const handleEscape = (e) => {
  if (props.closeOnEscape && props.show && e.key === 'Escape') {
    emit('close')
  }
}

// Watch for show changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    emit('open')
    document.addEventListener('keydown', handleEscape)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
/* Fade animation for backdrop */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Zoom animation for modal content */
.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: all 0.2s ease;
}

.modal-zoom-enter-from,
.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollable content styling */
.max-h-\[70vh\] {
  max-height: 70vh;
}

/* Custom scrollbar for scrollable content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>