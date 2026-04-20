import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isAIChatOpen = ref(false)

  const toggleAIChat = () => {
    isAIChatOpen.value = !isAIChatOpen.value
  }

  const openAIChat = () => {
    isAIChatOpen.value = true
  }

  const closeAIChat = () => {
    isAIChatOpen.value = false
  }

  return {
    isAIChatOpen,
    toggleAIChat,
    openAIChat,
    closeAIChat
  }
})
