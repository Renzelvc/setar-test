<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="field in fields" :key="field.key">
      <FormLabel :for="`${formId}-${field.key}`" :label="field.label" />
      <FormInput
        :model-value="model[field.key] ?? ''"
        @update:model-value="model[field.key] = $event"
        :id="`${formId}-${field.key}`"
        :name="field.key"
        :required="field.required ?? true"
        :danger="Boolean(errors[field.key])"
        v-bind="field.input?.attrs"
      />
      <FormError
        :id="`${formId}-${field.key}-error`"
        :message="errors[field.key]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import type { ZodType } from 'zod';
import FormError from '@/components/form/FormError.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormLabel from '@/components/form/FormLabel.vue';

const model = defineModel<Record<string, string>>({ required: true });

const props = withDefaults(
  defineProps<{
    fields: ReadonlyArray<{
      key: string;
      label: string;
      required?: boolean;
      schema?: ZodType;
      input?: {
        attrs?: Record<string, unknown>;
      };
    }>;
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
</script>
