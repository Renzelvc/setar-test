<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'border-forest-300 bg-white text-ink enabled:hover:bg-forest-50':
        theme === 'default',
      'border-forest-700 bg-forest-700 text-white enabled:hover:border-forest-800 enabled:hover:bg-forest-800':
        theme === 'forest',
      'focus-visible:outline-forest-700': theme !== 'danger',
      'border-red-700 bg-red-700 text-white enabled:hover:border-red-800 enabled:hover:bg-red-800 focus-visible:outline-red-700':
        theme === 'danger',
    }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const {
  type = 'button',
  disabled = false,
  theme = 'default',
} = defineProps<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  theme?: 'default' | 'forest' | 'danger';
}>();
</script>
