<template>
	<div
		class="q-pa-md card-wrapper"
		style="max-width: 90%"
	>
		<q-list
			class="shadow-5 border"
			separator
		>
			<div class="absolute-top-right text-h4 q-mr-xs">
				<q-badge
					rounded
					color="primary"
					:label="cardsStore.getToLearnCards?.length"
					class="q-ma-sm"
				/>
			</div>
			<q-slide-item
				class="border"
				right-color="red"
				@left="completeCard"
				@right="refreshCard"
			>
				<template
					v-slot:left
					v-if="isFirstShow && !isEmptyCards"
				>
					<q-icon name="done" />
					Complete
				</template>
				<template
					v-slot:right
					v-if="isFirstShow && !isEmptyCards"
				>
					Retry
					<q-icon name="undo" />
				</template>
				<transition
					appear
					enter-active-class="animated fadeIn"
					leave-active-class="animated fadeOut"
				>
					<Card
						:card="getCurrentCard"
						:cardIsExistInSecondStep="cardIsExistInSecondStep"
						:isFirstShow="isFirstShow"
						@clickHandler="cardClickHandler"
					/>
				</transition>
			</q-slide-item>
		</q-list>
		<CardBtns
			:card="getCurrentCard"
			@deleteHandler="() => isFirstShow = false"
		/>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useSpeakStore } from '@/stores/speak'
import { useTabsStore } from '@/stores/tabs'
import { useCardsStore } from '@/stores/cards'
import Card from './Card/Card.vue'
import CardBtns from './CardBtns/CardBtns.vue'
import helpers from '@/helpers'

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()

const isFirstShow = ref(false)
const refreshCardsIds = ref([])
const secondStepCardsIds = ref([])

const isEmptyCards = computed(() => {
	return !cardsStore.getToLearnCards?.length
})
const learnCards = computed(() => {
	const mainCardsStack = cardsStore.getToLearnCards.filter((card) => !refreshCardsIds.value.includes(card.id) && !secondStepCardsIds.value.includes(card.id))
	const refreshCardsStack = cardsStore.getToLearnCards.filter((card) => refreshCardsIds.value.includes(card.id))
	const secondStepCardsStack = cardsStore.getToLearnCards.filter((card) => secondStepCardsIds.value.includes(card.id))

	const lastShuffleCards = helpers.shuffleArray([...refreshCardsStack, ...secondStepCardsStack])
	return [...mainCardsStack, ...lastShuffleCards]
})
const getCurrentCard = computed(() => {
	return learnCards.value[0]
})

watch(learnCards, (nv) => {
	if (!nv.length) {
		delete localStorage.processedCards
		tabsStore.setTab('Home')
	} else {
		localStorage.processedCards = JSON.stringify({
			refreshCardsIds: refreshCardsIds.value,
			secondStepCardsIds: secondStepCardsIds.value
		})
	}
})

onMounted(() => {
	if (localStorage.processedCards) {
		const { refreshCardsIds: refreshLS, secondStepCardsIds: secondStepLS } = JSON.parse(localStorage.processedCards)
		refreshCardsIds.value = refreshLS
		secondStepCardsIds.value = secondStepLS
	}
	if (!cardIsExistInSecondStep(getCurrentCard.value?.id)) speakStore.speak(getCurrentCard.value?.word)
})

const completeCard = async ({ reset }) => {
	const { id: completeCardId, level: completeCardLvl } = getCurrentCard.value

	const { cardInSecondStep } = setCardToSecondStep(completeCardId)
	refreshCardsIds.value = refreshCardsIds.value.filter((id) => id !== completeCardId)

	if (!cardInSecondStep) {
		secondStepCardsIds.value = secondStepCardsIds.value.filter((id) => id !== completeCardId)
		await cardsStore.updateCard(completeCardId, {
			level: completeCardLvl + 1,
			date: new Date().toISOString()
		})
	}

	if (!learnCards.value.length) return

	while(getCurrentCard.value?.id === secondStepCardsIds && secondStepCardsIds.value.length > 1) {
		secondStepCardsIds.value = helpers.shuffleArray(secondStepCardsIds.value)
	}

	reset()
	isFirstShow.value = false
	if (!cardIsExistInSecondStep(getCurrentCard.value?.id)) speakStore.speak(getCurrentCard.value?.word)
}
const setCardToSecondStep = (cardId) => {
	if (!cardIsExistInSecondStep(cardId)) {
		secondStepCardsIds.value.push(cardId)
		return { cardInSecondStep: true }
	}
	return { cardInSecondStep: false }
}
const refreshCard = async ({ reset }) => {
	const { id: refreshCardId, level: refreshCardLvl } = getCurrentCard.value

	if (!cardIsExistInRefreshCards(refreshCardId)) {
		// if (!cardIsExistInSecondStep(refreshCardId)) {
			const level = refreshCardLvl > 1 ? refreshCardLvl - 1 : 1
			await cardsStore.updateCard(refreshCardId, { level })
		// }  //until test on my own

		secondStepCardsIds.value = secondStepCardsIds.value.filter((id) => id !== refreshCardId)
		refreshCardsIds.value.push(refreshCardId)
	}

	while(getCurrentCard.value?.id === refreshCardId && refreshCardsIds.value.length > 1) {
		refreshCardsIds.value = helpers.shuffleArray(refreshCardsIds.value)
	}

	reset()
	isFirstShow.value = false
	if (!cardIsExistInSecondStep(getCurrentCard.value?.id)) speakStore.speak(getCurrentCard.value?.word)
}
const cardClickHandler = () => {
	if (cardIsExistInSecondStep(getCurrentCard.value.id) && !isFirstShow.value) speakStore.speak(getCurrentCard.value?.word)
	isFirstShow.value ||= true
}
const cardIsExistInSecondStep = (id) => secondStepCardsIds.value.includes(id)
const cardIsExistInRefreshCards = (id) => refreshCardsIds.value.includes(id)
</script>

<style lang="scss" scoped>
.card-wrapper {
	margin: auto;
}
</style>
