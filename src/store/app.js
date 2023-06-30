import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const getBrowser = () => {
	const { userAgent } = navigator
	if (userAgent.match(/chrome|chromium|crios/i)) return 'chrome'
	else if (userAgent.match(/firefox|fxios/i)) return 'firefox'
	else if (userAgent.match(/safari/i)) return 'safari'
	else if (userAgent.match(/opr\//i)) return 'opera'
	else if (userAgent.match(/edg/i)) return 'edge'
	else return 'No browser detection'
}

export const useAppStore = defineStore('app', () => {
	// state
	const userBrowser = ref(getBrowser())
	// const isPwa = ['fullscreen', 'standalone', 'minimal-ui'].some((displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches)
	// state

	// getters
	const isPwa = computed(() => navigator.standalone || window.matchMedia('(display-mode: standalone)').matches ? true : false)
	const isMobileDevice = computed(() => navigator.userAgentData.mobile)
	// getters

	// actions
	// actions

	return { userBrowser, isPwa, isMobileDevice }
})
