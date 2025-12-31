<template>
  <div
    class="relative flex flex-col p-5 rounded-[10px] border transition-all duration-300 cursor-pointer"
    :class="[
      isSelected 
        ? 'border-[#61F0FF] bg-[#01051D]/80' 
        : 'border-[#94A4C2]/50 bg-[#01051D] hover:border-[#94A4C2]'
    ]"
    role="radio"
    :aria-checked="isSelected"
    :aria-labelledby="`plan-name-${plan.name}`"
    tabindex="0"
    @click="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <!-- Header: Logo and Radio Button -->
    <div class="flex items-start justify-between mb-4">
      <!-- Company Logo Icon -->
      <div class="w-11 h-12">
        <img
          src="/images/kyc/kyc-plan-logo.svg"
          alt="Hermes plan logo"
          class="w-full h-full object-contain"
          width="44"
          height="50"
        >
      </div>

      <!-- Radio Button -->
      <div 
        class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
        :class="isSelected ? 'border-[#61F0FF] bg-[#61F0FF]' : 'border-[#94A4C2]'"
      >
        <div 
          v-if="isSelected"
          class="w-2 h-2 rounded-full bg-[#01051D]"
        />
      </div>
    </div>

    <!-- Plan Name -->
    <h3 
      :id="`plan-name-${plan.name}`"
      class="text-[22px] font-bold leading-tight mb-3"
      :class="planNameColorClass"
    >
      {{ plan.name }}
    </h3>

    <!-- Plan Description -->
    <p class="text-xs text-[#EBF2FF] leading-relaxed mb-4 line-clamp-2">
      {{ plan.description }}
    </p>

    <!-- License Range Badge -->
    <div class="mb-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full border border-[#EBF2FF] text-[11px] text-[#EBF2FF]">
        {{ plan.units }}
      </span>
    </div>

    <!-- Price -->
    <div class="mb-1">
      <span class="text-[32px] font-medium text-[#EBF2FF] leading-tight">
        {{ plan.price }}
      </span>
    </div>

    <!-- Payment Specs -->
    <p class="text-[11px] text-[#EBF2FF]">
      {{ plan.paymentSpecs }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Plan {
  name: string
  units: string
  price: string
  description: string
  paymentSpecs: string
  button: string
  features: string[]
}

interface Props {
  plan: Plan
  isSelected: boolean
  planIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

// Different colors for each plan name based on the Figma design
const planNameColorClass = computed(() => {
  switch (props.planIndex) {
    case 0:
      return 'text-[#EBF2FF]' // Basic - Soft Blue
    case 1:
      return 'text-[#6C8AD0]' // Standard - Deep Blue Shade5
    case 2:
      return 'text-[#FFC152]' // Premium - Light Yellow
    case 3:
      return 'text-[#FF734D]' // Enterprise - Sunset Orange
    default:
      return 'text-[#EBF2FF]'
  }
})

function handleSelect(): void {
  emit('select')
}
</script>
