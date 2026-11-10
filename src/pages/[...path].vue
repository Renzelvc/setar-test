<template>
  <main id="main-content" class="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
    <section class="mx-auto max-w-xl overflow-hidden rounded-2xl border border-forest-200 bg-white text-center shadow-card" aria-labelledby="not-found-title">
      <div class="border-b border-forest-200 bg-linear-to-br from-forest-50 via-white to-forest-100 px-6 py-10" aria-hidden="true">
        <p class="font-display text-8xl font-extrabold tracking-tight text-forest-300">404</p>
      </div>
      <div class="px-6 py-9 sm:px-10">
        <p class="mb-2 text-[10px] font-bold tracking-[0.18em] text-forest-700 uppercase">Page not found</p>
        <h1 id="not-found-title" class="font-display text-2xl font-bold tracking-tight">We couldn’t find that page</h1>
        <p class="mt-3 text-sm leading-relaxed text-muted">The link may be outdated, or the address may be incorrect. Your vehicle registry is a click away.</p>
        <AppButton theme="forest" class="mt-6" @click="router.push('/registrations')">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Back to registrations
        </AppButton>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppButton from '@/components/core/AppButton.vue';

const router = useRouter();
</script>
