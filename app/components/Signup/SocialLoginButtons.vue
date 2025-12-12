<template>
  <div class="space-y-3">
    <!-- Google Button -->
    <button
      type="button"
      class="w-full flex items-center justify-center gap-4 px-6 py-2.5 bg-transparent border border-[#61F0FF] text-[#61F0FF] rounded-full hover:bg-[#61F0FF]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
      @click="handleSocialLogin('google')"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.1716 8.36788H17.5001V8.33329H10.0001V11.6666H14.7096C14.0226 13.6071 12.1766 15 10.0001 15C7.23915 15 5.00012 12.7609 5.00012 9.99996C5.00012 7.23904 7.23915 4.99996 10.0001 4.99996C11.2746 4.99996 12.4341 5.48079 13.3171 6.26663L15.6741 3.90954C14.1856 2.52204 12.1951 1.66663 10.0001 1.66663C5.39812 1.66663 1.66675 5.39796 1.66675 9.99996C1.66675 14.602 5.39812 18.3333 10.0001 18.3333C14.6021 18.3333 18.3334 14.602 18.3334 9.99996C18.3334 9.44121 18.2759 8.89579 18.1716 8.36788Z" fill="#FFC107"/>
        <path d="M2.62756 6.12121L5.36573 8.12954C6.10656 6.29537 7.90073 4.99996 10.0001 4.99996C11.2746 4.99996 12.4341 5.48079 13.3171 6.26663L15.6741 3.90954C14.1856 2.52204 12.1951 1.66663 10.0001 1.66663C6.79906 1.66663 4.02323 3.47371 2.62756 6.12121Z" fill="#FF3D00"/>
        <path d="M10.0001 18.3333C12.1526 18.3333 14.1081 17.5096 15.5871 16.17L13.0084 13.9875C12.1439 14.6452 11.0863 15.0008 10.0001 15C7.83262 15 5.99179 13.6179 5.29846 11.6892L2.58179 13.7829C3.96012 16.4817 6.76096 18.3333 10.0001 18.3333Z" fill="#4CAF50"/>
        <path d="M18.1716 8.36796H17.5001V8.33337H10.0001V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0084 13.9871L15.5871 16.1696C15.4046 16.3355 18.3334 14.1667 18.3334 10C18.3334 9.44129 18.2759 8.89587 18.1716 8.36796Z" fill="#1976D2"/>
      </svg>
      <span class="text-sm font-medium">{{ t('auth.signup.socialGoogle') }}</span>
    </button>

    <!-- Microsoft Button -->
    <button
      type="button"
      class="w-full flex items-center justify-center gap-4 px-6 py-2.5 bg-transparent border border-[#61F0FF] text-[#61F0FF] rounded-full hover:bg-[#61F0FF]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
      @click="handleSocialLogin('microsoft')"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 9.5H1V1.5H9.5V9.5Z" fill="#F25022"/>
        <path d="M19 9.5H10.5V1.5H19V9.5Z" fill="#7FBA00"/>
        <path d="M9.5 19H1V10.5H9.5V19Z" fill="#00A4EF"/>
        <path d="M19 19H10.5V10.5H19V19Z" fill="#FFB900"/>
      </svg>
      <span class="text-sm font-medium">{{ t('auth.signup.socialMicrosoft') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const emit = defineEmits<{
  socialLogin: [provider: 'google' | 'microsoft']
}>()

const handleSocialLogin = (provider: 'google' | 'microsoft') => {
  emit('socialLogin', provider)
}
</script>
