import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../app/pages/index.vue'
import SignupPage from '../../app/pages/signup.vue'
import SigninPage from '../../app/pages/signin.vue'

describe('Routing to pages', () => {
  it('index page mounts correctly', () => {
    const wrapper = mount(IndexPage, { global: { stubs: { AppNavbar: true } } })
    expect(wrapper.vm).toBeDefined()
  })

  it('signup page mounts correctly', () => {
    const wrapper = mount(SignupPage, { global: { stubs: { SignupForm: true } } })
    expect(wrapper.findComponent({ name: 'SignupForm' }).exists()).toBe(true)
  })

  it('signin page mounts correctly', () => {
    const wrapper = mount(SigninPage, { global: { stubs: { NuxtLink: true } } })
    expect(wrapper.vm).toBeDefined()
  })
})
