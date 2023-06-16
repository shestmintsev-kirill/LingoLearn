import { shallowMount, describe, it, expect } from '@vue/test-utils'
import HelloWorld from '@/views/appView.vue'

describe('HelloWorld.vue', () => {
	it('renders props.msg when passed', () => {
		const msg = 'new message'
		const wrapper = shallowMount(HelloWorld, {
			props: { msg }
		})
		expect(wrapper.text()).toMatch(msg)
	})
})
