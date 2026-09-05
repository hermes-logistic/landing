<template>
  <div
    v-if="open"
    id="mobile-menu"
    ref="rootEl"
    class="md:hidden relative"
  >
    <!-- Scrim (DESIGN.md navbar-drawer.scrimColor #01051DCC). It starts at the
         BAR's bottom edge (`top-0` on this container, which begins where the
         bar ends) rather than at the panel's, and is painted *behind* the
         opaque panel — it is a sibling earlier in DOM order, and both are
         z-auto positioned boxes, so the panel wins the paint order. That is
         what the panel's 2xl bottom corners need: DESIGN.md calls the scrim
         "the dimmed field behind a modal, sheet or drawer", and the two 16px
         corner cutouts are part of that field. Left starting at `top-full`
         they showed the hero undimmed: measured #021658 in the cutout against
         #010828 in the scrimmed field 10px below it. Now both read the same.
         The panel still covers everything it overlaps, and the scrim still
         never paints on the bar. Absolute inside a `position: fixed` nav: it
         adds no scrollable overflow to the document, so it cannot move CLS. -->
    <div
      class="absolute inset-x-0 top-0 h-screen bg-[#01051DCC]"
      aria-hidden="true"
      @click="emit('close')"
    />

    <!-- Panel. navbar-drawer: surface #001751 opaque, 1px border-hairline-cool,
         square top corners (flush with the bar) and 2xl (16px) bottom corners,
         padding 20, groupGap 24. The bar drops its own bottom hairline while
         this is open (see AppNavbar .nav-drawer-open) so the rounded edge below
         is a single 1px line, not two stacked ones.
         `border-y`, not `border`: the panel is full-bleed, so a side hairline
         sits on the viewport edge where it cannot be seen and only pushes the
         first link to x=21 — DESIGN.md wants it sharing x=20 with the logo.
         groupGap {spacing.24} is the PANEL'S FLEX GAP, and the separating
         hairlines are siblings of the groups, not a total content-to-content
         distance: the canonical drawing (nyRec -> KCMkq) stacks nav, rule,
         action, rule, switcher with 24 between each adjacent pair, so two
         groups sit 24 + 1 + 24 = 49px apart with the rule centred. `gap-6`
         here plus `pt-6` on the two groups that carry a rule spends the token
         on both sides of the rule, which is what the pen draws. Collapsing it
         to 12 + 1 + 12 spends it once and comes out 48px short. -->
    <div class="relative bg-[#001751] border-y border-[#B7CDF51F] rounded-b-2xl p-5 flex flex-col gap-6">
      <!-- Group 1 — navigation. nav-lg (16/500), itemHeight 44, itemGap 4. -->
      <div class="flex flex-col gap-1">
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.href"
          :class="[
            'flex items-center min-h-[44px] text-base leading-normal font-medium transition-colors duration-200',
            link.href === activeHash ? 'text-[#61F0FF]' : 'text-[#EBF2FF] hover:text-[#61F0FF]',
          ]"
          :aria-current="link.href === activeHash ? 'page' : undefined"
          @click="emit('navigate', link.href)"
        >
          {{ t(link.labelKey) }}
        </a>
      </div>

      <!-- Group 2 — action. nav-md (14/500). The hairline plus the size step is
           the whole separation; DESIGN.md forbids wrapping the groups in cards.
           `pt-6` is the groupGap below the rule; the container's `gap-6` is the
           one above it. Together: 24 + 1 + 24 = 49px, rule centred. -->
      <div class="border-t border-[#B7CDF51F] pt-6 flex flex-col gap-1">
        <!-- Both items are nav-md, so size cannot rank them: order and chrome
             do, and the primary goes LAST — the rule modals use for their
             Default action. The group grows by exactly 48px (44 item + 4 gap),
             which leaves the 24 + 1 + 24 rhythm between groups untouched.
             Deliberately not a fourth group: that would need a fourth hairline
             and a type step below nav-sm, and no such step exists. -->
        <NavSignupLink
          variant="mobile"
          @navigate="emit('close')"
        />
        <button
          class="w-full min-h-[44px] px-6 border border-[#FF734D] text-[#EBF2FF] rounded-full hover:bg-[#FF734D] hover:text-[#01051D] transition-colors duration-300 font-medium text-sm shrink-0 whitespace-nowrap"
          aria-haspopup="dialog"
          :aria-expanded="isContactModalOpen"
          @click="emit('openContact')"
        >
          {{ t('nav.cta') }}
        </button>
      </div>

      <!-- Group 3 — utility. The chips are already nav-sm (12/500); the row
           carries the 44px touch floor around them. -->
      <div class="border-t border-[#B7CDF51F] pt-6">
        <div class="flex items-center justify-center min-h-[44px]">
          <NavLangSwitch
            :locale="locale"
            variant="mobile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import NavLangSwitch from './NavLangSwitch.vue'
import NavSignupLink from './NavSignupLink.vue'
import type { NavLink } from './links'
import { useFocusTrap } from '~/composables/useFocusTrap'

const props = defineProps<{
  open: boolean
  links: readonly NavLink[]
  activeHash: string
  locale: string
  isContactModalOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  navigate: [href: string]
  openContact: []
}>()

// i18n composable (auto-imported from app/composables) — labels only.
const { t } = useI18n()

const rootEl = ref<HTMLElement | null>(null)

useFocusTrap(rootEl, toRef(props, 'open'), () => emit('close'))
</script>
