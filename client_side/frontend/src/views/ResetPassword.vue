<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Set New Password</h1>
        <p class="text-gray-500 text-sm mt-2">Choose a strong password for your BestLady account.</p>
      </div>

      <!-- Invalid / expired token -->
      <div v-if="tokenError" class="text-center py-4">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-800 mb-2">Link Expired or Invalid</h2>
        <p class="text-gray-500 text-sm mb-6">This password reset link has expired or already been used.</p>
        <router-link to="/forgot-password" class="text-primary-500 font-semibold hover:underline text-sm">Request a new link</router-link>
      </div>

      <!-- Success -->
      <div v-else-if="done" class="text-center py-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-800 mb-2">Password Updated!</h2>
        <p class="text-gray-500 text-sm mb-6">Your password has been successfully changed. You can now log in.</p>
        <router-link to="/login" class="w-full inline-block text-center py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition shadow-md">
          Go to Login
        </router-link>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="Min. 6 characters"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
            :disabled="loading"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="confirm"
            type="password"
            required
            placeholder="Repeat password"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition shadow-md disabled:opacity-50"
        >
          {{ loading ? 'Updating...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const token = ref('');
const password = ref('');
const confirm = ref('');
const loading = ref(false);
const done = ref(false);
const tokenError = ref(false);
const error = ref('');

onMounted(() => {
  token.value = route.query.token || '';
  if (!token.value) tokenError.value = true;
});

const submit = async () => {
  error.value = '';
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  try {
    await api.post('/auth/reset-password', { token: token.value, password: password.value });
    done.value = true;
  } catch (err) {
    const msg = err.response?.data?.message || '';
    if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
      tokenError.value = true;
    } else {
      error.value = msg || 'Something went wrong. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
