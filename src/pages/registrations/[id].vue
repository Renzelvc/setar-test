<template>
  <main id="main-content" class="mx-auto max-w-5xl space-y-7 px-5 py-7 sm:px-8 sm:py-10">
    <RouterLink
      to="/registrations"
      class="inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-700"
    >
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path d="m12 5-7 7 7 7M5 12h14" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      All registrations
    </RouterLink>
    <header class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="mb-2 text-[10px] font-bold tracking-[0.18em] text-forest-700 uppercase">Vehicle management</p>
        <h1 class="font-display text-3xl font-bold tracking-tight">Registration details</h1>
        <p class="mt-2 text-sm text-muted">Vehicle specifications and ownership information.</p>
      </div>
      <div v-if="registration && !isLoading && !error" class="flex flex-wrap gap-2">
        <AppButton
          theme="forest"
          class="inline-flex items-center gap-2"
          :disabled="isDeleting"
          @click="router.push({ name: 'registration-edit', params: { id: route.params.id } })"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="m16 4 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15l-1 6 5-2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Edit registration
        </AppButton>
        <AppButton
          theme="danger"
          class="inline-flex items-center gap-2"
          :disabled="isDeleting"
          @click="deleteRegistration"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5m4-5v5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ isDeleting ? 'Deleting…' : 'Delete' }}
        </AppButton>
      </div>
    </header>

    <div v-if="isLoading" role="status" aria-busy="true" class="overflow-hidden rounded-2xl border border-line bg-white">
      <span class="sr-only">Loading registration…</span>
      <div aria-hidden="true" class="animate-pulse motion-reduce:animate-none">
        <div class="space-y-4 border-b border-line bg-forest-50 p-8">
          <div class="h-3 w-28 rounded bg-forest-200" />
          <div class="h-8 w-56 max-w-full rounded bg-forest-200" />
          <div class="h-4 w-32 rounded bg-forest-100" />
        </div>
        <div class="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div v-for="index in 4" :key="index" class="space-y-3 rounded-xl bg-paper p-4">
            <div class="h-3 w-20 rounded bg-forest-100" />
            <div class="h-5 w-32 rounded bg-forest-200" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="statusCode === 404" role="alert" class="rounded-2xl border border-line bg-white p-8">
      <h2 class="font-display text-lg font-bold">Registration not found</h2>
      <p class="mt-2 text-sm text-muted">This registration could not be found. Return to the list to view the available vehicles.</p>
    </div>

    <div v-else-if="error" role="alert" class="rounded-2xl border border-red-200 bg-white p-8">
      <h2 class="font-display text-lg font-bold">Couldn’t load registration</h2>
      <p class="mt-2 text-sm text-red-700">{{ error }}</p>
      <AppButton class="mt-5" @click="loadRegistration()">Try again</AppButton>
    </div>

    <p v-else-if="isDeleting" role="status" class="rounded-2xl border border-line bg-white p-8 text-sm text-muted">Deleting registration…</p>

    <section
      v-else-if="registration"
      class="overflow-hidden rounded-2xl border border-forest-200 bg-white shadow-card"
      aria-labelledby="vehicle-title"
    >
      <p v-if="deleteError" class="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
        {{ deleteError }}
      </p>
      <div class="border-b border-forest-200 bg-linear-to-br from-forest-50 via-white to-forest-100 px-6 py-7 sm:px-8 sm:py-8">
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div class="flex min-w-0 items-start gap-4 sm:items-center">
            <div class="grid size-14 shrink-0 place-items-center rounded-2xl border border-forest-200 bg-white text-forest-700 shadow-sm" aria-hidden="true">
              <svg class="size-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="mb-1.5 text-[10px] font-bold tracking-[0.15em] text-forest-700 uppercase">Vehicle record</p>
              <h2 id="vehicle-title" class="break-words font-display text-2xl font-bold tracking-tight sm:text-3xl">{{ vehicleName }}</h2>
              <p class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span>{{ registration.buildYear }}</span>
                <span aria-hidden="true">·</span>
                <span class="rounded-md bg-forest-100 px-2 py-0.5 text-xs font-medium text-forest-800">{{ registration.type }}</span>
              </p>
            </div>
          </div>
          <div class="max-w-full self-start rounded-lg border border-forest-300 bg-white px-4 py-3 shadow-sm sm:shrink-0 sm:self-center">
            <p class="mb-1 text-[9px] font-semibold tracking-[0.12em] text-muted uppercase">Registration number</p>
            <p class="break-all font-mono text-lg font-semibold tracking-wider text-ink">{{ registration.registrationNumber }}</p>
          </div>
        </div>
      </div>

      <div class="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-8">
        <section aria-labelledby="specifications-title">
          <h3 id="specifications-title" class="mb-4 text-sm font-semibold">Vehicle specifications</h3>
          <dl class="grid gap-3 sm:grid-cols-2">
            <div v-for="field in vehicleFields" :key="field.key" class="min-w-0 rounded-xl border border-line bg-paper/60 px-4 py-4">
              <dt class="text-xs text-muted">{{ field.label }}</dt>
              <dd class="mt-1.5 break-words text-sm font-semibold">{{ registration[field.key] }}</dd>
            </div>
          </dl>
        </section>

        <aside aria-labelledby="ownership-title" class="min-w-0 rounded-xl border border-line bg-paper/60 p-5">
          <h3 id="ownership-title" class="text-sm font-semibold">Ownership record</h3>
          <div class="my-5 flex items-center gap-3">
            <span aria-hidden="true" class="grid size-10 shrink-0 place-items-center rounded-full bg-forest-200 text-xs font-bold text-forest-800">{{ ownerInitials }}</span>
            <div class="min-w-0">
              <p class="mb-1 text-xs text-muted">Registered by</p>
              <p class="break-words text-sm font-semibold">{{ registration.registeredBy }}</p>
            </div>
          </div>
          <dl class="border-t border-line pt-4">
            <div class="flex items-baseline justify-between gap-3 text-xs">
              <dt class="text-muted">Record ID</dt>
              <dd class="break-all font-mono font-medium">#{{ registration.id }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useFetch } from '@vueuse/core';
