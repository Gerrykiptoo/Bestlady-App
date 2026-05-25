<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-5 shadow-lg" style="background: var(--brand-gradient)">B</div>
      <div class="flex items-center justify-center gap-2 mb-3">
        <div class="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style="animation-delay:0s"></div>
        <div class="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style="animation-delay:0.15s"></div>
        <div class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay:0.3s"></div>
      </div>
      <p class="text-sm font-semibold text-gray-500">Loading your dashboard…</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
  const role = auth.role;
  const tier = auth.user?.tier;

  if (role === 'admin') {
    router.replace('/admin');
  } else if (role === 'staff') {
    router.replace('/staff');
  } else if (role === 'agent') {
    router.replace('/agent');
  } else if (tier === 'wholesale') {
    router.replace('/wholesale');
  } else if (tier === 'retail' || role === 'user') {
    router.replace('/retail');
  } else {
    router.replace('/');
  }
});
</script>
