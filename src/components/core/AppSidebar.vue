<script setup lang="ts">
import { useId, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    closeDisabled?: boolean;
  }>(),
  {
    closeDisabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const titleId = useId();

function requestClose() {
  if (!props.closeDisabled) emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  (isOpen, _, onCleanup) => {
    if (!isOpen || typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeydown);

    onCleanup(() => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeydown);
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex justify-end"
        @click.self="requestClose"
      >
        <div
          class="absolute inset-0 bg-black/40"
          aria-hidden="true"
          @click="requestClose"
        />
        <Transition
          appear
          enter-active-class="transition-transform duration-200"
          enter-from-class="translate-x-full"
          leave-active-class="transition-transform duration-200"
          leave-to-class="translate-x-full"
        >
          <aside
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            class="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-xl"
            @click.stop
          >
            <header class="mb-5 flex items-center justify-between gap-4">
              <h2 :id="titleId" class="font-display text-xl font-bold">
                {{ title }}
              </h2>
              <button
                type="button"
                aria-label="Close"
                :disabled="closeDisabled"
                class="rounded-md p-2 text-ink hover:bg-forest-50 focus-visible:outline-2 focus-visible:outline-forest-700 disabled:cursor-not-allowed disabled:opacity-60"
                @click="requestClose"
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <slot />
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
