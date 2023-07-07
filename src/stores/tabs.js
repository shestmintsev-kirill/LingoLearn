import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import common from '@/common'

export const useTabsStore = defineStore('tabs', () => {
	const $router = useRouter()
	const $route = useRoute()

	const tab = ref($route.query?.page || 'Home')
	const prevTab = ref('')

	const currentAnimationName = computed(() => {
		const prevIndex = common.systemTabs.find((el) => el.name === prevTab.value)?.index
		const presentIndex = common.systemTabs.find((el) => el.name === tab.value)?.index
		if (!prevIndex || !presentIndex) return 'fadeIn'
		return prevIndex > presentIndex ? 'slideLeft' : 'slideRight'
	})

	const setTab = (newTab) => {
		$router.push({ query: { page: newTab } })
		prevTab.value = tab.value
		tab.value = newTab
	}

	return {
		tab,
		prevTab,
		currentAnimationName,
		setTab
	}
})
