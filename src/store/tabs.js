import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
	state: () => ({
		tab: 'Home',
		prevTab: '',
		tabs: [
			{ name: 'Cards', index: 1 },
			{ name: 'Home', index: 2 },
			{ name: 'Settings', index: 3 }
		]
	}),
	getters: {
		currentAnimationName: (state) => {
			const prevIndex = state.tabs.find(tab => tab.name === state.prevTab)?.index
			const presentIndex = state.tabs.find(tab => tab.name === state.tab)?.index
			if (!prevIndex || !presentIndex) return 'fadeIn'
			return prevIndex > presentIndex ? 'slideLeft' : 'slideRight'
		}
	},
	actions: {
		setTab(tab) {
			this.prevTab = this.tab
			this.tab = tab
		}
	}
})
