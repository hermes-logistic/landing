<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full py-3 lg:py-4 px-4 lg:px-8">
      <div class="max-w-7xl mx-auto flex justify-center">
        <KycLogo />
      </div>
    </header>

    <!-- Wizard -->
    <div class="w-full py-2 lg:py-4 px-4">
      <div class="max-w-5xl mx-auto">
        <KycWizard
          :current-step="currentStep"
          :completed-steps="completedSteps"
          @navigate="handleNavigate"
        />
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 px-4 lg:px-8 pb-4 lg:pb-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row lg:items-start lg:gap-8 xl:gap-12">
          <!-- Form Section -->
          <div class="flex-1 order-2 lg:order-1 lg:w-1/2">
            <KycDriversForm ref="driversFormRef" />
          </div>

          <!-- Illustration Section -->
          <div class="order-1 lg:order-2 mb-6 lg:mb-0 flex justify-center lg:justify-end lg:w-1/2">
            <div class="relative w-full h-[280px] lg:h-[420px] xl:h-[480px]">
              <!-- Background ellipsis effects (desktop only) -->
              <!-- Blue ellipsis -->
              <div class="hidden lg:block absolute left-[30%] top-[10%] w-[122px] h-[122px] bg-[#61F0FF] opacity-50 rounded-full" style="filter: blur(75px);" />

              <!-- Orange ellipsis -->
              <div class="hidden lg:block absolute left-0 bottom-[15%] w-[68px] h-[68px] bg-[#FF734D] opacity-50 rounded-full" style="filter: blur(75px);" />

              <!-- Illustration -->
              <img
                src="/images/kyc/drivers-illustration.svg"
                :alt="t('kyc.drivers.illustrationAlt')"
                class="relative z-10 w-full h-full object-contain lg:object-right-top"
              >
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-4 lg:mt-6 max-w-7xl">
          <!-- Back Button -->
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 border border-[#61F0FF] text-[#61F0FF] text-sm font-medium rounded-full hover:bg-[#61F0FF] hover:bg-opacity-10 transition-all focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
            @click="handleBack"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t('kyc.drivers.back') }}
          </button>

          <!-- Next Step Button -->
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 border border-[#61F0FF] text-sm font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
            :class="isFormSaved ? 'text-[#61F0FF] hover:bg-[#61F0FF] hover:bg-opacity-10' : 'text-[#94A4C2] border-[#94A4C2] cursor-not-allowed opacity-50'"
            :disabled="!isFormSaved"
            @click="handleNext"
          >
            {{ t('kyc.drivers.nextStep') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { KycDriversData } from '../../utils/kyc-drivers-validation'

definePageMeta({
  layout: 'kyc'
})

const { t } = useI18n()
const router = useRouter()

// Reference to the drivers form component
const driversFormRef = ref<{
  getDriversData: () => KycDriversData
  isValid: () => boolean
  isSaved: () => boolean
} | null>(null)

// Computed property to check if form data is saved
const isFormSaved = computed(() => {
  return driversFormRef.value?.isSaved() ?? false
})

// SEO Meta
useHead(() => ({
  title: t('kyc.drivers.meta.title'),
  meta: [
    { name: 'description', content: t('kyc.drivers.meta.description') },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
}))

// KYC State Management
const KYC_STORAGE_KEY = 'hermes_kyc_state'

interface KycState {
  currentStep: number
  completedSteps: number[]
  profileData?: Record<string, unknown>
  subscriptionData?: Record<string, unknown>
  driversData?: KycDriversData
}

function loadKycState(): KycState {
  if (typeof window === 'undefined') {
    return { currentStep: 3, completedSteps: [1, 2] }
  }

  try {
    const stored = localStorage.getItem(KYC_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, return default
  }

  return { currentStep: 3, completedSteps: [1, 2] }
}

function saveKycState(state: KycState): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage not available
  }
}

const kycState = ref<KycState>(loadKycState())

const currentStep = computed(() => kycState.value.currentStep)
const completedSteps = computed(() => kycState.value.completedSteps)

function handleNavigate(step: number): void {
  kycState.value.currentStep = step
  saveKycState(kycState.value)

  // Navigate to the appropriate page based on step
  const routes: Record<number, string> = {
    1: '/kyc/profile',
    2: '/kyc/subscription',
    3: '/kyc/drivers',
    4: '/kyc/payment',
    5: '/kyc/done'
  }

  if (routes[step]) {
    router.push(routes[step])
  }
}

function handleBack(): void {
  // Navigate back to subscription step
  handleNavigate(2)
}

function handleNext(): void {
  // Get data from the form component
  if (!driversFormRef.value) return

  // Validate that the data is valid
  if (!driversFormRef.value.isValid()) {
    return
  }

  // Save the data
  const data = driversFormRef.value.getDriversData()
  kycState.value.driversData = data

  // Mark step 3 as completed
  if (!kycState.value.completedSteps.includes(3)) {
    kycState.value.completedSteps.push(3)
  }

  // Move to the next step
  kycState.value.currentStep = 4
  saveKycState(kycState.value)

  // Navigate to the payment page
  router.push('/kyc/payment')
}

// Initialize state on mount
onMounted(() => {
  kycState.value = loadKycState()

  // Ensure user has completed previous steps
  if (!kycState.value.completedSteps.includes(1)) {
    router.replace('/kyc/profile')
    return
  }

  if (!kycState.value.completedSteps.includes(2)) {
    router.replace('/kyc/subscription')
    return
  }

  // Set current step to 3
  kycState.value.currentStep = 3
  saveKycState(kycState.value)
})
</script>
