<template>
  <component
    :is="as"
    :to="to"
    class="flex h-28 items-center gap-4 rounded-lg border border-line bg-white p-4 transition-colors hover:bg-forest-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
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
  </component>
</template>

<script setup lang="ts">
import type { CarRegistration } from '@/types/car-registration';
import type { RouterLinkProps } from 'vue-router';

const { as = 'div' } = defineProps<{
  as?: 'div' | 'li' | 'RouterLink';
  registration: CarRegistration;
  to?: RouterLinkProps['to'];
}>();
</script>
