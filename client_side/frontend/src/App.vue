<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
    <AIChatAssistant />
    <OnboardingTour />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import AIChatAssistant from '@/components/AIChatAssistant.vue'
import OnboardingTour from '@/components/OnboardingTour.vue'
import { useAuthStore } from '@/stores/auth'
import { initSocket, disconnectSocket } from '@/services/socket'

const auth = useAuthStore()

watch(() => auth.user, (user) => {
  if (user && user.id) {
    initSocket(user.id)
  } else {
    disconnectSocket()
  }
}, { immediate: true })

onMounted(() => {
  if (auth.user && auth.user.id) {
    initSocket(auth.user.id)
  }
})
</script>
