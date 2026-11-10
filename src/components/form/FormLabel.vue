<template>
  <label class="mb-1 block text-sm font-medium">
    {{ label }}
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
