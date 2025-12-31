<template>
  <div class="w-full max-w-5xl mx-auto">
    <!-- Legend Section -->
    <div class="mb-8 lg:mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2">
        {{ t('kyc.subscription.title') }}
      </h1>
      <p class="text-base text-[#EBF2FF]">
        {{ t('kyc.subscription.subtitle') }}
      </p>
    </div>

    <!-- Plans Grid -->
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
      role="radiogroup"
      :aria-label="t('kyc.subscription.selectPlan')"
    >
      <template v-for="(plan, index) in plans" :key="plan.name">
        <KycSubscriptionCard
          :plan="plan"
          :plan-index="index"
          :is-selected="selectedPlanIndex === index"
          @select="selectPlan(index)"
        />
        
        <!-- Mobile/Tablet Features: Show inline when selected -->
        <div 
          v-if="selectedPlanIndex === index" 
          class="lg:hidden col-span-1 sm:col-span-2"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0 translate-y-4"
            enter-to-class="opacity-100 max-h-[800px] translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-[800px] translate-y-0"
            leave-to-class="opacity-0 max-h-0 translate-y-4"
          >
            <KycPlanFeatures :features="plan.features" />
          </Transition>
        </div>
      </template>
    </div>

    <!-- Desktop Features Section (shown when a plan is selected) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0 translate-y-4"
      enter-to-class="opacity-100 max-h-[800px] translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[800px] translate-y-0"
      leave-to-class="opacity-0 max-h-0 translate-y-4"
    >
      <div 
        v-if="selectedPlanIndex !== null"
        class="hidden lg:block mb-12"
      >
        <KycPlanFeatures :features="selectedPlanFeatures" />
      </div>
    </Transition>

    <!-- Validation Error -->
    <p 
      v-if="showError && selectedPlanIndex === null"
      class="text-red-400 text-sm mb-4"
      role="alert"
    >
      {{ t('kyc.subscription.validation.planRequired') }}
    </p>

    <!-- Navigation Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Back Button -->
      <button
        type="button"
        class="w-full sm:w-auto order-2 sm:order-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#61F0FF] text-[#61F0FF] font-medium text-sm transition-all duration-200 hover:bg-[#61F0FF]/10"
        @click="handleBack"
      >
        <svg 
          class="w-5 h-5 rotate-180" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <span>{{ t('kyc.subscription.back') }}</span>
      </button>

      <!-- Next Step Button -->
      <button
        type="button"
        class="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#61F0FF] text-[#61F0FF] font-medium text-sm transition-all duration-200 hover:bg-[#61F0FF]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        <span>{{ t('kyc.subscription.nextStep') }}</span>
        <svg 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KycPlanFeatures from './KycPlanFeatures.vue'

const { t } = useI18n()

interface Plan {
  name: string
  units: string
  price: string
  description: string
  paymentSpecs: string
  button: string
  features: string[]
  featureDescriptions?: string[]
}

// Get plans from i18n translations
const plans = computed<Plan[]>(() => {
  const data = t('pricing.plans', { returnObjects: true }) as unknown
  return (data as Plan[]) || []
})

const selectedPlanIndex = ref<number | null>(null)
const showError = ref(false)
const isSubmitting = ref(false)

const selectedPlanFeatures = computed(() => {
  if (selectedPlanIndex.value === null) return []
  const plan = plans.value[selectedPlanIndex.value]
  return plan?.featureDescriptions || plan?.features || []
})

const emit = defineEmits<{
  (e: 'submit', data: { planIndex: number; plan: Plan }): void
  (e: 'back'): void
}>()

function selectPlan(index: number): void {
  selectedPlanIndex.value = index
  showError.value = false
}

function handleBack(): void {
  emit('back')
}

function handleSubmit(): void {
  // Validate that a plan is selected
  if (selectedPlanIndex.value === null) {
    showError.value = true
    return
  }

  const selectedPlan = plans.value[selectedPlanIndex.value]
  
  // Additional safety check
  if (!selectedPlan) {
    showError.value = true
    return
  }

  isSubmitting.value = true
  
  emit('submit', {
    planIndex: selectedPlanIndex.value,
    plan: selectedPlan
  })
  
  // Reset submitting state after a short delay (in real app, this would be handled by parent)
  setTimeout(() => {
    isSubmitting.value = false
  }, 500)
}

// Expose for testing
defineExpose({
  selectedPlanIndex,
  showError,
  selectPlan,
  handleSubmit,
  handleBack
})
</script>
