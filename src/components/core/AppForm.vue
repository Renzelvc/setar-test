<template>
  <div ref="formFields" class="grid gap-4 sm:grid-cols-2">
    <div v-for="field in fields" :key="field.key">
      <FormLabel :for="`${formId}-${field.key}`" :label="field.label" />
      <FormInput
        v-if="field.type === 'input'"
        :model-value="model[field.key] ?? ''"
        @update:model-value="model[field.key] = $event"
        :id="`${formId}-${field.key}`"
        :name="field.key"
        :required="field.required ?? true"
        :danger="Boolean(errors[field.key])"
        v-bind="field.attrs"
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

const props = withDefaults(
  defineProps<{
    fields: ReadonlyArray<FormField>;
    showErrors?: boolean;
  }>(),
  {
    showErrors: false,
  },
);

const formId = useId();
const errors = computed(() => {
  const fieldErrors: Record<string, string> = {};
  if (!props.showErrors) return fieldErrors;

  for (const field of props.fields) {
    if (!field.schema) continue;
    const result = field.schema.safeParse(model.value[field.key]);
    if (!result.success) {
      const message = result.error.issues[0]?.message;
      if (message) fieldErrors[field.key] = message;
    }
  }

  return fieldErrors;
});

function focusOnFirstError() {
  formFields.value
    ?.querySelector<HTMLElement>('[aria-invalid="true"]')
    ?.focus();
}

defineExpose({ focusOnFirstError });
</script>
