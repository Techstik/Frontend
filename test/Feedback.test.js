/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import Feedback from '@/components/feedback'

describe('Feedback', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Feedback)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  test('matches snapshot', () => {
    const wrapper = mount(Feedback)
    expect(wrapper.element).toMatchSnapshot()
  })
})