import AppButton from '@/components/core/AppButton.vue';
import { deleteCarRegistration } from '@/services/car-registrations';
import type { CarRegistration } from '@/types/car-registration';

const route = useRoute('/registrations/[id]');
const router = useRouter();
const isDeleting = ref(false);
const deleteError = ref<string | null>(null);
const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
const registrationUrl = computed(
  () => `${apiUrl}/carRegistrations/${encodeURIComponent(route.params.id)}`,
);

const {
  data: registration,
  isFetching: isLoading,
  error,
  statusCode,
  execute: loadRegistration,
} = useFetch(registrationUrl, { refetch: true }).get().json<CarRegistration>();

const vehicleName = computed(() => {
  const vehicle = registration.value;
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : '';
});

const ownerInitials = computed(() =>
  registration.value?.registeredBy.trim().split(/\s+/).slice(0, 2)
    .map((name) => name.charAt(0)).join('').toUpperCase() ?? '',
);

const vehicleFields = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'type', label: 'Vehicle type' },
  { key: 'buildYear', label: 'Build year' },
] as const;

async function deleteRegistration() {
  const currentRegistration = registration.value;
  if (!currentRegistration || isDeleting.value) return;

  deleteError.value = null;
  isDeleting.value = true;

  try {
    await deleteCarRegistration(currentRegistration.id);
  } catch (cause) {
    deleteError.value =
      cause instanceof Error
        ? cause.message
        : 'Couldn’t delete the registration. Please try again.';
    isDeleting.value = false;
    return;
  }

  await router.push('/registrations');
}
</script>
