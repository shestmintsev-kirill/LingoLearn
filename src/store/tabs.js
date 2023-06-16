import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
	state: () => ({
		tab: 'Home'
	}),
	getters: {},
	actions: {
		setTab(tab) {
			this.tab = tab
		}
	}
})
