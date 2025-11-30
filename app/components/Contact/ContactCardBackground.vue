<template>
  <div class="absolute inset-0 rounded-[10px] overflow-hidden">
    <!-- Card gradient fill (from Figma: 115deg, #FF734D to transparent) -->
    <div
      class="absolute inset-0 rounded-[10px]"
      style="background: linear-gradient(115deg, rgba(255, 115, 77, 1) 0%, rgba(255, 115, 77, 0) 61%); box-shadow: 0px 55px 80px 0px rgba(1, 5, 29, 0.1);"
    />
    <!-- Vector decoration (from Figma: gradient orange) - hidden on mobile -->
    <div class="absolute right-0 top-[54px] z-10 hidden md:block">
      <NuxtImg
        src="/images/contact/contact-card-vector.svg"
        alt=""
        class="w-[300px] lg:w-[442px] h-auto"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      />
    </div>
  </div>
</template>
