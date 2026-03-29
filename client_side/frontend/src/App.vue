<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
    <AIChatAssistant v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import AIChatAssistant from '@/components/AIChatAssistant.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
</script>
