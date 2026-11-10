<template>
  <button
    :type="type"
    :disabled="disabled"
    class="rounded-md border border-forest-300 px-3 py-2 text-sm disabled:opacity-60"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const { type = 'button', disabled = false } = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}>();
</script>
