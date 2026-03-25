<template>
  <div :class="['bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300', className]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: { type: String, default: '' }
})
</script>
