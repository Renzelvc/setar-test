<template>
  <input
    :id="id"
    v-model="model"
    :name="name"
    :required="required"
    :aria-invalid="danger ? 'true' : 'false'"
    :class="[
      'w-full rounded-md border px-3 py-2 outline-none disabled:opacity-60',
      danger
        ? 'border-red-600 focus:border-red-700 focus:ring-2 focus:ring-red-200'
        : 'border-forest-300 focus:border-forest-700 focus:ring-2 focus:ring-forest-200',
    ]"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    name: string;
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
