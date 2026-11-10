<template>
  <main id="main-content" class="mx-auto max-w-5xl space-y-7 px-5 py-7 sm:px-8 sm:py-10">
    <header class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="mb-2 text-[10px] font-bold tracking-[0.18em] text-forest-700 uppercase">Vehicle management</p>
        <h1 class="font-display text-3xl font-bold tracking-tight">Car registrations</h1>
        <p class="mt-2 text-sm text-muted">Your vehicles, registration details, and ownership records.</p>
      </div>
      <AppButton
        v-if="registrations.length > 0"
        theme="forest"
        :disabled="isLoading || isSaving"
        @click="openCreateForm"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
        Add registration
      </AppButton>
    </header>

    <section class="overflow-hidden rounded-2xl border border-forest-200 bg-white shadow-card" aria-labelledby="registry-title">
      <header class="flex items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
        <div class="flex items-center gap-3">
          <span aria-hidden="true" class="grid size-10 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700">
            <svg class="size-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div>
            <h2 id="registry-title" class="text-sm font-semibold">All vehicles</h2>
            <p class="mt-1 text-xs text-muted">Registration and ownership records</p>
          </div>
        </div>
        <span v-if="!error" class="shrink-0 rounded-lg border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-800">
          {{ isLoading ? 'Loading…' : `${registrations.length} ${registrations.length === 1 ? 'vehicle' : 'vehicles'}` }}
        </span>
      </header>

    <div v-if="isLoading" role="status" aria-busy="true" class="bg-paper/40 p-4 sm:p-5">
      <span class="sr-only">Loading registrations…</span>
      <ul class="space-y-3">
        <CarRegistrationListItemSkeleton
          v-for="index in LOADING_SKELETON_COUNT"
          :key="index"
        />
      </ul>
    </div>

    <div v-else-if="error" role="alert" class="px-6 py-12 text-center">
      <span aria-hidden="true" class="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-red-50 text-red-700">
        <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 8v5m0 3v.1M10.3 4.5 2.8 18a1.5 1.5 0 0 0 1.3 2h15.8a1.5 1.5 0 0 0 1.3-2L13.7 4.5a2 2 0 0 0-3.4 0Z" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <h3 class="font-display text-lg font-bold">Couldn’t load your vehicles</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{{ error }}</p>
      <AppButton class="mt-5" @click="loadRegistrations()">
        Try again
      </AppButton>
    </div>

    <div v-else-if="registrations.length === 0" class="px-6 py-14 text-center sm:py-20">
      <span aria-hidden="true" class="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border border-forest-200 bg-forest-50 text-forest-700">
        <svg class="size-9" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <h3 class="font-display text-xl font-bold">No registrations yet</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">Add your first vehicle to keep its registration and ownership details in one place.</p>
      <AppButton theme="forest" class="mt-6" :disabled="isSaving" @click="openCreateForm">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
        Add registration
      </AppButton>
    </div>

    <ul v-else class="space-y-3 bg-paper/40 p-4 sm:p-5">
      <li v-for="registration in registrations" :key="registration.id">
        <CarRegistrationListItem
          as="RouterLink"
          :registration="registration"
          :to="{ name: '/registrations/[id]', params: { id: registration.id } }"
        />
      </li>
    </ul>
      <footer v-if="!isLoading && !error && registrations.length" class="flex flex-wrap justify-between gap-2 border-t border-line px-6 py-3.5 text-xs text-muted">
        <p>{{ registrations.length }} {{ registrations.length === 1 ? 'registration' : 'registrations' }} on record</p>
        <p class="hidden sm:block">Select a vehicle to view details</p>
      </footer>
    </section>

    <AppSidebar
      v-model="isFormOpen"
      title="Create registration"
      description="Add a vehicle and its registration details to your registry."
      :close-disabled="isSaving"
    >
      <RegistrationUpsertForm
        :is-submitting="isSaving"
        :submit-error="saveError"
        @submit="createRegistration"
        @cancel="isFormOpen = false"
      />
    </AppSidebar>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useFetch } from '@vueuse/core';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import AppButton from '@/components/core/AppButton.vue';
import AppSidebar from '@/components/core/AppSidebar.vue';
import RegistrationUpsertForm from '@/components/CarRegistration/RegistrationUpsertForm.vue';
import CarRegistrationListItem from '@/components/CarRegistration/CarRegistrationListItem.vue';
import CarRegistrationListItemSkeleton from '@/components/CarRegistration/CarRegistrationListItemSkeleton.vue';
import type {
  CarRegistration,
  NewCarRegistration,
} from '@/types/car-registration';

const LOADING_SKELETON_COUNT = 3 as const;
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const {
  data: registrationData,
  isFetching: isLoading,
  error,
  execute: loadRegistrations,
} = useFetch(`${apiUrl}/carRegistrations`).get().json<CarRegistration[]>();
const registrations = computed(() => registrationData.value ?? []);

const isFormOpen = ref(false);
const saveError = ref<string | null>(null);
const payload = shallowRef<NewCarRegistration | null>(null);
const {
  data: createdRegistration,
  isFetching: isSaving,
  execute: executeCreate,
} = useFetch(`${apiUrl}/carRegistrations`, { immediate: false })
  .post(payload)
  .json<CarRegistration>();

onBeforeRouteLeave(() => !isSaving.value);

function openCreateForm() {
  if (isLoading.value || isSaving.value) return;
  saveError.value = null;
  isFormOpen.value = true;
}

async function createRegistration(values: NewCarRegistration) {
  if (!isFormOpen.value || isSaving.value) return;
  saveError.value = null;
  payload.value = values;

  try {
    await executeCreate(true);
    const saved = createdRegistration.value;
    if (!saved || saved.id == null)
      throw new Error('The API did not return the saved registration with an ID.');

    registrationData.value = [...registrations.value, saved];
    isFormOpen.value = false;
    await router.push({ name: '/registrations/[id]', params: { id: saved.id } });
  } catch (cause) {
    saveError.value =
      cause instanceof Error
        ? cause.message
        : 'Couldn’t create the registration. Please try again.';
  }
}
</script>
