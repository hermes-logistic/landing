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
        <div
          v-for="(plan, idx) in plans"
          :key="idx"
          class="h-full w-[295px] h-[779px] mx-[20px]"
        >
          <PricingCard :plan="plan" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

// Local type matching `PricingCard.vue`
interface Plan {
  name: string
  units: string
  price: string
  description: string
  paymentSpecs: string
  button: string
  features: string[]
}

// Get plans from i18n translations (ensure array return)
const plans = computed<Plan[]>(() => {
  const data = t('pricing.plans', { returnObjects: true }) as unknown
  return (data as Plan[]) || []
})
</script>
