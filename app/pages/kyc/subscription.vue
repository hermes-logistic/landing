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
        <KycSubscriptionForm
          @submit="handleSubmit"
          @back="handleBack"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Plan {
  name: string
  units: string
  price: string
  description: string
  paymentSpecs: string
  button: string
  features: string[]
}

interface KycSubscriptionData {
  planIndex: number
  plan: Plan
}

definePageMeta({
  layout: 'kyc'
})

const { t } = useI18n()
const router = useRouter()

// SEO Meta
useHead(() => ({
  title: t('kyc.subscription.meta.title'),
  meta: [
    { name: 'description', content: t('kyc.subscription.meta.description') },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
}))

// KYC State Management
const KYC_STORAGE_KEY = 'hermes_kyc_state'

interface KycState {
  currentStep: number
  completedSteps: number[]
  profileData?: Record<string, unknown>
  subscriptionData?: KycSubscriptionData
}

function loadKycState(): KycState {
  if (typeof window === 'undefined') {
    return { currentStep: 2, completedSteps: [1] }
  }
  
  try {
    const stored = localStorage.getItem(KYC_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Invalid JSON, return default
  }
  
  return { currentStep: 2, completedSteps: [1] }
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
  // Navigate back to profile step
  handleNavigate(1)
}

function handleSubmit(data: KycSubscriptionData): void {
  // Save subscription data
  kycState.value.subscriptionData = data
  
  // Mark step 2 as completed
  if (!kycState.value.completedSteps.includes(2)) {
    kycState.value.completedSteps.push(2)
  }
  
  // Move to next step
  kycState.value.currentStep = 3
  saveKycState(kycState.value)
  
  // Navigate to drivers page (placeholder for now)
  router.push('/kyc/drivers')
}

// Initialize state on mount
onMounted(() => {
  kycState.value = loadKycState()
  
  // Ensure we're on step 2 and step 1 is completed
  // If user hasn't completed profile, redirect them back
  if (!kycState.value.completedSteps.includes(1)) {
    router.replace('/kyc/profile')
    return
  }
  
  // Set current step to 2
  kycState.value.currentStep = 2
  saveKycState(kycState.value)
})
</script>
