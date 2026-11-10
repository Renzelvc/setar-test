<template>
  <label class="mb-2 flex items-center gap-1 text-xs font-semibold text-ink">
    {{ label }}
    <span v-if="required" class="text-forest-600" aria-hidden="true">*</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  required?: boolean;
}>();
</script>
