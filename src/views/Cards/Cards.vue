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
					v-if="isSecondShowing && !isEmptyCards"
				>
					<q-icon name="done" />
					Complete
				</template>
				<template
					v-slot:right
					v-if="isSecondShowing && !isEmptyCards"
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
						:isSecondShowing="isSecondShowing"
						@clickHandler="cardClickHandler"
					/>
				</transition>
			</q-slide-item>
		</q-list>
		<CardBtns
			:card="getCurrentCard"
			@deleteHandler="() => (isSecondShowing = false)"
		/>
	</div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useSpeakStore } from '@/stores/speak'
import { useTabsStore } from '@/stores/tabs'
import { useCardsStore } from '@/stores/cards'
import Card from './Card/Card.vue'
import CardBtns from './CardBtns/CardBtns.vue'
import helpers from '@/helpers'

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()

const isSecondShowing = ref(false)
const refreshCardsIds = ref([])
const secondStepCardsIds = ref([])

const isEmptyCards = computed(() => {
	return !cardsStore.getToLearnCards?.length
})
const learnCards = computed(() => {
	const mainCardsStack = cardsStore.getToLearnCards.filter(
		(card) => !refreshCardsIds.value.map((el) => el.id).includes(card.id) && !secondStepCardsIds.value.map((el) => el.id).includes(card.id)
	)

	const lastShuffleCards = helpers.shuffleArray([...refreshCardsIds.value, ...secondStepCardsIds.value])
	return [...mainCardsStack, ...lastShuffleCards]
})
const getCurrentCard = computed(() => {
	if (!learnCards.value[0]) return {}
	return { ...learnCards.value[0], id: learnCards.value[0]?.id, isTranslateShow: Math.random() < 0.5 }
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
	nextTick(() => {
		if (!getCurrentCard.value.isTranslateShow) {
			const speakBtn = document.querySelector('.speakBtn')
			speakBtn.click()
		} // TODO Temp for iOS Safari. Calling first speech handler. Should improve!
	})
})

const completeCard = async ({ reset }) => {
	const completeCard = { ...getCurrentCard.value }

	const { cardInSecondStep } = setCardToSecondStep(getCurrentCard.value)
	refreshCardsIds.value = refreshCardsIds.value.filter((card) => card.id !== completeCard.id)

	if (!cardInSecondStep) {
		secondStepCardsIds.value = secondStepCardsIds.value.filter((card) => card.id !== completeCard.id)
		await cardsStore.updateCard(completeCard.id, {
			level: completeCard.level + 1,
			date: new Date().toISOString()
		})
	}

	if (!learnCards.value.length) return

	while (getCurrentCard.value?.id === secondStepCardsIds && secondStepCardsIds.value.length > 1) {
		secondStepCardsIds.value = helpers.shuffleArray(secondStepCardsIds.value)
	}

	reset()
	isSecondShowing.value = false
}
const setCardToSecondStep = (card) => {
	if (!cardIsExistInSecondStep(card.id)) {
		secondStepCardsIds.value.push({ ...card, firstWasTranslate: card.isTranslateShow })
		return { cardInSecondStep: true }
	}
	return { cardInSecondStep: false }
}
const refreshCard = async ({ reset }) => {
	const refreshCard = { ...getCurrentCard.value }

	if (!cardIsExistInRefreshCards(refreshCard.id)) {
		// if (!cardIsExistInSecondStep(refreshCardId)) {
		const level = refreshCard.level > 1 ? refreshCard.level - 1 : 1
		await cardsStore.updateCard(refreshCard.id, { level })
		// }  // until test on my own

		secondStepCardsIds.value = secondStepCardsIds.value.filter((card) => card.id !== refreshCard.id)
		delete refreshCard.firstWasTranslate
		refreshCardsIds.value.push(refreshCard)
	}

	while (getCurrentCard.value?.id === refreshCard.id && refreshCardsIds.value.length > 1) {
		refreshCardsIds.value = helpers.shuffleArray(refreshCardsIds.value)
	}

	reset()
	isSecondShowing.value = false
}
const cardClickHandler = (currentStateOfCard) => {
	if (currentStateOfCard.value === 'translate' && !isSecondShowing.value) speakStore.speak(getCurrentCard.value?.word)
	isSecondShowing.value ||= true
}
const cardIsExistInSecondStep = (id) => secondStepCardsIds.value.map((card) => card.id).includes(id)
const cardIsExistInRefreshCards = (id) => refreshCardsIds.value.map((card) => card.id).includes(id)
</script>

<style lang="scss" scoped>
.card-wrapper {
	margin: auto;
}
</style>
