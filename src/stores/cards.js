import { db } from '@/firebase'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useCollection } from 'vuefire'
import { useAuthStore } from './auth'
import AddingCardDialog from '@/components/AddingCardDialog.vue'

// const rules = []
// for (let index = 1; index <= 50; index++) {
// 	console.log((index - 1) * 2)
// 	rules.push({ level: index, interval: 1 })
// }
// console.log(rules)

const rulesByLevel = [
	{ level: 1, interval: 0 },
	{ level: 2, interval: 1 },
	{ level: 3, interval: 2 },
	{ level: 4, interval: 3 },
	{ level: 5, interval: 5 },
	{ level: 6, interval: 7 },
	{ level: 7, interval: 10 },
	{ level: 8, interval: 15 },
	{ level: 9, interval: 20 },
	{ level: 10, interval: 25 }
]

const levelLines = {
	toLearn: 1,
	known: 5,
	learned: 10
}

export const useCardsStore = defineStore('cards', () => {
	const $q = useQuasar()
	const authStore = useAuthStore()

	// state
	const cardsRef = collection(db, authStore.user.email)
	const cards = useCollection(cardsRef)
	// state

	// getters
	const getCards = computed(() => cards.value)
	const getToLearnCards = computed(() =>
		cards.value.filter((card) => {
			const { lvl, realInterval, intervalForLevel } = calculateIntervals(card)
			const toLearnCondition = realInterval.days >= intervalForLevel.interval || lvl === levelLines.toLearn
			if (toLearnCondition) return true
			return false
		})
	)
	const getKnownCards = computed(() =>
		cards.value.filter((card) => {
			const { lvl, realInterval, intervalForLevel } = calculateIntervals(card)
			const knownCondition = lvl > levelLines.toLearn && lvl < levelLines.known && realInterval.days < intervalForLevel.interval
			if (knownCondition) return true
			return false
		})
	)
	const getLearnedCards = computed(() =>
		cards.value.filter((card) => {
			const { lvl, realInterval, intervalForLevel } = calculateIntervals(card)
			const learnedCondition = lvl > levelLines.known && realInterval.days < intervalForLevel.interval
			if (learnedCondition) return true
			return false
		})
	)
	// getters

	// actions
	const getDateTimeBetween = (firstDate, secondDate) => {
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
	}
	const calculateIntervals = (card) => {
		const lvl = +card.level
		const realInterval = getDateTimeBetween(card.date, new Date())
		const intervalForLevel = rulesByLevel.find((rule) => rule.level === lvl) || { interval: (lvl - 10) * 20 }
		return { lvl, realInterval, intervalForLevel }
	}
	const addNewWord = async (form) => {
		const { word, translate, example = '' } = form
		await addDoc(cardsRef, { word, translate, example, date: new Date().toISOString(), level: 1 })
		$q.notify({
			message: 'Card added',
			color: 'secondary',
			position: 'top'
		})
	}
	const deleteCard = async (cardId, withConfirm = false, afterRemovingCb = () => ({})) => {
		const removeHandler = async () => {
			await deleteDoc(doc(db, authStore.user.email, cardId))
			$q.notify({
				message: 'Card removed',
				color: 'secondary',
				position: 'top'
			})
		}

		if (withConfirm) {
			$q.dialog({
				title: 'Confirm',
				message: 'Are you sure to delete this card?',
				cancel: true,
				persistent: true
			})
				.onOk(async () => {
					await removeHandler()
					afterRemovingCb()
				})
				.onCancel(() => {})
				.onDismiss(() => {})
		} else await removeHandler()
	}
	const updateCard = async (cardId, body) => {
		const cardRef = doc(db, authStore.user.email, cardId)
		await updateDoc(cardRef, body)
	}
	const refreshCard = async (cardId) => {
		$q.dialog({
			title: 'Confirm',
			message: 'Are you sure to refresh this card?',
			cancel: true,
			persistent: true
		})
			.onOk(async () => {
				await updateCard(cardId, {
					level: 1,
					date: new Date().toISOString()
				})
			})
			.onCancel(() => {})
			.onDismiss(() => {})
	}
	const showAddingCardDialog = (card = null) => {
		$q.dialog({
			component: AddingCardDialog,
			componentProps: {
				card
			}
		})
	}
	// actions

	return {
		updateCard,
		getDateTimeBetween,
		addNewWord,
		showAddingCardDialog,
		deleteCard,
		refreshCard,
		calculateIntervals,
		getCards,
		getLearnedCards,
		getKnownCards,
		getToLearnCards,
		cards,
		cardsRef
	}
})
