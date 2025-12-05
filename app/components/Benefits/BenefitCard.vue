<template>
  <div class="relative group">
    <div class="flex flex-col h-full">
  <!-- Icon -->
      <div 
        class="w-[50px] h-[50px] rounded-lg flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110"
        :class="iconBgClasses"
      >
        <component :is="iconComponent" class="w-[38px] h-[38px] text-[#01051D]" />
      </div>
      
  <!-- Title -->
      <h3 class="text-base font-bold text-[#EBF2FF] mb-4 leading-normal tracking-[0.01em]">
        {{ title }}
      </h3>
      
  <!-- Description -->
      <p class="text-base text-[#EBF2FF] leading-relaxed tracking-[0.01em]">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

// Iconos SVG como componentes funcionales
const PiggyBankIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', {
    d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  })
])

const LineChartIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', {
    d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  })
])

const FaceHappyIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', {
    d: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const ClockIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', {
    d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const PuzzleIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', {
    d: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
  })
])

interface Props {
  title: string
  description: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

// Mapeo de variantes a estilos (solo iconos de fondo)
const variantStyles = {
  primary: {
    iconBg: 'bg-[#61F0FF]',
    iconComponent: PiggyBankIcon
  },
  secondary: {
    iconBg: 'bg-[#FFC152]',
    iconComponent: LineChartIcon
  },
  tertiary: {
    iconBg: 'bg-[#FF734D]',
    iconComponent: FaceHappyIcon
  },
  quaternary: {
    iconBg: 'bg-[#EBF2FF]',
    iconComponent: ClockIcon
  },
  quinary: {
    iconBg: 'bg-[#4EC1D2]',
    iconComponent: PuzzleIcon
  }
}

const iconBgClasses = computed(() => variantStyles[props.variant].iconBg)
const iconComponent = computed(() => variantStyles[props.variant].iconComponent)
</script>
