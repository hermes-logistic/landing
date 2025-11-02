<template>
  <div
    class="relative h-full rounded-[10px] p-8 transition-all duration-300 hover:scale-105 group"
    style="
      background: rgba(1, 5, 29, 0.2);
      border: 1.5px solid;
      border-image-source: linear-gradient(180deg, rgba(183, 205, 245, 1) 0%, rgba(0, 0, 0, 0) 100%);
      backdrop-filter: blur(30px);
    "
  >
    <!-- Hover Gradient Background -->
    <div
      class="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style="background: linear-gradient(0deg, rgba(255, 115, 77, 0.58) 0%, rgba(1, 5, 29, 0.46) 100%)"
    />

    <!-- Content Container (ensures content is above gradient) -->
    <div class="relative z-10">
      <!-- Plan Name -->
      <h3 class="font-poppins font-semibold text-lg leading-[1.5] tracking-[0.01em] text-[#EBF2FF] mb-3">
        {{ plan.name }}
      </h3>

      <!-- Description -->
      <p class="font-poppins font-normal text-sm leading-[1.5] tracking-[0.01em] text-[#EBF2FF] mb-8">
        {{ plan.description }}
      </p>

      <!-- Pricing Group -->
      <div class="mb-8 flex items-center justify-between">
      <!-- Price -->
      <span class="font-poppins font-semibold text-[35px] leading-[1.5] text-[#EBF2FF]">
        {{ plan.price }}
      </span>

      <!-- Units Badge -->
      <div class="inline-flex items-center justify-center px-4 py-1.5 rounded-[5px] bg-[rgba(183,205,245,0.29)]">
        <span class="font-poppins font-semibold text-base leading-[1.5] tracking-[0.01em] text-white">
          {{ plan.units }}
        </span>
      </div>
    </div>

    <!-- CTA Button -->
    <button
      class="w-full rounded-[30px] py-3.5 px-6 mb-8 transition-all duration-300 hover:scale-105"
      style="
        background: rgba(183, 205, 245, 0.15);
        border: 1.5px solid #61F0FF;
      "
    >
      <span class="font-poppins font-bold text-base leading-[1.5] tracking-[0.01em] text-[#61F0FF]">
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
