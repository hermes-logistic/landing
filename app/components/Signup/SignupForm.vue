<template>
  <div class="min-h-screen flex items-center justify-end py-8 px-8">
    <div class="w-full max-w-[662px]">
    <!-- Card Container -->
    <div class="relative bg-[#01051D] rounded-[10px] border border-transparent bg-gradient-to-b from-[#94A4C2] to-[#FF734D] p-[1px]">
      <div class="bg-[#01051D] rounded-[10px] px-6 md:px-12 py-4 md:py-6 shadow-[0px_0px_4px_rgba(235,242,255,0.15)] md:h-[calc(100vh-4rem)] md:flex md:flex-col md:justify-between">
        <!-- Header with Logo -->
        <div class="mb-8 md:mb-12 space-y-6">
          <div class="flex items-start gap-4">
            <!-- Hermes Logo Icon (link to home) -->
            <NuxtLink to="/" aria-label="Home">
              <img 
                src="/images/icons/hermes-logo.svg" 
                alt="Hermes" 
                class="w-[199px] h-10"
              >
            </NuxtLink>
          </div>

          <h1 class="text-[#FFFFFF] text-2xl md:text-4xl lg:text-[40px] font-bold leading-[34px] md:leading-[44px]">
            {{ t('auth.signup.title') }}
          </h1>

          <p class="text-[#FFFFFF] text-sm md:text-sm leading-relaxed max-w-[430px]">
            {{ t('auth.signup.description') }}
          </p>
        </div>

        <!-- Form Section -->
        <div class="space-y-6">
          <h2 class="text-[#C5D1E7] text-2xl font-medium">
            {{ t('auth.signup.heading') }}
          </h2>

          <form class="space-y-3" @submit.prevent="handleSubmit">
            <!-- Email Input -->
            <div class="relative">
              <input
                id="email"
                v-model="formData.email"
                type="email"
                :placeholder="t('auth.signup.email') + '*'"
                :aria-label="t('auth.signup.email')"
                class="w-full px-3 py-2 bg-[#FFFFFF] border rounded-lg text-gray-900 placeholder-[#4F4F4F] text-sm focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.email, 'border-[#C5D1E7]': !errors.email }"
                @blur="validateField('email')"
              >
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password Input -->
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                type="password"
                :placeholder="t('auth.signup.password') + '*'"
                :aria-label="t('auth.signup.password')"
                class="w-full px-3 py-2 bg-[#FFFFFF] border rounded-lg text-gray-900 placeholder-[#4F4F4F] text-sm focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.password, 'border-[#C5D1E7]': !errors.password }"
                @blur="validateField('password')"
              >
              <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Forgot Password Link -->
            <!-- submit button sits here inside card -->

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full px-6 py-2.5 bg-[#61F0FF] text-[#001751] font-medium text-sm rounded-full hover:bg-[#4EC1D2] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Loading...' : t('auth.signup.buttonSubmit') }}
            </button>

            <!-- Already have account -->
            <div class="mt-3 text-center text-sm text-[#C5D1E7]">
              <span class="opacity-80">{{ t('auth.signup.already') }} </span>
              <NuxtLink to="/signin" class="ml-2 inline-block text-[#4EC1D2] font-medium hover:underline" aria-label="Sign in">
                {{ t('auth.signup.signin') }}
              </NuxtLink>
            </div>
          </form>

          <!-- Desktop: Forgot password and social login inside card -->
          <div class="hidden md:block space-y-6">
            <div class="text-center">
              <NuxtLink
                to="/forgot-password"
                class="text-[#4EC1D2] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#4EC1D2] rounded"
              >
                {{ t('auth.signup.forgotPassword') }}
              </NuxtLink>
            </div>

            <div class="space-y-4">
              <div class="relative flex items-center">
                <div class="flex-grow border-t border-[#94A4C2]" />
                <span class="mx-4 text-[#94A4C2] text-base">{{ t('auth.signup.orChoose') }}</span>
                <div class="flex-grow border-t border-[#94A4C2]" />
              </div>

              <SocialLoginButtons @social-login="handleSocialLogin" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Forgot password and social login outside card -->
    <div class="md:hidden mt-4 text-center">
      <NuxtLink
        to="/forgot-password"
        class="text-[#4EC1D2] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-[#4EC1D2] rounded"
      >
        {{ t('auth.signup.forgotPassword') }}
      </NuxtLink>
    </div>

    <div class="md:hidden mt-6 space-y-4">
      <div class="relative flex items-center">
        <div class="flex-grow border-t border-[#94A4C2]" />
        <span class="mx-4 text-[#94A4C2] text-base">{{ t('auth.signup.orChoose') }}</span>
        <div class="flex-grow border-t border-[#94A4C2]" />
      </div>

      <SocialLoginButtons @social-login="handleSocialLogin" />
    </div>

  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isValidEmail, isValidPassword, isValidOAuthProvider } from '../../utils/validation'
import SocialLoginButtons from './SocialLoginButtons.vue'

const { t } = useI18n()

const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)

const validateField = (field: keyof typeof formData) => {
  errors[field] = ''

  if (!formData[field]) {
    errors[field] = t('auth.signup.validationRequired')
    return false
  }

  if (field === 'email') {
    if (!isValidEmail(formData.email)) {
      errors.email = t('auth.signup.validationEmail')
      return false
    }
  }

  if (field === 'password') {
    if (!isValidPassword(formData.password)) {
      errors.password = t('auth.signup.validationPasswordMin')
      return false
    }
  }

  return true
}

const validateForm = () => {
  let isValid = true
  
  const fields: Array<keyof typeof formData> = ['email', 'password']
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // TODO: Implement actual signup API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Reset form
    formData.email = ''
    formData.password = ''
  } finally {
    isLoading.value = false
  }
}

const handleSocialLogin = (provider: 'google' | 'microsoft') => {
  // Validate provider against allowlist to prevent open redirect attacks
  if (!isValidOAuthProvider(provider)) {
    console.error('Invalid OAuth provider:', provider)
    return
  }
  
  // TODO: Implement social login redirect
  window.location.href = `/api/auth/${provider}`
}
</script>
