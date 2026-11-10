<template>
  <component
    :is="as"
    class="flex h-28 items-center justify-between gap-4 rounded-lg border border-line bg-white p-4"
  >
    <div class="min-w-0 flex-1">
      <h2 class="truncate font-semibold">
        {{ registration.brand }} {{ registration.model }}
      </h2>
      <p class="truncate text-sm text-muted">
        {{ registration.registrationNumber }} · {{ registration.buildYear }} ·
        {{ registration.type }}
      </p>
      <p class="truncate text-sm text-muted">
        Registered by {{ registration.registeredBy }}
      </p>
    </div>

    <AppButton
      :disabled="disabled"
      :aria-label="`Edit ${registration.registrationNumber}`"
      class="shrink-0"
      @click="emit('edit', registration)"
    >
      Edit
    </AppButton>
  </component>
</template>

<script setup lang="ts">
import AppButton from '@/components/core/AppButton.vue';
import type { CarRegistration } from '@/types/car-registration';

const { as = 'div', disabled = false } = defineProps<{
  as: 'div' | 'li';
  registration: CarRegistration;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  edit: [registration: CarRegistration];
}>();
</script>
