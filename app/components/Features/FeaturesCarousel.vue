<template>
  <div class="relative">
    <!-- Slides Container -->
    <div class="overflow-hidden">
      <div 
        ref="slidesContainer"
        class="flex gap-5 transition-transform duration-500 ease-out"
      >
        <FeaturesSlide
          v-for="(slide, index) in slides"
          :key="index"
          :title="slide.title"
          :description="slide.description"
          :image-path="imagePaths[index]"
          :is-active="index === currentSlide"
          class="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[360px] xl:w-[400px]"
        />
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="flex justify-center items-center mt-12">
      <!-- Dots Indicator -->
      <div class="flex gap-[13px]">
        <!-- transition-[width,background-color], not transition-all: the dot
             animates its width between the active and inactive states, so a
             bare transition-colors would kill that, but transition-all also
             animates outline-color — which made the focus ring animate in from
             the UA default `3px solid rgb(0,0,0)` and only reach the 2px
             #61F0FF ring 300ms after Tab. outline-color must stay out. -->
        <button
          v-for="(slide, index) in slides"
          :key="index"
          class="h-[10px] rounded-full transition-[width,background-color] duration-300"
          :class="[
            index === currentSlide 
              ? 'bg-[#FF734D] w-[84px]' 
              : 'bg-[#94A4C2] w-[20px] hover:bg-[#94A4C2]/70'
          ]"
          :aria-label="t('features.aria.showFeature', { feature: slide.title })"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Slide {
  title: string
  description: string
}

interface Props {
  slides: Slide[]
}

const props = defineProps<Props>()

const { t } = useI18n()

// Image paths for each slide based on Figma design
const imagePaths = [
  '/images/features/slide-1-image.webp', // Route Optimization
  '/images/features/slide-2-image.webp', // Real-Time Monitoring
  '/images/features/slide-3-image.webp', // Mobile App
  '/images/features/slide-4-image.webp', // Geofence
]

const currentSlide = ref(0)
const slidesContainer = ref<HTMLElement | null>(null)

// Update scroll position when currentSlide changes
watch(currentSlide, async () => {
  await nextTick()
  updateSlidePosition()
})

const updateSlidePosition = () => {
  const container = slidesContainer.value
  if (!container) return

  const firstSlide = container.querySelector('.flex-shrink-0') as HTMLElement
  if (!firstSlide) return

  const slideWidth = firstSlide.offsetWidth
  const gap = 20 // gap-5 = 20px
  const offset = currentSlide.value * (slideWidth + gap)

  container.style.transform = `translateX(-${offset}px)`
}

const nextSlide = () => {
  if (currentSlide.value < props.slides.length - 1) {
    currentSlide.value++
  } else {
    // Volver al inicio (cíclico)
    currentSlide.value = 0
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    // Ir al final (cíclico)
    currentSlide.value = props.slides.length - 1
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Touch/swipe support
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  
  if (touchStartX - touchEndX > swipeThreshold) {
    nextSlide()
  }
  
  if (touchEndX - touchStartX > swipeThreshold) {
    previousSlide()
  }
}

// Add touch event listeners and handle resize
onMounted(() => {
  const container = slidesContainer.value
  if (container) {
    container.addEventListener('touchstart', handleTouchStart as EventListener)
    container.addEventListener('touchend', handleTouchEnd as EventListener)
  }
  
  // Update position on mount
  updateSlidePosition()
  
  // Handle window resize
  window.addEventListener('resize', updateSlidePosition)
})

onUnmounted(() => {
  const container = slidesContainer.value
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart as EventListener)
    container.removeEventListener('touchend', handleTouchEnd as EventListener)
  }
  
  window.removeEventListener('resize', updateSlidePosition)
})
</script>
