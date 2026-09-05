/**
 * Stand-in for Nuxt's `#imports` virtual module.
 *
 * Vitest runs outside Nuxt, so `useHead`/`useSeoMeta` have no implementation.
 * These record what was passed instead of applying it, which is what lets the
 * SEO head be asserted directly (canonical, hreflang cluster, og locales).
 */
export interface HeadInput { link?: Array<Record<string, unknown>>, [key: string]: unknown }

export const headCalls: HeadInput[] = []
export const seoCalls: Array<Record<string, unknown>> = []

export function useHead(input: HeadInput) {
  headCalls.push(input)
}

export function useSeoMeta(input: Record<string, unknown>) {
  seoCalls.push(input)
}

export function resetHeadStubs() {
  headCalls.length = 0
  seoCalls.length = 0
}
