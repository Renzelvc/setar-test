<template>
  <div
    ref="formFields"
    class="grid gap-x-5 gap-y-5 sm:grid-cols-2"
    @focusout="validateFieldOnBlur"
  >
    <div v-for="field in fields" :key="field.key">
      <FormLabel :for="`${formId}-${field.key}`" :label="field.label" :required="field.required ?? true" />
      <FormInput
        v-if="field.type === 'input'"
        :model-value="model[field.key] ?? ''"
        @update:model-value="model[field.key] = $event"
        :id="`${formId}-${field.key}`"
        :name="field.key"
        :placeholder="field.placeholder"
        :required="field.required ?? true"
        :danger="Boolean(errors[field.key])"
        v-bind="{
          ...field.attrs,
          'aria-invalid': Boolean(errors[field.key]),
          'aria-describedby': errors[field.key]
            ? `${formId}-${field.key}-error`
            : undefined,
        }"
      />
      <FormError
        :id="`${formId}-${field.key}-error`"
        :message="errors[field.key]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import FormError from '@/components/form/FormError.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormLabel from '@/components/form/FormLabel.vue';
import type { FormField } from '@/types/form-field';

const model = defineModel<Record<string, string>>({ required: true });
const formFields = ref<HTMLDivElement | null>(null);
const touchedFields = ref(new Set<string>());

const props = withDefaults(
  defineProps<{
    fields: ReadonlyArray<FormField>;
    validateAllFields?: boolean;
  }>(),
  {
    validateAllFields: false,
  },
);

const formId = useId();

const errors = computed(() => {
  const fieldErrors: Record<string, string> = {};

  for (const field of props.fields) {
    if (!props.validateAllFields && !touchedFields.value.has(field.key))
      continue;
    if (!field.schema) continue;

    const result = field.schema.safeParse(model.value[field.key]);
    if (!result.success) {
      const message = result.error.issues[0]?.message;
      if (message) fieldErrors[field.key] = message;
    }
  }

  return fieldErrors;
});

function validateFieldOnBlur(event: FocusEvent) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const field = props.fields.find((item) => item.key === target.name);
  if (!field) return;

  touchedFields.value = new Set(touchedFields.value).add(field.key);
}

function focusOnFirstError() {
  formFields.value
    ?.querySelector<HTMLElement>('[aria-invalid="true"]')
    ?.focus();
}

defineExpose({ focusOnFirstError });
</script>
