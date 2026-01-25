<template>
  <div class="w-full">
    <!-- Form Header -->
    <div class="mb-4 lg:mb-5">
      <h2 class="text-2xl lg:text-3xl font-bold text-white mb-2">
        {{ t('kyc.drivers.title') }}
      </h2>
      <p class="text-[#EBF2FF] text-sm lg:text-base mb-2">
        {{ t('kyc.drivers.subtitle') }}
      </p>
      <p class="text-[#EBF2FF] text-xs">
        {{ t('kyc.drivers.description') }}
      </p>
    </div>

    <!-- Driver Number Control -->
    <div class="relative bg-[#01051D] bg-opacity-50 border border-[rgba(148,164,194,0.5)] rounded-lg p-5 lg:p-8 max-w-2xl">
      <!-- Label -->
      <div class="mb-4">
        <label for="numberOfDrivers" class="block text-sm font-normal text-white mb-3">
          {{ t('kyc.drivers.numberOfDriversLabel') }}<span class="text-red-500">*</span>
        </label>

        <!-- Edit Mode: Number Control -->
        <div v-if="!saved" class="flex items-center gap-3">
          <!-- Decrease Button -->
          <button
            type="button"
            class="w-10 h-10 bg-[#6C8AD0] border border-[#C5D1E7] rounded-l-lg flex items-center justify-center text-[#01051D] text-xl font-normal hover:bg-[#5B79BF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#61F0FF]"
            :disabled="numberOfDrivers <= 1"
            :class="{ 'opacity-50 cursor-not-allowed': numberOfDrivers <= 1 }"
            @click="decreaseDrivers"
          >
            <span class="leading-none">-</span>
          </button>

          <!-- Number Input -->
          <input
            id="numberOfDrivers"
            v-model.number="numberOfDrivers"
            type="number"
            min="1"
            max="100"
            class="w-[85px] h-10 px-4 py-2 bg-white border border-[#C5D1E7] text-center text-base font-normal text-[#4F4F4F] focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            @input="validateInput"
            @blur="handleBlur"
          >

          <!-- Increase Button -->
          <button
            type="button"
            class="w-10 h-10 bg-[#6C8AD0] border border-[#C5D1E7] rounded-r-lg flex items-center justify-center text-[#01051D] text-xl font-normal hover:bg-[#5B79BF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#61F0FF]"
            :disabled="numberOfDrivers >= 100"
            :class="{ 'opacity-50 cursor-not-allowed': numberOfDrivers >= 100 }"
            @click="increaseDrivers"
          >
            <span class="leading-none">+</span>
          </button>

          <!-- Save Button -->
          <button
            type="button"
            class="ml-4 px-6 py-2.5 bg-[#61F0FF] text-[#001751] text-sm font-medium rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
            @click="handleSave"
          >
            {{ t('kyc.drivers.save') }}
          </button>
        </div>

        <!-- Saved Mode: Display Value with Edit Button -->
        <div v-else class="flex items-center gap-3">
          <!-- Saved Value Display -->
          <div class="w-[85px] h-10 px-4 py-2 bg-white border border-[#C5D1E7] text-center text-base font-normal text-[#4F4F4F] flex items-center justify-center rounded">
            {{ savedValue }}
          </div>

          <!-- Edit Button -->
          <button
            type="button"
            class="ml-4 px-6 py-2.5 bg-[#FF6B47] text-white text-sm font-medium rounded-full hover:bg-[#E55A38] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B47] focus:ring-offset-2 focus:ring-offset-[#01051D]"
            @click="handleEdit"
          >
            {{ t('kyc.drivers.edit') }}
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-xs mt-2">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validateNumberOfDrivers } from '../../utils/kyc-drivers-validation'

const { t } = useI18n()

const numberOfDrivers = ref<number>(1)
const error = ref<string>('')
const saved = ref<boolean>(false)
const savedValue = ref<number | null>(null)

// Expose methods for parent component to access form data
defineExpose({
  getDriversData: () => ({ numberOfDrivers: savedValue.value || numberOfDrivers.value }),
  isValid: () => !validateNumberOfDrivers(savedValue.value || numberOfDrivers.value),
  isSaved: () => saved.value
})

function decreaseDrivers(): void {
  if (numberOfDrivers.value > 1) {
    numberOfDrivers.value--
    error.value = ''
  }
}

function increaseDrivers(): void {
  if (numberOfDrivers.value < 100) {
    numberOfDrivers.value++
    error.value = ''
  }
}

function validateInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)

  if (isNaN(value) || value < 1) {
    numberOfDrivers.value = 1
  } else if (value > 100) {
    numberOfDrivers.value = 100
  } else {
    numberOfDrivers.value = value
  }

  error.value = ''
}

function handleBlur(): void {
  if (isNaN(numberOfDrivers.value) || numberOfDrivers.value < 1) {
    numberOfDrivers.value = 1
  }
}

function handleSave(): void {
  const validationError = validateNumberOfDrivers(numberOfDrivers.value)

  if (validationError) {
    error.value = validationError.message
    return
  }

  error.value = ''
  saved.value = true
  savedValue.value = numberOfDrivers.value
  // NOTE: We don't emit submit here, only change the visual state
  // The actual submission happens when user navigates to the next step
}

function handleEdit(): void {
  saved.value = false
  error.value = ''
}
</script>
