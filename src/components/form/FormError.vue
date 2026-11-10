<template>
  <p v-if="message" :id="id" class="mt-1.5 text-xs leading-relaxed text-red-700">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  message?: string;
}>();
</script>
