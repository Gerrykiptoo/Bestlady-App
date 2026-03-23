<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-primary">Login to BestLady</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="credentials.email" type="email" required class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="credentials.password" type="password" required class="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary focus:border-primary" />
        </div>
        <button type="submit" :disabled="auth.loading" class="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-50">
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toast-notification';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const credentials = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await auth.login(credentials);
    toast.success('Login successful!');
    router.push('/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
};
</script>
