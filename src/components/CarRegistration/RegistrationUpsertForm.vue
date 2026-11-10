<template>
  <form
    ref="formElement"
    novalidate
    :aria-busy="isSubmitting"
    @submit.prevent="submit"
  >
    <fieldset :disabled="isSubmitting">
      <legend class="sr-only">
        Registration details — all fields are required
      </legend>
      <AppForm v-model="form" :fields="fields" :show-errors="hasSubmitted" />
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

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import AppButton from '@/components/core/AppButton.vue';
import AppForm from '@/components/core/AppForm.vue';
import {
  carRegistrationSchema,
  type CarRegistrationFormValues,
} from '@/schemas/car-registration';
import type { ZodType } from 'zod';
import type {
  CarRegistration,
  NewCarRegistration,
} from '@/types/car-registration';

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

const fields: ReadonlyArray<{
  key: keyof CarRegistrationFormValues;
  label: string;
  schema: ZodType;
  input?: {
    attrs?: Record<string, unknown>;
  };
}> = [
  { key: 'model', label: 'Model', schema: carRegistrationSchema.shape.model },
  { key: 'brand', label: 'Brand', schema: carRegistrationSchema.shape.brand },
  {
    key: 'type',
    label: 'Vehicle type',
    schema: carRegistrationSchema.shape.type,
  },
  {
    key: 'buildYear',
    label: 'Build year',
    schema: carRegistrationSchema.shape.buildYear,
    input: {
      attrs: {
        type: 'number',
        inputmode: 'numeric',
        min: 1,
        max: new Date().getFullYear(),
        step: 1,
      },
    },
  },
  {
    key: 'registrationNumber',
    label: 'Registration number',
    schema: carRegistrationSchema.shape.registrationNumber,
  },
  {
    key: 'registeredBy',
    label: 'Registered by',
    schema: carRegistrationSchema.shape.registeredBy,
  },
];

async function submit() {
  if (props.isSubmitting) return;

  hasSubmitted.value = true;
  const result = carRegistrationSchema.safeParse(form);

  if (!result.success) {
    await nextTick();
    focusOnFirstInvalidField();

    return;
  }

  emit('submit', result.data);
}

const focusOnFirstInvalidField = () => {
  formElement.value
    ?.querySelector<HTMLElement>('[aria-invalid="true"]')
    ?.focus();
};

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
