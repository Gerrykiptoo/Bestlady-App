<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-6 py-12">
      <router-link to="/blog" class="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-800 transition mb-8">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Blog
      </router-link>

      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-64 bg-gray-200 rounded-2xl mt-6"></div>
      </div>

      <div v-else-if="!post" class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-700 mb-2">Post Not Found</h2>
        <router-link to="/blog" class="text-purple-600 hover:underline">Return to blog</router-link>
      </div>

      <article v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <svg class="w-16 h-16 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <div class="p-8">
          <p class="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-3">{{ formatDate(post.createdAt) }}</p>
          <h1 class="text-3xl font-black text-gray-800 mb-4">{{ post.title }}</h1>
          <div class="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div class="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
              {{ (post.Author?.business_name || post.Author?.username || 'BL')[0].toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ post.Author?.business_name || post.Author?.username || 'BestLady Team' }}</p>
              <p class="text-xs text-gray-400">Published {{ formatDate(post.createdAt) }}</p>
            </div>
          </div>
          <div class="prose prose-purple max-w-none text-gray-700 leading-relaxed" v-html="post.body"></div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/content/blog/${route.params.slug}`)
    post.value = data
  } catch { post.value = null } finally { loading.value = false }
})
</script>
