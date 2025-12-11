<template>
  <div
    class="relative h-full rounded-[10px] p-8 transition-all duration-300 scale-105 hover:scale-110 shadow-2xl"
    style="
      background: linear-gradient(0deg, rgba(255, 115, 77, 0.58) 0%, rgba(1, 5, 29, 0.46) 100%);
      border: 1.5px solid;
      border-image-source: linear-gradient(180deg, rgba(183, 205, 245, 1) 0%, rgba(0, 0, 0, 0) 100%);
      backdrop-filter: blur(30px);
    "
  >
    <!-- Popular Badge (optional) -->
    <div 
      class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-[#FF734D] to-[#FF9A7A] shadow-lg"
    >
      <span class="font-poppins font-bold text-sm text-white uppercase tracking-wide">
        Most Popular
      </span>
    </div>
    
    <!-- Plan Name -->
    <h3 class="font-poppins font-semibold text-lg leading-[1.5] tracking-[0.01em] text-[#EBF2FF] mb-3 mt-4">
      {{ plan.name }}
    </h3>
    
    <!-- Description -->
    <p class="font-poppins font-normal text-sm leading-[1.5] tracking-[0.01em] text-[#EBF2FF] mb-8">
      {{ plan.description }}
    </p>
    
    <!-- Pricing Group -->
    <div class="mb-8">
      <!-- Price -->
      <div class="mb-4">
        <span class="font-poppins font-semibold text-[35px] leading-[1.5] text-[#EBF2FF]">
          {{ plan.price }}
        </span>
      </div>
      
      <!-- Units Badge -->
      <div class="inline-flex items-center justify-center px-4 py-1.5 rounded-[5px] bg-[rgba(183,205,245,0.29)] mb-2">
        <span class="font-poppins font-semibold text-base leading-[1.5] tracking-[0.01em] text-white">
          {{ plan.units }}
        </span>
      </div>
      
      <!-- Payment Specs -->
      <p class="font-poppins font-semibold text-sm leading-[1.5] tracking-[0.01em] text-[#EBF2FF]">
        {{ plan.paymentSpecs }}
      </p>
    </div>
    
    <!-- CTA Button - Featured Style (solid cyan) -->
    <button
      class="w-full rounded-[30px] py-3.5 px-6 mb-8 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      style="
        background: #61F0FF;
        border: 1.5px solid #61F0FF;
      "
    >
      <span class="font-poppins font-bold text-base leading-[1.5] tracking-[0.01em] text-[#01051D]">
        {{ plan.button }}
      </span>
    </button>
    
    <!-- Divider -->
    <div class="w-full h-px bg-[#94A4C2] mb-8" />
    
    <!-- Features List -->
    <ul class="space-y-6">
      <li
        v-for="(feature, index) in plan.features"
        :key="index"
        class="flex items-start gap-4"
      >
        <!-- Checkmark Icon -->
        <svg
          class="flex-shrink-0 mt-1"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 4L4.5 7L11 1"
            stroke="#61F0FF"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        
        <!-- Feature Text -->
        <span class="font-poppins font-semibold text-sm leading-[1.5] tracking-[-0.02em] text-[#EBF2FF]">
          {{ feature }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Plan {
  name: string
  units: string
  price: string
  description: string
  paymentSpecs: string
  button: string
  features: string[]
}

defineProps<{
  plan: Plan
}>()
</script>
