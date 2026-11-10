<template>
  <input
    v-bind="$attrs"
    v-model="model"
    class="w-full rounded-md border border-forest-300 px-3 py-2 outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-200 aria-invalid:border-red-600 disabled:opacity-60"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true });
</script>
