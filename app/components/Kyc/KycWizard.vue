<template>
  <nav class="w-full" aria-label="KYC Progress">
    <!-- Desktop Wizard -->
    <div class="hidden md:flex items-center justify-center gap-4 lg:gap-8">
      <div
        v-for="(step, index) in steps"
        :key="step.key"
        class="flex items-center"
      >
        <button
          :disabled="!canNavigateTo(index + 1)"
          :aria-current="currentStep === index + 1 ? 'step' : undefined"
          :aria-label="`${step.label}: ${getStepStatus(index + 1)}`"
          class="flex flex-col items-center gap-2 transition-all duration-300"
          :class="[
            canNavigateTo(index + 1) ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
            currentStep === index + 1 ? 'opacity-100' : 'opacity-70'
          ]"
          @click="navigateToStep(index + 1)"
        >
          <!-- Step Circle -->
          <div
            class="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 transition-all duration-300"
            :class="getStepCircleClasses(index + 1)"
          >
            <!-- Completed checkmark (for completed steps including when navigating past them) -->
            <svg
              v-if="isStepCompleted(index + 1)"
              class="w-5 h-5"
              :class="isStepCompleted(index + 1) ? 'text-[#14C16E]' : 'text-white'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <!-- Step number (only shown for non-completed steps) -->
            <span
              v-else
              class="text-lg font-bold"
              :class="currentStep === index + 1 ? 'text-[#01051D]' : 'text-[#2F4D94]'"
            >
              {{ index + 1 }}
            </span>
            
            <!-- Active glow effect -->
            <div
              v-if="currentStep === index + 1"
              class="absolute inset-0 rounded-full bg-[#61F0FF] opacity-30 blur-md -z-10"
            />
          </div>
          
          <!-- Step Label -->
          <span
            class="text-xs lg:text-sm font-medium text-center max-w-[80px] lg:max-w-[100px] leading-tight"
            :class="getStepLabelClasses(index + 1)"
          >
            {{ step.label }}
          </span>
        </button>
        
        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          class="w-8 lg:w-16 h-0.5 mx-2 lg:mx-4 transition-all duration-300"
          :class="isStepCompleted(index + 1) ? 'bg-[#4E6DB5]' : 'bg-[#2F4D94]'"
        />
      </div>
    </div>
    
    <!-- Mobile Wizard - Only shows current step -->
    <div class="flex md:hidden flex-col items-center gap-3">
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#61F0FF] bg-[#61F0FF]"
      >
        <span class="text-xl font-bold text-[#01051D]">
          {{ currentStep }}
        </span>
      </div>
      <span class="text-sm font-medium text-white text-center">
        {{ currentStepLabel }}
      </span>
      <!-- Step count removed on mobile per design (was showing interpolated text) -->
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

interface Props {
  currentStep: number
  completedSteps?: number[]
  isCompleted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  completedSteps: () => [],
  isCompleted: false
})

const emit = defineEmits<{
  (e: 'navigate', step: number): void
}>()

const steps = computed(() => [
  { key: 'profile', label: t('kyc.wizard.steps.profile') },
  { key: 'subscription', label: t('kyc.wizard.steps.subscription') },
  { key: 'drivers', label: t('kyc.wizard.steps.drivers') },
  { key: 'payment', label: t('kyc.wizard.steps.payment') },
  { key: 'done', label: t('kyc.wizard.steps.done') }
])

const currentStepLabel = computed(() => {
  return steps.value[props.currentStep - 1]?.label || ''
})

function canNavigateTo(step: number): boolean {
  // Can only go back to completed steps, not forward
  return step < props.currentStep || props.completedSteps.includes(step)
}

function navigateToStep(step: number): void {
  if (canNavigateTo(step)) {
    emit('navigate', step)
  }
}

function isStepCompleted(step: number): boolean {
  return props.completedSteps.includes(step)
}

function getStepCircleClasses(step: number): string[] {
  const classes: string[] = []
  
  if (isStepCompleted(step)) {
    // Completed step - darker background with green check
    classes.push('border-[#2F4D94]', 'bg-[#001751]')
  } else if (step === props.currentStep) {
    // Current step - cyan/blue active color
    classes.push('border-[#61F0FF]', 'bg-[#61F0FF]')
  } else {
    // Future step - dark border, transparent background
    classes.push('border-[#2F4D94]', 'bg-[#001751]')
  }
  
  return classes
}

function getStepLabelClasses(step: number): string[] {
  const classes: string[] = []
  
  if (isStepCompleted(step)) {
    // Completed step - muted color
    classes.push('text-[#2F4D94]')
  } else if (step === props.currentStep) {
    // Current step - highlighted cyan
    classes.push('text-[#61F0FF]')
  } else {
    // Future step - muted color
    classes.push('text-[#2F4D94]')
  }
  
  return classes
}

function getStepStatus(step: number): string {
  if (step < props.currentStep) return t('kyc.wizard.completed')
  if (step === props.currentStep) return t('kyc.wizard.current')
  return t('kyc.wizard.pending')
}
</script>
