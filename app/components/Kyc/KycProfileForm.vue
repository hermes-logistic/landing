<template>
  <form class="w-full max-w-2xl" novalidate @submit.prevent="handleSubmit">
    <!-- Form Header -->
    <div class="mb-8">
      <h2 class="text-2xl lg:text-3xl font-bold text-white mb-2">
        {{ t('kyc.profile.title') }}
      </h2>
      <p class="text-gray-400 text-sm lg:text-base">
        {{ t('kyc.profile.subtitle') }}
      </p>
    </div>

    <!-- Form Fields -->
    <div class="space-y-6">
      <!-- Country and City Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <!-- Country Select -->
        <div class="space-y-2">
          <label for="country" class="block text-sm font-medium text-white">
            {{ t('kyc.profile.fields.country') }}<span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="country"
              v-model="form.country"
              class="w-full px-4 py-3 bg-transparent border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
              :class="errors.country ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
              @change="onCountryChange"
            >
              <option value="" disabled class="bg-[#01051D]">
                {{ t('kyc.profile.placeholders.country') }}
              </option>
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
                class="bg-[#01051D]"
              >
                {{ country.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p v-if="errors.country" class="text-red-500 text-xs mt-1">
            {{ errors.country }}
          </p>
        </div>

        <!-- City Select -->
        <div class="space-y-2">
          <label for="city" class="block text-sm font-medium text-white">
            {{ t('kyc.profile.fields.city') }}<span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="city"
              v-model="form.city"
              :disabled="!form.country"
              class="w-full px-4 py-3 bg-transparent border rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="errors.city ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
            >
              <option value="" disabled class="bg-[#01051D]">
                {{ t('kyc.profile.placeholders.city') }}
              </option>
              <option
                v-for="city in availableCities"
                :key="city"
                :value="city"
                class="bg-[#01051D]"
              >
                {{ city }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p v-if="errors.city" class="text-red-500 text-xs mt-1">
            {{ errors.city }}
          </p>
        </div>
      </div>

      <!-- First Name and Last Name Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <!-- First Name -->
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-medium text-white">
            {{ t('kyc.profile.fields.firstName') }}<span class="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            :placeholder="t('kyc.profile.placeholders.firstName')"
            class="w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
            :class="errors.firstName ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
          >
          <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-medium text-white">
            {{ t('kyc.profile.fields.lastName') }}<span class="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            :placeholder="t('kyc.profile.placeholders.lastName')"
            class="w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
            :class="errors.lastName ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
          >
          <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">
            {{ errors.lastName }}
          </p>
        </div>
      </div>

      <!-- Phone Number -->
      <div class="space-y-2">
        <label for="phone" class="block text-sm font-medium text-white">
          {{ t('kyc.profile.fields.phone') }}<span class="text-red-500">*</span>
        </label>
        <div class="flex gap-2">
          <!-- Country Code -->
          <div class="relative w-28">
            <select
              id="phoneCode"
              v-model="form.phoneCode"
              class="w-full px-3 py-3 bg-transparent border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all hover:border-gray-500"
            >
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.phoneCode"
                class="bg-[#01051D]"
              >
                {{ country.phoneCode }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <!-- Phone Number Input -->
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            :placeholder="t('kyc.profile.placeholders.phone')"
            class="flex-1 px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
            :class="errors.phone ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
          >
        </div>
        <p v-if="errors.phone" class="text-red-500 text-xs mt-1">
          {{ errors.phone }}
        </p>
      </div>

      <!-- Address Line 1 -->
      <div class="space-y-2">
        <label for="address1" class="block text-sm font-medium text-white">
          {{ t('kyc.profile.fields.address1') }}<span class="text-red-500">*</span>
        </label>
        <input
          id="address1"
          v-model="form.address1"
          type="text"
          :placeholder="t('kyc.profile.placeholders.address1')"
          class="w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
          :class="errors.address1 ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'"
        >
        <p v-if="errors.address1" class="text-red-500 text-xs mt-1">
          {{ errors.address1 }}
        </p>
      </div>

      <!-- Address Line 2 (Optional) -->
      <div class="space-y-2">
        <label for="address2" class="block text-sm font-medium text-white">
          {{ t('kyc.profile.fields.address2') }}
        </label>
        <input
          id="address2"
          v-model="form.address2"
          type="text"
          :placeholder="t('kyc.profile.placeholders.address2')"
          class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all hover:border-gray-500"
        >
      </div>

      <!-- Terms and Conditions -->
      <div class="mt-8 p-4 lg:p-6 bg-[#0A1628] rounded-xl border border-gray-700">
        <div class="flex items-start gap-3">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            class="mt-1 w-5 h-5 rounded border-gray-600 bg-transparent text-[#61F0FF] focus:ring-[#61F0FF] focus:ring-offset-0 cursor-pointer"
            :class="errors.acceptTerms ? 'border-red-500' : ''"
          >
          <label for="terms" class="text-sm text-gray-300 leading-relaxed cursor-pointer">
            {{ t('kyc.profile.terms.text') }}
          </label>
        </div>
        <p v-if="errors.acceptTerms" class="text-red-500 text-xs mt-2 ml-8">
          {{ errors.acceptTerms }}
        </p>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-8 flex justify-center">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="group relative inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#61F0FF] to-[#3B82F6] text-[#01051D] font-bold rounded-full hover:shadow-lg hover:shadow-[#61F0FF]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{{ t('kyc.profile.submit') }}</span>
        <svg
          class="w-5 h-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { KycProfileData, KycProfileErrors } from '../../utils/kyc-validation'
import { validateKycProfile } from '../../utils/kyc-validation'
import { Country, City } from 'country-state-city'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'submit', data: KycProfileData): void
}>()

const isSubmitting = ref(false)

const form = reactive<KycProfileData>({
  country: '',
  city: '',
  firstName: '',
  lastName: '',
  phoneCode: '+1',
  phone: '',
  address1: '',
  address2: '',
  acceptTerms: false
})

const errors = reactive<KycProfileErrors>({
  country: '',
  city: '',
  firstName: '',
  lastName: '',
  phone: '',
  address1: '',
  acceptTerms: ''
})

const countries = computed(() => {
  return Country.getAllCountries().map(c => ({
    code: c.isoCode,
    name: c.name,
    phoneCode: c.phonecode.startsWith('+') ? c.phonecode : `+${c.phonecode}`
  }))
})

const availableCities = computed(() => {
  if (!form.country) return []
  const cities = City.getCitiesOfCountry(form.country)
  return cities ? cities.map(c => c.name).sort() : []
})

function onCountryChange(): void {
  // Reset city when country changes
  form.city = ''
  
  // Update phone code based on selected country
  const selectedCountry = Country.getCountryByCode(form.country)
  if (selectedCountry) {
    form.phoneCode = selectedCountry.phonecode.startsWith('+') 
      ? selectedCountry.phonecode 
      : `+${selectedCountry.phonecode}`
  }
}

function clearErrors(): void {
  errors.country = ''
  errors.city = ''
  errors.firstName = ''
  errors.lastName = ''
  errors.phone = ''
  errors.address1 = ''
  errors.acceptTerms = ''
}

function handleSubmit(): void {
  clearErrors()
  
  const validation = validateKycProfile(form, t)
  
  if (!validation.isValid) {
    Object.assign(errors, validation.errors)
    return
  }
  
  isSubmitting.value = true
  emit('submit', { ...form })
}

// Expose for testing
defineExpose({
  form,
  errors,
  handleSubmit,
  clearErrors
})
</script>
