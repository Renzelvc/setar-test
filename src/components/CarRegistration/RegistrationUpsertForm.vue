<script setup lang="ts">
import { computed, nextTick, reactive, ref, useId, watch } from 'vue';
import AppButton from '@/components/core/AppButton.vue';
import {
  carRegistrationSchema,
  type CarRegistrationFormValues,
} from '@/schemas/car-registration';
import type {
  CarRegistration,
  NewCarRegistration,
} from '@/types/car-registration';

const props = withDefaults(
  defineProps<{
    registration?: CarRegistration | null;
    isSubmitting?: boolean;
    submitError?: string | null;
    embedded?: boolean;
  }>(),
  {
    registration: null,
    isSubmitting: false,
    submitError: null,
    embedded: false,
  },
);

const emit = defineEmits<{
  submit: [registration: NewCarRegistration];
  cancel: [];
}>();

const formId = useId();
const formElement = ref<HTMLFormElement | null>(null);
const hasSubmitted = ref(false);
const form = reactive<CarRegistrationFormValues>({
  model: '',
  brand: '',
  type: '',
  buildYear: '',
  registrationNumber: '',
  registeredBy: '',
});

const fields = [
  { name: 'model', label: 'Model' },
  { name: 'brand', label: 'Brand' },
  { name: 'type', label: 'Vehicle type' },
  { name: 'buildYear', label: 'Build year' },
  { name: 'registrationNumber', label: 'Registration number' },
  { name: 'registeredBy', label: 'Registered by' },
] as const;

watch(
  () => props.registration,
  (registration) => {
    Object.assign(form, {
      model: registration?.model ?? '',
      brand: registration?.brand ?? '',
      type: registration?.type ?? '',
      buildYear: registration ? String(registration.buildYear) : '',
      registrationNumber: registration?.registrationNumber ?? '',
      registeredBy: registration?.registeredBy ?? '',
    });
    hasSubmitted.value = false;
  },
  { immediate: true },
);

const errors = computed(() => {
  const messages: Partial<Record<keyof CarRegistrationFormValues, string>> = {};
  if (!hasSubmitted.value) return messages;

  const result = carRegistrationSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof CarRegistrationFormValues;
      messages[field] ??= issue.message;
    }
  }
  return messages;
});

async function submit() {
  if (props.isSubmitting) return;
  hasSubmitted.value = true;
  const result = carRegistrationSchema.safeParse(form);
  if (!result.success) {
    await nextTick();
    formElement.value
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
      ?.focus();
    return;
  }
  emit('submit', result.data);
}
</script>

<template>
  <form
    ref="formElement"
    :class="embedded ? undefined : 'rounded-xl border border-line bg-white p-6'"
    novalidate
    :aria-busy="isSubmitting"
    @submit.prevent="submit"
  >
    <h2 v-if="!embedded" class="mb-5 font-display text-xl font-bold">
      {{ registration ? 'Edit registration' : 'Create registration' }}
    </h2>
    <fieldset :disabled="isSubmitting" class="grid gap-4 sm:grid-cols-2">
      <legend class="sr-only">
        Registration details — all fields are required
      </legend>
      <div v-for="field in fields" :key="field.name">
        <label
          :for="`${formId}-${field.name}`"
          class="mb-1 block text-sm font-medium"
          >{{ field.label }}</label
        >
        <input
          :id="`${formId}-${field.name}`"
          v-model="form[field.name]"
          :name="field.name"
          type="text"
          :inputmode="field.name === 'buildYear' ? 'numeric' : undefined"
          required
          :aria-invalid="Boolean(errors[field.name])"
          :aria-describedby="
            errors[field.name] ? `${formId}-${field.name}-error` : undefined
          "
          class="w-full rounded-md border border-forest-300 px-3 py-2 outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-200 aria-invalid:border-red-600 disabled:opacity-60"
        />
        <p
          v-if="errors[field.name]"
          :id="`${formId}-${field.name}-error`"
          class="mt-1 text-sm text-red-700"
        >
          {{ errors[field.name] }}
        </p>
      </div>
    </fieldset>
    <p v-if="submitError" class="mt-4 text-sm text-red-700" role="alert">
      {{ submitError }}
    </p>
    <div class="mt-6 flex gap-3">
      <AppButton type="submit" theme="forest" :disabled="isSubmitting">
        {{
          isSubmitting
            ? 'Saving…'
            : registration
              ? 'Save changes'
              : 'Create registration'
        }}
      </AppButton>
      <AppButton :disabled="isSubmitting" @click="emit('cancel')"
        >Cancel</AppButton
      >
    </div>
  </form>
</template>
