<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { initSocket, disconnectSocket } from '@/services/socket';

const auth = useAuthStore();

// Handle socket connection based on auth state
watch(() => auth.user, (newUser) => {
  if (newUser) {
    initSocket(newUser.id);
  } else {
    disconnectSocket();
  }
}, { immediate: true });
</script>
