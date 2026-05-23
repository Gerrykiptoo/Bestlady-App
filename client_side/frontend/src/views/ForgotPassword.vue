<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
      <!-- Logo / brand -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Forgot Password?</h1>
        <p class="text-gray-500 text-sm mt-2">Enter your account email and we'll send you a reset link.</p>
      </div>

      <!-- Success state -->
      <div v-if="sent" class="text-center py-4">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-gray-800 mb-2">Check Your Email</h2>
        <p class="text-gray-500 text-sm mb-6">If <strong>{{ email }}</strong> is registered, a password reset link has been sent. The link expires in 1 hour.</p>
        <router-link to="/login" class="text-primary-500 font-semibold hover:underline text-sm">Back to Login</router-link>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="your@email.com"
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
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>

        <p class="text-center text-sm text-gray-500">
          Remembered it?
          <router-link to="/login" class="text-primary-500 font-semibold hover:underline">Log in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const email = ref('');
const loading = ref(false);
const sent = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    sent.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
