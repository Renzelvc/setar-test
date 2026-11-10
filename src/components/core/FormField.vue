<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium">
      {{ label }}
    </label>
    <AppInput
      :id="id"
      v-model="model"
      :name="name"
      :type="type"
      :inputmode="inputmode"
      :required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
    />
    <p v-if="error" :id="errorId" class="mt-1 text-sm text-red-700">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppInput from '@/components/core/AppInput.vue';

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    type?: string;
    inputmode?:
      | 'none'
      | 'text'
      | 'tel'
      | 'url'
      | 'email'
      | 'numeric'
      | 'decimal'
      | 'search';
  }>(),
  {
    error: '',
    required: false,
    type: 'text',
    inputmode: undefined,
  },
);

const model = defineModel<string>({ required: true });
const errorId = computed(() => `${props.id}-error`);
</script>
