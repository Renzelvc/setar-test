<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <RouterLink
      :to="detailsRoute"
      class="inline-block text-sm text-forest-700 underline"
    >
      ← Back to registration
    </RouterLink>
    <h1 class="font-display text-2xl font-bold">Edit registration</h1>

    <p v-if="isLoading" role="status">Loading registration…</p>
    <div v-else-if="statusCode === 404" role="alert">
      <p>This registration could not be found.</p>
    </div>
    <div v-else-if="error" role="alert">
      <p>Couldn’t load registration: {{ error }}</p>
      <AppButton class="mt-2" @click="loadRegistration()">Try again</AppButton>
    </div>
    <section
      v-else-if="registration"
      class="rounded-lg border border-line bg-white p-6"
    >
      <p class="mb-5 text-sm text-muted">
        Editing {{ registration.registrationNumber }}
      </p>
      <RegistrationUpsertForm
        :registration="registration"
        :is-submitting="isSaving"
        :submit-error="saveError"
        @submit="saveRegistration"
        @cancel="returnToDetails"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import {
  RouterLink,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from 'vue-router';
import { useFetch } from '@vueuse/core';
import AppButton from '@/components/core/AppButton.vue';
import RegistrationUpsertForm from '@/components/CarRegistration/RegistrationUpsertForm.vue';
import type {
  CarRegistration,
  NewCarRegistration,
} from '@/types/car-registration';

definePage({ name: 'registration-edit' });

const route = useRoute('registration-edit');
const router = useRouter();
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(
  /\/+$/, '',
);
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

const saveError = ref<string | null>(null);
const payload = shallowRef<NewCarRegistration | null>(null);

const {
  data: updatedRegistration,
  isFetching: isSaving,
  execute: executeUpdate,
} = useFetch(registrationUrl, { immediate: false })
  .patch(payload)
  .json<CarRegistration>();

watch(registrationUrl, () => {
  saveError.value = null;
});
onBeforeRouteLeave(() => !isSaving.value);
onBeforeRouteUpdate(() => !isSaving.value);

function returnToDetails() {
  if (!isSaving.value) void router.push(detailsRoute.value);
}

async function saveRegistration(values: NewCarRegistration) {
  if (isSaving.value || isLoading.value || !registration.value || error.value)
    return;
  saveError.value = null;
  payload.value = values;

  try {
    await executeUpdate(true);
    const saved = updatedRegistration.value;
    if (!saved || saved.id == null) {
      throw new Error(
        'The API did not return the updated registration with an ID.',
      );
    }
    await router.push({
      name: '/registrations/[id]',
      params: { id: saved.id },
    });
  } catch (cause) {
    saveError.value =
      cause instanceof Error
        ? cause.message
        : 'Couldn’t save the registration. Please try again.';
  }
}
</script>
