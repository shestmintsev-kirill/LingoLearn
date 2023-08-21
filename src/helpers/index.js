import { useAuthStore } from '@/stores/auth'

export default {
	isEqualObjects(firstObj, secondObj) {
		return JSON.stringify(firstObj).split('').sort().join() === JSON.stringify(secondObj).split('').sort().join()
	},

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	},

	getDateTimeBetween(firstDate, secondDate) {
		const startDate = new Date(firstDate)
		const endDate = new Date(secondDate)

		// Calculate the difference in milliseconds
		const diffInMilliseconds = endDate.getTime() - startDate.getTime()

		// Convert milliseconds to days, hours, and minutes
		const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
		const hours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
		// console.log('The difference is: ' + days + ' days, ' + hours + ' hours, and ' + minutes + ' minutes.')

		return { days, hours, minutes }
	},

	userLSStorageCards(action, payload) {
		const authStore = useAuthStore()
		if (action === 'get') return JSON.parse(localStorage[`processedCards_${authStore.user.email}`] ?? 'null')
		else if (action === 'set' && payload) localStorage[`processedCards_${authStore.user.email}`] = JSON.stringify(payload)
		else if (action === 'delete') localStorage.removeItem(`processedCards_${authStore.user.email}`)
	}
}
