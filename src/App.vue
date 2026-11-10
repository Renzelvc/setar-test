<template>
  <div class="min-h-screen bg-paper">
    <a href="#main-content" class="sr-only z-50 rounded-lg bg-forest-700 px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
    <header class="border-b border-line bg-white/90">
      <div class="mx-auto flex h-18 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <RouterLink to="/registrations" class="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-700" aria-label="Roadline registrations home">
          <span class="grid size-9 place-items-center rounded-xl bg-forest-700 text-white" aria-hidden="true">
            <svg class="size-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="m5 18 2.5-8a3 3 0 0 1 2.9-2h11.2a3 3 0 0 1 2.9 2l2.5 8M5 18h22v7h-4v-3H9v3H5v-7Zm4-5h14M10 18v.1M22 18v.1" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="font-display text-xl font-extrabold tracking-tight">roadline<span class="text-forest-600">.</span></span>
        </RouterLink>
        <nav aria-label="Primary navigation">
          <RouterLink to="/registrations" class="rounded-lg bg-forest-50 px-3 py-2 text-xs font-semibold text-forest-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700">Vehicle registry</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>
