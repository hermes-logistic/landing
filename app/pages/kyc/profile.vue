<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full py-4 lg:py-6 px-4 lg:px-8">
      <div class="max-w-7xl mx-auto flex justify-center">
        <KycLogo />
      </div>
    </header>

    <!-- Wizard -->
    <div class="w-full py-4 lg:py-8 px-4">
      <div class="max-w-5xl mx-auto">
        <KycWizard
          :current-step="currentStep"
          :completed-steps="completedSteps"
          @navigate="handleNavigate"
        />
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 px-4 lg:px-8 pb-8 lg:pb-16">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-20">
          <!-- Form Section -->
          <div class="flex-1 order-2 lg:order-1 lg:w-1/2">
            <KycProfileForm @submit="handleSubmit" />
          </div>

          <!-- Illustration Section -->
          <div class="order-1 lg:order-2 mb-8 lg:mb-0 flex justify-center lg:justify-end lg:w-1/2">
            <div class="relative w-full h-[360px] lg:h-[720px] xl:h-[780px]">
              <!-- Background ellipsis effects (desktop only) -->
              <!-- Blue ellipsis -->
              <div class="hidden lg:block absolute left-0 top-[20%] w-[280px] h-[280px] bg-[#61F0FF] opacity-20 rounded-full" style="filter: blur(75px);" />
              
              <!-- Yellow ellipsis -->
              <div class="hidden lg:block absolute right-[10%] bottom-[15%] w-[196px] h-[196px] bg-[#FFC152] opacity-20 rounded-full" style="filter: blur(75px);" />
              
              <!-- Illustration -->
              <img
                src="/images/kyc/profile-illustration.svg"
                :alt="t('kyc.profile.illustrationAlt')"
                class="relative z-10 w-full h-full object-contain"
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { KycProfileData } from '../../utils/kyc-validation'

definePageMeta({
  layout: 'kyc'
})

const { t } = useI18n()
const router = useRouter()

// SEO Meta
useHead({
  title: t('kyc.profile.meta.title'),
  meta: [
    { name: 'description', content: t('kyc.profile.meta.description') },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// KYC State Management
const KYC_STORAGE_KEY = 'hermes_kyc_state'

interface KycState {
  currentStep: number
  completedSteps: number[]
  profileData?: KycProfileData
}

function loadKycState(): KycState {
  if (typeof window === 'undefined') {
    return { currentStep: 1, completedSteps: [] }
  }
  
  try {
    const stored = localStorage.getItem(KYC_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, return default
  }
  
  return { currentStep: 1, completedSteps: [] }
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

function handleSubmit(data: KycProfileData): void {
  // Save profile data
  kycState.value.profileData = data
  
  // Mark step 1 as completed
  if (!kycState.value.completedSteps.includes(1)) {
    kycState.value.completedSteps.push(1)
  }
  
  // Move to next step
  kycState.value.currentStep = 2
  saveKycState(kycState.value)
  
  // Navigate to subscription page (placeholder for now)
  router.push('/kyc/subscription')
}

// Initialize state on mount
onMounted(() => {
  kycState.value = loadKycState()
  
  // If user completed profile before, allow them to continue
  // but for this page, we're always on step 1
  if (kycState.value.currentStep !== 1 && !kycState.value.completedSteps.includes(1)) {
    kycState.value.currentStep = 1
    saveKycState(kycState.value)
  }
})
</script>
