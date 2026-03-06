<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold text-primary mb-8">Welcome to BestLady</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-bold mb-4">Retail Experience</h2>
        <p class="text-gray-600 mb-6">Personalized AI insights for your beauty business.</p>
        <router-link to="/login" class="bg-primary text-white px-6 py-3 rounded-lg font-bold">Get Started</router-link>
      </div>
      <div class="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 class="text-2xl font-bold mb-4">Wholesale Solutions</h2>
        <p class="text-gray-600 mb-6">Bulk management and logistics tracking for large operations.</p>
        <router-link to="/login" class="bg-secondary text-white px-6 py-3 rounded-lg font-bold">Partner Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
