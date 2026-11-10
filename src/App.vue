<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <header class="flex items-center justify-between gap-4">
      <h1 class="font-display text-2xl font-bold">Car registrations</h1>
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
    </div>

    <ul v-else class="space-y-3">
      <CarRegistrationListItem
        v-for="registration in registrations"
        :key="registration.id"
        as="li"
        :registration="registration"
      />
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFetch } from '@vueuse/core';
import AppButton from '@/components/core/AppButton.vue';
import CarRegistrationListItem from '@/components/CarRegistration/CarRegistrationListItem.vue';
import CarRegistrationListItemSkeleton from '@/components/CarRegistration/CarRegistrationListItemSkeleton.vue';
import type { CarRegistration } from '@/types/car-registration';

const LOADING_SKELETON_COUNT = 3 as const;

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const {
  data: registrationData,
  isFetching: isLoading,
  error,
  execute: loadRegistrations,
} = useFetch(`${apiUrl}/carRegistrations`).get().json<CarRegistration[]>();
const registrations = computed(() => registrationData.value ?? []);
</script>
