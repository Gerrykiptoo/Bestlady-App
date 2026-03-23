<template>
  <div>Loading...</div>
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
  } else if (role === 'user') {
    router.replace('/user/dashboard');
  } else {
    router.replace('/');
  }
});
</script>
