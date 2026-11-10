<template>
  <input
    :id="id"
    v-model="model"
    :name="name"
    :placeholder="placeholder"
    :required="required"
    :class="[
      'min-h-11 w-full rounded-lg border bg-paper/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60',
      danger
        ? 'border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-200'
        : 'border-forest-200 hover:border-forest-300 focus:border-forest-700 focus:ring-2 focus:ring-forest-100',
    ]"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    name: string;
    placeholder?: string;
    required: boolean;
    danger?: boolean;
  }>(),
  {
    danger: false,
  },
);

const model = defineModel<string>({
  required: true,
  set: (value) => String(value ?? ''),
});
</script>
