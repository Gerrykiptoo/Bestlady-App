<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Toggle Button -->
    <button 
      v-if="!isOpen"
      @click="toggleChat"
      class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative group"
    >
      <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <span class="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ask AI Assistant
      </span>
    </button>

    <!-- Chat Window -->
    <transition name="slide-up">
      <div 
        v-if="isOpen"
        class="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border border-gray-200"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 class="font-bold">AI Assistant</h3>
              <p class="text-xs text-white/80">Always here to help</p>
            </div>
          </div>
          <button @click="toggleChat" class="hover:bg-white/20 rounded-full p-1 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h4 class="font-bold text-gray-800 mb-2">Hi! I'm your AI Assistant</h4>
            <p class="text-sm text-gray-600 mb-4">Ask me anything about:</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <button 
                v-for="suggestion in quickSuggestions" 
                :key="suggestion"
                @click="sendMessage(suggestion)"
                class="text-xs bg-white px-3 py-2 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors border border-gray-200"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
          >
            <div 
              :class="[
                'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm',
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
              <span class="text-xs opacity-70 mt-1 block">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-gray-200">
          <form @submit.prevent="handleSubmit" class="flex gap-2">
            <input 
              v-model="userInput"
              type="text"
              placeholder="Type your message..."
              class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              :disabled="isTyping"
            />
            <button 
              type="submit"
              :disabled="!userInput.trim() || isTyping"
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-3 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const auth = useAuthStore()
const isOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isTyping = ref(false)
const messagesContainer = ref(null)

const quickSuggestions = computed(() => {
  if (auth.isAuthenticated) {
    return [
      'Product recommendations',
      'Order status',
      'Inventory insights',
      'Sales trends',
      'Best sellers'
    ]
  }
  return [
    'How does BestLady work?',
    'What are the benefits of joining?',
    'Trending beauty products',
    'Wholesale vs Retail options',
    'How to create an account'
  ]
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async (content) => {
  if (!content.trim()) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: content,
    timestamp: new Date()
  })

  userInput.value = ''
  scrollToBottom()

  // Show typing indicator
  isTyping.value = true

  try {
    const { data } = await api.post('/ai/chat', { 
      message: content,
      history: messages.value.slice(-10) // Send last 10 messages for context
    })

    // Add AI response
    messages.value.push({
      role: 'assistant',
      content: data.response,
      timestamp: new Date()
    })

    scrollToBottom()
  } catch (error) {
    console.error('AI chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    })
    toast.error('Failed to get AI response')
  } finally {
    isTyping.value = false
  }
}

const handleSubmit = () => {
  sendMessage(userInput.value)
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}
</style>
