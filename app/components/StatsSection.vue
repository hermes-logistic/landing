<template>
  <div>
    <!-- Stats Section -->
    <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto bg-[#01051D]/50 backdrop-blur-[30px] rounded-xl py-10 px-[60px] shadow-[0px_60px_80px_0px_rgba(0,0,0,0.25)] border border-[#B7CDF5]/20">
      <!-- Stat 1: Fuel Savings -->
      <div>
        <img src="/images/icons/fuel-icon.svg" alt="Fuel icon" class="w-[27px] h-[32px] mb-4">
        <div class="w-full h-0.5 bg-gradient-to-r from-[#B7CDF5] to-transparent my-[15px]" />
        <p class="flex">
          <span class="text-[35px] pr-4 font-semibold leading-[1.5em] tracking-[0.01em] text-[#EBF2FF]">10%</span>
          <span class="text-sm font-normal leading-[1.5em] tracking-[0.05em] uppercase text-[#EBF2FF] text-justify">{{ t('stats.fuelSavings') }}</span>
        </p>
      </div>

      <!-- Stat 2: Savings in Work Hours -->
      <div>
        <img src="/images/icons/clock-icon.svg" alt="Clock icon" class="w-[30px] h-[30px] mb-4">
        <div class="w-full h-0.5 bg-gradient-to-r from-[#B7CDF5] to-transparent my-[15px]" />
        <p class="flex">
          <span class="text-[35px] pr-4 font-semibold leading-[1.5em] tracking-[0.01em] text-[#EBF2FF]">20%</span>
          <span class="text-sm font-normal leading-[1.5em] tracking-[0.05em] uppercase text-[#EBF2FF] text-justify" v-html="t('stats.savingsWorkHours')">
          </span>
        </p>
      </div>

      <!-- Stat 3: Cost Production from Error Delays -->
      <div>
        <img src="/images/icons/puzzle-icon.svg" alt="Puzzle icon" class="w-[27px] h-[30px] mb-4">
        <div class="w-full h-0.5 bg-gradient-to-r from-[#B7CDF5] to-transparent my-[15px]" />
        <p class="flex">
          <span class="text-[35px] pr-4 font-semibold leading-[1.5em] tracking-[0.01em] text-[#EBF2FF]">40%</span>
          <span class="text-sm font-normal leading-[1.5em] tracking-[0.05em] uppercase text-[#EBF2FF] text-justify" v-html="t('stats.costProductionErrorDelays')">
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>