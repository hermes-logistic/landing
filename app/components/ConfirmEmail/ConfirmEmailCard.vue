<template>
  <div class="relative w-full h-full min-h-screen">
    <!-- Ellipse Glow Effects (on top of background) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <!-- Group with blur and opacity -->
      <div class="absolute inset-0" style="filter: blur(100px); opacity: 0.2;">
        <!-- Ellipse 5 - Top right cyan glow -->
        <div 
          class="absolute bg-[#61F0FF]"
          style="width: 932px; height: 707px; left: calc(50% + 201px); top: -205px;"
        />
        <!-- Ellipse 3 - Bottom left blue glow -->
        <div 
          class="absolute bg-[#6C8AD0]"
          style="width: 440px; height: 417px; left: -76px; bottom: 100px;"
        />
      </div>
      <!-- Additional glow layer -->
      <div class="absolute inset-0" style="filter: blur(100px);">
        <!-- Ellipse 6 - Small cyan accent -->
        <div 
          class="absolute bg-[#61F0FF]"
          style="width: 226px; height: 171px; left: calc(50% - 149px); top: 215px; opacity: 0.15;"
        />
      </div>
    </div>

    <!-- Content Container - Absolute positioned elements matching Figma -->
    <div class="relative z-10 w-full h-full flex flex-col items-center">
      <!-- Title Envelope SVG - top: 163.5px from Figma -->
      <div class="absolute left-1/2 -translate-x-1/2" style="top: 163px;">
        <img
          src="/images/confirm-email/title-envelope.svg"
          alt="Email confirmation illustration"
          class="w-[200px] md:w-[298px] h-auto"
          loading="eager"
          decoding="async"
        >
      </div>

      <!-- Confirm Email Title - top: 389px, centered -->
      <h1 
        class="absolute left-1/2 -translate-x-1/2 text-[#FFFFFF] text-2xl md:text-[45px] font-bold leading-tight md:leading-[52px] text-center whitespace-nowrap"
        style="top: 389px;"
      >
        {{ t('auth.confirmEmail.title') }}
      </h1>

      <!-- Welcome Title - top: 501px, centered -->
      <h2 
        class="absolute left-1/2 -translate-x-1/2 text-[#FFFFFF] text-sm md:text-base font-bold text-center"
        style="top: 501px;"
      >
        {{ t('auth.confirmEmail.welcome') }}
      </h2>

      <!-- Description Paragraph - top: 565.5px, left: 389px, width: 662px -->
      <p 
        class="absolute text-[#FFFFFF] text-xs md:text-sm leading-5 px-4 md:px-0"
        style="top: 565px; left: 50%; transform: translateX(-50%); width: 100%; max-width: 662px;"
      >
        {{ t('auth.confirmEmail.description') }}
      </p>

      <!-- Sign In Button - top: 705.5px, centered, width: 402px -->
      <NuxtLink
        to="/signin"
        class="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-[280px] md:w-[402px] h-10 bg-[#61F0FF] text-[#001751] font-medium text-sm rounded-full text-center hover:bg-[#4EC1D2] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#61F0FF] focus:ring-offset-2 focus:ring-offset-[#01051D]"
        style="top: 705px;"
        aria-label="Sign in"
      >
        {{ t('auth.confirmEmail.buttonSignin') }}
      </NuxtLink>

      <!-- Footer Logo - top: 837.5px, centered -->
      <div class="absolute left-1/2 -translate-x-1/2" style="top: 837px;">
        <NuxtLink to="/" aria-label="Home">
          <img
            src="/images/confirm-email/hermes-logo-full.svg"
            alt="Hermes Logistics"
            class="w-[200px] md:w-[299px] h-auto"
            loading="lazy"
            decoding="async"
          >
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
</script>
