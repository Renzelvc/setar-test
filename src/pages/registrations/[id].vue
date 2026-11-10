<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <RouterLink
      to="/registrations"
      class="inline-block text-sm text-forest-700 underline"
    >
      ← Back to registrations
    </RouterLink>
    <header class="flex items-center justify-between gap-4">
      <h1 class="font-display text-2xl font-bold">Registration details</h1>
      <div v-if="registration && !isLoading && !error" class="flex gap-2">
        <AppButton
          theme="forest"
          :disabled="isDeleting"
          @click="router.push({ name: 'registration-edit', params: { id: route.params.id } })"
        >
          Edit registration
        </AppButton>
        <AppButton
          theme="danger"
          :disabled="isDeleting"
          @click="deleteRegistration"
        >
          {{ isDeleting ? 'Deleting…' : 'Delete registration' }}
        </AppButton>
      </div>
    </header>

    <p v-if="isLoading" role="status">Loading registration…</p>

    <div v-else-if="statusCode === 404" role="alert">
      <p>This registration could not be found.</p>
    </div>

    <div v-else-if="error" role="alert">
      <p>Couldn’t load registration: {{ error }}</p>
      <AppButton class="mt-2" @click="loadRegistration()">Try again</AppButton>
    </div>

    <p v-else-if="isDeleting" role="status">Deleting registration…</p>

    <section
      v-else-if="registration"
      class="rounded-lg border border-line bg-white p-6"
      aria-labelledby="vehicle-title"
    >
      <p v-if="deleteError" class="mb-4 text-sm text-red-700" role="alert">
        {{ deleteError }}
      </p>
      <h2 id="vehicle-title" class="mb-6 font-display text-xl font-bold">
        {{ vehicleName }}
      </h2>
      <dl class="grid gap-5 sm:grid-cols-2">
        <div v-for="field in fields" :key="field.key" class="min-w-0">
          <dt class="text-sm text-muted">{{ field.label }}</dt>
          <dd class="mt-1 break-words font-medium">
            {{ registration[field.key] }}
          </dd>
        </div>
      </dl>
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

const fields = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'type', label: 'Vehicle type' },
  { key: 'buildYear', label: 'Build year' },
  { key: 'registrationNumber', label: 'Registration number' },
  { key: 'registeredBy', label: 'Registered by' },
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
