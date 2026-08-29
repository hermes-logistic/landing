<template>
  <Teleport to="body">
    <!-- Modal Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        role="presentation"
        class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        @click.self="closeModal"
      />
    </Transition>

    <!-- Modal Dialog -->
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md"
        role="dialog"
        aria-labelledby="contact-modal-title"
        aria-modal="true"
      >
        <div class="bg-[#001751] rounded-t-2xl md:rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 id="contact-modal-title" class="text-2xl font-bold text-white">
              {{ t('contact.modal.title') }}
            </h2>
            <button
              aria-label="Close modal"
              class="text-white/70 hover:text-white transition-colors p-1"
              @click="closeModal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="submitForm">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-white/80 mb-2">
                {{ t('contact.modal.name') }}
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-[#61F0FF] focus:bg-white/10 transition-all"
                :placeholder="t('contact.modal.namePlaceholder')"
              >
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-white/80 mb-2">
                {{ t('contact.modal.email') }}
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-[#61F0FF] focus:bg-white/10 transition-all"
                :placeholder="t('contact.modal.emailPlaceholder')"
              >
            </div>

            <!-- Company -->
            <div>
              <label for="company" class="block text-sm font-medium text-white/80 mb-2">
                {{ t('contact.modal.company') }}
              </label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-[#61F0FF] focus:bg-white/10 transition-all"
                :placeholder="t('contact.modal.companyPlaceholder')"
              >
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-white/80 mb-2">
                {{ t('contact.modal.message') }}
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="4"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:border-[#61F0FF] focus:bg-white/10 transition-all resize-none"
                :placeholder="t('contact.modal.messagePlaceholder')"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full mt-6 px-6 py-2.5 bg-[#FF734D] text-white rounded-full hover:bg-[#FF6B3D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-sm tracking-wide"
            >
              <span v-if="!isSubmitting">{{ t('contact.modal.send') }}</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ t('contact.modal.sending') }}
              </span>
            </button>

            <!-- Success Message -->
            <Transition name="fade">
              <div
                v-if="successMessage"
                class="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
              >
                {{ successMessage }}
              </div>
            </Transition>

            <!-- Error Message -->
            <Transition name="fade">
              <div
                v-if="errorMessage"
                class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {{ errorMessage }}
              </div>
            </Transition>
          </form>

          <!-- Footer Text -->
          <p class="mt-6 text-center text-xs text-white/60">
            {{ t('contact.modal.privacy') }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

interface ContactForm {
  name: string
  email: string
  company: string
  message: string
}

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
}>()

useBodyScrollLock(toRef(props, 'isOpen'))

const emit = defineEmits<{
  close: []
}>()

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref<ContactForm>({
  name: '',
  email: '',
  company: '',
  message: ''
})

function closeModal() {
  emit('close')
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    company: '',
    message: ''
  }
  successMessage.value = ''
  errorMessage.value = ''
}

async function submitForm() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Mock API call - En el futuro, aquí irá la integración con SendGrid o CRM
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simulamos una respuesta exitosa
    console.log('Form submitted:', form.value)

    successMessage.value = t('contact.modal.successMessage')

    // Limpiar el formulario después de 2 segundos
    setTimeout(() => {
      resetForm()
      closeModal()
    }, 2000)
  } catch (error) {
    errorMessage.value = t('contact.modal.errorMessage')
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 300ms ease, opacity 300ms ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 768px) {
  .slide-up-enter-from {
    transform: translateY(20px);
  }

  .slide-up-leave-to {
    transform: translateY(20px);
  }
}
</style>
