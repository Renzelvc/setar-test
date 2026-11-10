<template>
  <form
    ref="formElement"
    novalidate
    :aria-busy="isSubmitting"
    @submit.prevent="submit"
  >
    <div class="mb-6 flex flex-wrap items-baseline justify-between gap-2">
      <h3 class="text-sm font-semibold">Vehicle &amp; registration details</h3>
      <p class="text-xs text-muted">All fields are required</p>
    </div>
    <fieldset :disabled="isSubmitting">
      <legend class="sr-only">Registration details</legend>
      <AppForm
        ref="appForm"
        v-model="form"
        :fields="fields"
        :validate-all-fields="hasSubmitted"
      />
    </fieldset>

    <p
      v-if="submitError"
      class="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      role="alert"
    >
      {{ submitError }}
    </p>
    <div
      class="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end"
    >
      <AppButton :disabled="isSubmitting" @click="emit('cancel')">
        Cancel
      </AppButton>
      <AppButton type="submit" theme="forest" :disabled="isSubmitting">
        <span
          v-if="isSubmitting"
          class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
          aria-hidden="true"
        />
        <svg
          v-else
          class="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path
            d="m5 12 4 4L19 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{
          isSubmitting
            ? 'Saving…'
            : registration
              ? 'Save changes'
              : 'Create registration'
        }}
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import AppButton from '@/components/core/AppButton.vue';
import AppForm from '@/components/core/AppForm.vue';
import {
  carRegistrationSchema,
  type CarRegistrationFormValues,
} from '@/schemas/car-registration';
import type {
  CarRegistration,
  NewCarRegistration,
} from '@/types/car-registration';
import type { FormField } from '@/types/form-field';

const props = withDefaults(
  defineProps<{
    registration?: CarRegistration | null;
    isSubmitting?: boolean;
    submitError?: string | null;
  }>(),
  {
    registration: null,
    isSubmitting: false,
    submitError: null,
  },
);

const emit = defineEmits<{
  submit: [registration: NewCarRegistration];
  cancel: [];
}>();

const appForm = ref<InstanceType<typeof AppForm> | null>(null);
const hasSubmitted = ref(false);

const form = reactive<CarRegistrationFormValues>({
  model: '',
  brand: '',
  type: '',
  buildYear: '',
  registrationNumber: '',
  registeredBy: '',
});

const fields: ReadonlyArray<FormField<keyof CarRegistrationFormValues>> = [
  {
    key: 'model',
    label: 'Model',
    attrs: { placeholder: 'e.g. Corolla' },
    type: 'input',
    schema: carRegistrationSchema.shape.model,
  },
  {
    key: 'brand',
    label: 'Brand',
    attrs: { placeholder: 'e.g. Toyota' },
    type: 'input',
    schema: carRegistrationSchema.shape.brand,
  },
  {
    key: 'type',
    label: 'Vehicle type',
    attrs: { placeholder: 'e.g. Sedan' },
    schema: carRegistrationSchema.shape.type,
    type: 'input',
  },
  {
    key: 'buildYear',
    label: 'Build year',
    placeholder: String(new Date().getFullYear()),
    schema: carRegistrationSchema.shape.buildYear,
    type: 'input',
    attrs: {
      type: 'number',
      placeholder: 'e.g. 2024',
      inputmode: 'numeric',
      min: 1,
      max: new Date().getFullYear(),
      step: 1,
    },
  },
  {
    key: 'registrationNumber',
    label: 'Registration number',
    attrs: { placeholder: 'e.g. ABC-1234' },
    type: 'input',
    schema: carRegistrationSchema.shape.registrationNumber,
  },
  {
    key: 'registeredBy',
    label: 'Registered by',
    attrs: { placeholder: 'Full name' },
    type: 'input',
    schema: carRegistrationSchema.shape.registeredBy,
  },
];

async function submit() {
  if (props.isSubmitting) return;

  hasSubmitted.value = true;
  const result = carRegistrationSchema.safeParse(form);

  if (!result.success) {
    await nextTick();
    appForm.value?.focusOnFirstError();

    return;
  }

  emit('submit', result.data);
}

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
</script>
