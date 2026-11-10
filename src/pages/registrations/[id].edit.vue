<template>
  <main id="main-content" class="mx-auto max-w-5xl space-y-7 px-5 py-7 sm:px-8 sm:py-10">
    <RouterLink :to="detailsRoute" class="inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-700">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
      Back to registration
    </RouterLink>
    <header>
      <p class="mb-2 text-[10px] font-bold tracking-[0.18em] text-forest-700 uppercase">Vehicle management</p>
      <h1 class="font-display text-3xl font-bold tracking-tight">Edit registration</h1>
      <p class="mt-2 text-sm text-muted">Update vehicle details and ownership information.</p>
    </header>

    <div v-if="isLoading" role="status" aria-busy="true" class="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <span class="sr-only">Loading registration…</span>
      <div aria-hidden="true" class="animate-pulse motion-reduce:animate-none">
        <div class="space-y-3 border-b border-line bg-forest-50 p-8">
          <div class="h-3 w-24 rounded bg-forest-200" /><div class="h-6 w-48 max-w-full rounded bg-forest-200" />
        </div>
        <div class="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div v-for="index in 6" :key="index" class="space-y-2">
            <div class="h-3 w-20 rounded bg-forest-100" /><div class="h-11 rounded-lg bg-paper" />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="statusCode === 404" role="alert" class="rounded-2xl border border-line bg-white p-8 shadow-card">
      <h2 class="font-display text-lg font-bold">Registration not found</h2>
      <p class="mt-2 text-sm text-muted">This registration could not be found. Return to the registry to choose another vehicle.</p>
      <AppButton class="mt-5" @click="router.push('/registrations')">Back to registrations</AppButton>
    </div>
    <div v-else-if="error" role="alert" class="rounded-2xl border border-red-200 bg-white p-8 shadow-card">
      <h2 class="font-display text-lg font-bold">Couldn’t load registration</h2>
      <p class="mt-2 text-sm text-red-700">{{ error }}</p>
      <AppButton class="mt-5" @click="loadRegistration()">Try again</AppButton>
    </div>
    <section v-else-if="registration" class="overflow-hidden rounded-2xl border border-forest-200 bg-white shadow-card" aria-labelledby="editing-title">
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-forest-200 bg-linear-to-br from-forest-50 via-white to-forest-100 px-6 py-6 sm:px-8">
        <div class="flex min-w-0 items-center gap-4">
          <span aria-hidden="true" class="grid size-12 shrink-0 place-items-center rounded-xl border border-forest-200 bg-white text-forest-700">
            <svg class="size-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div class="min-w-0">
            <p class="mb-1 text-[10px] font-bold tracking-[0.15em] text-forest-700 uppercase">Editing vehicle</p>
            <h2 id="editing-title" class="break-words font-display text-xl font-bold tracking-tight">{{ vehicleName }}</h2>
          </div>
        </div>
        <span class="max-w-full break-all rounded-lg border border-forest-300 bg-white px-3 py-2 font-mono text-sm font-semibold tracking-wide">{{ registration.registrationNumber }}</span>
      </header>
      <div class="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-8">
        <RegistrationUpsertForm
          :registration="registration"
          :is-submitting="isSaving"
          :submit-error="saveError"
          @submit="saveRegistration"
          @cancel="returnToDetails"
        />
        <aside class="self-start rounded-xl border border-line bg-paper/60 p-5" aria-labelledby="edit-note-title">
          <span aria-hidden="true" class="mb-3 grid size-9 place-items-center rounded-lg bg-forest-100 text-forest-700">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3h8l4 4v14H4V3h4Zm8 0v5h4M8 12h8m-8 4h6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <h3 id="edit-note-title" class="text-sm font-semibold">Updating this record</h3>
          <p class="mt-2 text-xs leading-relaxed text-muted">Select Save changes to update the registration. Cancel returns to the details without saving.</p>
          <p class="mt-4 border-t border-line pt-4 text-xs text-muted">Record <span class="font-mono font-medium text-ink">#{{ registration.id }}</span></p>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { RouterLink, onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useFetch } from '@vueuse/core';
import AppButton from '@/components/core/AppButton.vue';
import RegistrationUpsertForm from '@/components/CarRegistration/RegistrationUpsertForm.vue';
import type { CarRegistration, NewCarRegistration } from '@/types/car-registration';

definePage({ name: 'registration-edit' });

const route = useRoute('registration-edit');
const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
const registrationUrl = computed(
  () => `${apiUrl}/carRegistrations/${encodeURIComponent(route.params.id)}`,
);
const detailsRoute = computed(() => ({
  name: '/registrations/[id]' as const,
  params: { id: route.params.id },
}));

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

const saveError = ref<string | null>(null);
const payload = shallowRef<NewCarRegistration | null>(null);
const {
  data: updatedRegistration,
  isFetching: isSaving,
  execute: executeUpdate,
} = useFetch(registrationUrl, { immediate: false }).patch(payload).json<CarRegistration>();

watch(registrationUrl, () => { saveError.value = null; });
onBeforeRouteLeave(() => !isSaving.value);
onBeforeRouteUpdate(() => !isSaving.value);

function returnToDetails() {
  if (!isSaving.value) void router.push(detailsRoute.value);
}

async function saveRegistration(values: NewCarRegistration) {
  if (isSaving.value || isLoading.value || !registration.value || error.value) return;
  saveError.value = null;
  payload.value = values;

  try {
    await executeUpdate(true);
    const saved = updatedRegistration.value;
    if (!saved || saved.id == null) {
      throw new Error('The API did not return the updated registration with an ID.');
    }
    await router.push({ name: '/registrations/[id]', params: { id: saved.id } });
  } catch (cause) {
    saveError.value = cause instanceof Error
      ? cause.message
      : 'Couldn’t save the registration. Please try again.';
  }
}
</script>
