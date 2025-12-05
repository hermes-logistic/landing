<template>
  <section id="benefits" class="relative py-20 lg:py-32 overflow-hidden" aria-labelledby="benefits-heading">
  <!-- Background with visual effects -->
    <BenefitsBackground />
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Section title -->
      <BenefitsTitle />
      
  <!-- Benefits grid - 3 columns on desktop -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-20">
        <BenefitCard
          v-for="(benefit, index) in benefits"
          :key="index"
          :title="benefit.title"
          :description="benefit.description"
          :variant="getVariant(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BenefitsBackground from './Benefits/BenefitsBackground.vue'
import BenefitsTitle from './Benefits/BenefitsTitle.vue'
import BenefitCard from './Benefits/BenefitCard.vue'

const { t } = useI18n()

// Get benefits from i18n
const benefits = computed(() => t('benefits.items') as Array<{ title: string; description: string }>)

// Function to determine each item's variant according to the Figma design
const getVariant = (index: number): 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' => {
  const variants: Array<'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary'> = [
    'primary',    // Item 1: Cyan (#61F0FF) - Time and Money Savings
    'secondary',  // Item 2: Yellow (#FFC152) - Increased Visibility and Control
    'tertiary',   // Item 3: Orange (#FF734D) - Improved Customer Satisfaction
    'quaternary', // Item 4: Very light blue (#EBF2FF) - Error and Delay Reduction
    'quinary'     // Item 5: Turquoise (#4EC1D2) - Easy Integration with Existing Systems
  ]
  return variants[index % variants.length]
}
</script>

