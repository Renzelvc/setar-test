<script setup lang="ts">
import { useId, watch } from 'vue';
import AppButton from '@/components/core/AppButton.vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    description?: string;
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
      enter-active-class="transition-opacity duration-200 motion-reduce:duration-0"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 motion-reduce:duration-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex justify-end"
        @click.self="requestClose"
      >
        <div
          class="absolute inset-0 bg-ink/35 backdrop-blur-xs"
          aria-hidden="true"
          @click="requestClose"
        />
        <Transition
          appear
          enter-active-class="transition-transform duration-200 motion-reduce:duration-0"
          enter-from-class="translate-x-full"
          leave-active-class="transition-transform duration-200 motion-reduce:duration-0"
          leave-to-class="translate-x-full"
        >
          <aside
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            class="relative flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-floating"
            @click.stop
          >
            <header class="flex shrink-0 items-start justify-between gap-4 border-b border-forest-200 bg-linear-to-br from-forest-50 to-white p-6 sm:p-8">
              <div>
                <p class="mb-2 text-[10px] font-bold tracking-[0.15em] text-forest-700 uppercase">Vehicle management</p>
                <h2 :id="titleId" class="font-display text-2xl font-bold tracking-tight">{{ title }}</h2>
                <p v-if="description" class="mt-2 text-sm leading-relaxed text-muted">{{ description }}</p>
              </div>
              <AppButton
                aria-label="Close"
                :disabled="closeDisabled"
                class="shrink-0"
                @click="requestClose"
              >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke-linecap="round" /></svg>
              </AppButton>
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8"><slot /></div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
