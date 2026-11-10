<template>
  <template v-if="isLoading"> Loading... </template>
  <template v-else>
    <pre>{{ registrations }}</pre>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFetch } from '@vueuse/core';
import type { CarRegistration } from '@/types/car-registration';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const {
  data: registrationData,
  isFetching: isLoading,
  error,
  execute: loadRegistrations,
} = useFetch(`${apiUrl}/carRegistrations`).get().json<CarRegistration[]>();
const registrations = computed(() => registrationData.value ?? []);
</script>
