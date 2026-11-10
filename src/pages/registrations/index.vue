<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <header class="flex items-center justify-between gap-4">
      <h1 class="font-display text-2xl font-bold">Car registrations</h1>
      <AppButton
        v-if="registrations.length > 0"
        theme="forest"
        :disabled="isLoading || isSaving"
        @click="openCreateForm"
      >
        Add registration
      </AppButton>
    </header>

    <div v-if="isLoading" role="status" aria-busy="true">
      <span class="sr-only">Loading registrations…</span>
      <ul class="space-y-3">
        <CarRegistrationListItemSkeleton
          v-for="index in LOADING_SKELETON_COUNT"
          :key="index"
        />
      </ul>
    </div>

    <div v-else-if="error" role="alert">
      <p>Couldn’t load registrations: {{ error }}</p>
      <AppButton class="mt-2" @click="loadRegistrations()">
        Try again
      </AppButton>
    </div>

    <div v-else-if="registrations.length === 0" class="space-y-3">
      <p>No registrations yet.</p>
      <AppButton theme="forest" :disabled="isSaving" @click="openCreateForm">
        Add registration
      </AppButton>
    </div>

    <ul v-else class="space-y-3">
      <li v-for="registration in registrations" :key="registration.id">
        <CarRegistrationListItem
          as="RouterLink"
          :registration="registration"
          :to="{ name: '/registrations/[id]', params: { id: registration.id } }"
        />
      </li>
    </ul>

    <AppSidebar
      v-model="isFormOpen"
      title="Create registration"
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
