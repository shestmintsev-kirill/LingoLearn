import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useTabsStore = defineStore('tabs', () => {
	const $router = useRouter()
	const $route = useRoute()

	const tabs = [
		{ name: 'Cards', index: 1 },
		{ name: 'Home', index: 2 },
		{ name: 'Settings', index: 3 }
	]
	const tab = ref($route.query?.page || 'Home')
	const prevTab = ref('')

	const currentAnimationName = computed(() => {
		const prevIndex = tabs.find((el) => el.name === prevTab.value)?.index
		const presentIndex = tabs.find((el) => el.name === tab.value)?.index
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
		tabs,
		currentAnimationName,
		setTab
	}
})
