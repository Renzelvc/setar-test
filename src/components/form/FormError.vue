<template>
  <p v-if="message" :id="id" class="mt-1 text-sm text-red-700">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  message?: string;
}>();
</script>
