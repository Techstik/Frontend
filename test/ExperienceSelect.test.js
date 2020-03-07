/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import ExperienceSelect from '@/components/experienceselect'

describe('Experience Select', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ExperienceSelect)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  test('matches snapshot', () => {
    const wrapper = mount(ExperienceSelect)
    expect(wrapper.element).toMatchSnapshot()
  })
})
