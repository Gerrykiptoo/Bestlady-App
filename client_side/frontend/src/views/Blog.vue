<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-purple-700 to-pink-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-black mb-3">BestLady Blog</h1>
      <p class="text-purple-100 max-w-lg mx-auto">Beauty industry insights, product spotlights, business tips, and AI-powered ordering guides.</p>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-16">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div class="h-40 bg-gray-200"></div>
          <div class="p-5 space-y-3"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-3 bg-gray-200 rounded"></div><div class="h-3 bg-gray-200 rounded w-2/3"></div></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="posts.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
        <p class="text-gray-400 text-sm">Check back soon — our team is writing great content for you.</p>
      </div>

      <!-- Posts grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group block"
        >
          <div class="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <svg class="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div class="p-5">
            <p class="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-2">{{ formatDate(post.createdAt) }}</p>
            <h3 class="font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition line-clamp-2">{{ post.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-3">{{ stripHtml(post.body) }}</p>
            <div class="flex items-center gap-2 mt-4">
              <div class="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
                {{ (post.Author?.business_name || post.Author?.username || 'BL')[0].toUpperCase() }}
              </div>
              <span class="text-xs text-gray-500">{{ post.Author?.business_name || post.Author?.username || 'BestLady Team' }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { formatDate } from '@/utils/formatters'

const posts = ref([])
const loading = ref(true)

const stripHtml = (html) => html?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || ''

onMounted(async () => {
  try {
    const { data } = await api.get('/content/blog')
    posts.value = data
  } catch { /* silent */ } finally { loading.value = false }
})
</script>
