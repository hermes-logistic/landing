<template>
  <section id="pricing" class="relative py-20 lg:py-32">
    <!-- Background with Ellipses -->
    <PricingBackground />

    <!-- Content Container -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title Section -->
      <PricingTitle />

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <!-- Plan 1: Basic -->
        <div class="h-full w-[295px] h-[779px] mx-[20px]">
          <PricingCard :plan="plans[0]" />
        </div>

        <!-- Plan 2: Standard (Featured) -->
        <div class="h-full w-[295px] h-[779px] mx-[20px]">
          <PricingCard :plan="plans[1]" />
        </div>

        <!-- Plan 3: Premium -->
        <div class="h-full w-[295px] h-[779px] mx-[20px]">
          <PricingCard :plan="plans[2]" />
        </div>

        <!-- Plan 4: Enterprise -->
        <div class="h-full w-[295px] h-[779px] mx-[20px]">
          <PricingCard :plan="plans[3]" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

// Get plans from i18n translations
const plans = computed(() => t('pricing.plans'))
</script>
