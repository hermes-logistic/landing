<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white mb-4">
        {{ t('kyc.wizard.steps.subscription') }}
      </h1>
      <p class="text-gray-400 mb-8">
        Coming soon...
      </p>
      <button
        class="px-6 py-3 bg-[#61F0FF] text-[#01051D] font-bold rounded-full hover:opacity-80 transition-opacity"
        @click="goBack"
      >
        Go Back to Profile
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'kyc'
})

const { t } = useI18n()
const router = useRouter()

function goBack(): void {
  router.push('/kyc/profile')
}
</script>
