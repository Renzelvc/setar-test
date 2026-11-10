<template>
  <component
    :is="as"
    :to="to"
    class="group flex h-28 items-center gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-forest-300 hover:bg-forest-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:gap-4"
  >
    <span aria-hidden="true" class="hidden size-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700 transition-colors group-hover:bg-forest-100 sm:grid">
      <svg class="size-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <div class="min-w-0 flex-1">
      <h3 class="truncate font-display text-sm font-bold sm:text-base">
        {{ vehicleName }}
      </h3>
      <p class="mt-1 truncate text-xs text-muted">
        <span class="sm:hidden">{{ registration.registrationNumber }} · </span>{{ registration.buildYear }} ·
        {{ registration.type }}
      </p>
      <p class="mt-1 truncate text-xs text-muted">
        Registered by {{ registration.registeredBy }}
      </p>
    </div>
    <span class="hidden shrink-0 rounded-lg border border-forest-200 bg-paper/70 px-3 py-2 font-mono text-xs font-semibold tracking-wide sm:block">{{ registration.registrationNumber }}</span>
    <span aria-hidden="true" class="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors group-hover:bg-forest-100 group-hover:text-forest-700">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
  </component>
</template>

<script setup lang="ts">
import type { CarRegistration } from '@/types/car-registration';
import type { RouterLinkProps } from 'vue-router';
import { computed } from 'vue';

const { as = 'div', registration } = defineProps<{
  as?: 'div' | 'li' | 'RouterLink';
  registration: CarRegistration;
  to?: RouterLinkProps['to'];
}>();

const vehicleName = computed(() => `${registration.brand} ${registration.model}`);
</script>
