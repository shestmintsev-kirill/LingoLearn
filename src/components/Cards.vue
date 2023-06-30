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
					<q-card
						class="my-card bg-grey-1 flex justify-center"
						style="height: calc(100vh - 180px)"
						@click="cardClickHandler"
						@touchmove="cardClickHandler"
					>
						<q-card-section class="flex column items-center justify-center">
							<div class="row items-center no-wrap">
								<q-btn
									v-if="!!getCurrentCard?.word && (cardIsExistInSecondStep(getCurrentCard.id) ? isFirstShow : !isFirstShow)"
									flat
									round
									@click.stop="speakStore.speak(getCurrentCard.word)"
								>
									<q-icon
										:name="speakStore.isSpeaking && speakStore.speakingText === getCurrentCard.word ? 'stop_circle' : 'play_arrow'"
										:color="speakStore.isSpeaking && speakStore.speakingText === getCurrentCard.word ? 'red' : 'green'"
										size="32px"
									/>
								</q-btn>
								<div class="text-h6 relative-position text-center">
									<q-icon
										v-if="isBlurCard && !cardIsExistInSecondStep(getCurrentCard.id)"
										class="absolute-center z-top"
										name="visibility"
										color="grey-7"
										size="32px"
										@click.stop="toVisible"
									/>
									<span :class="{ blur: isBlurCard }">
										{{
											isFirstShow
												? getCurrentCard?.[cardIsExistInSecondStep(getCurrentCard.id) ? 'word' : 'translate'] ?? 'Empty'
												: getCurrentCard?.[cardIsExistInSecondStep(getCurrentCard.id) ? 'translate' : 'word'] ?? 'Empty'
										}}
									</span>
								</div>
							</div>
							<div
								v-if="!!getCurrentCard?.example && (cardIsExistInSecondStep(getCurrentCard.id) ? isFirstShow : !isFirstShow)"
								class="row q-mt-md items-center no-wrap"
							>
								<q-btn
									flat
									round
									@click.stop="speakStore.speak(getCurrentCard.example)"
								>
									<q-icon
										:name="speakStore.isSpeaking && speakStore.speakingText === getCurrentCard.example ? 'stop_circle' : 'play_arrow'"
										:color="speakStore.isSpeaking && speakStore.speakingText === getCurrentCard.example ? 'red' : 'green'"
										size="24px"
									/>
								</q-btn>
								<div
									class="text-subtitle2"
									:class="{ blur: isBlurCard }"
								>
									{{ getCurrentCard.example }}
								</div>
							</div>
						</q-card-section>
					</q-card>
				</transition>
			</q-slide-item>
		</q-list>
		<div class="row justify-between q-mt-md">
			<q-btn
				:key="index"
				v-for="(btn, index) in cardActions"
				round
				size="lg"
				:color="btn.color"
				:icon="btn.icon"
				@click="btn.handler"
			/>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useSpeakStore } from '@/store/speak'
import { useTabsStore } from '@/store/tabs'
import { useCardsStore } from '@/store/cards'

const cardActions = [
	{ icon: 'add', color: 'blue-5', handler: () => cardsStore.showAddingCardDialog() },
	{ icon: 'edit', color: 'green-5', handler: () => cardsStore.showAddingCardDialog(getCurrentCard.value) },
	{ icon: 'restart_alt', color: 'orange-5', handler: () => cardsStore.refreshCard(getCurrentCard.value.id) },
	{
		icon: 'delete',
		color: 'red-5',
		handler: () => {
			cardsStore.deleteCard(getCurrentCard.value.id, true, async () => {
				isFirstShow.value = false
				speakStore.speak(getCurrentCard.value?.word)
			})
		}
	}
]

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()

const isFirstShow = ref(false)
const visibleState = ref(false)
const refreshCardsIds = ref([])
const secondStepCardsIds = ref([])

const isEmptyCards = computed(() => {
	return !cardsStore.getToLearnCards?.length
})
const isBlurCard = computed(() => {
	return !isFirstShow.value && getCurrentCard.value?.level > 3 && visibleState.value
})

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
} // TODO вынести в helper

const learnCards = computed(() => {
	const mainCardsStack = cardsStore.getToLearnCards.filter((card) => !refreshCardsIds.value.includes(card.id) && !secondStepCardsIds.value.includes(card.id))
	const refreshCardsStack = cardsStore.getToLearnCards.filter((card) => refreshCardsIds.value.includes(card.id))
	const secondStepCardsStack = cardsStore.getToLearnCards.filter((card) => secondStepCardsIds.value.includes(card.id))

	const lastShuffleCards = shuffleArray([...refreshCardsStack, ...secondStepCardsStack])
	// return [...mainCardsStack, ...refreshCardsStack, ...secondStepCardsStack]
	return [...mainCardsStack, ...lastShuffleCards]
})
const getCurrentCard = computed(() => {
	return learnCards.value[0]
	// return cardsStore.getCurrentCard
})

watch(learnCards, (nv) => {
	if (!nv.length) tabsStore.setTab('Home')
})

onMounted(() => {
	speakStore.speak(getCurrentCard.value?.word)
})

const toVisible = () => {
	visibleState.value = false
}

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
		secondStepCardsIds.value = shuffleArray(secondStepCardsIds.value)
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
		if (!cardIsExistInSecondStep(refreshCardId)) {
			const level = refreshCardLvl > 1 ? refreshCardLvl - 1 : 1
			await cardsStore.updateCard(refreshCardId, { level })
		}

		secondStepCardsIds.value = secondStepCardsIds.value.filter((id) => id !== refreshCardId)
		refreshCardsIds.value.push(refreshCardId)
	}

	while(getCurrentCard.value?.id === refreshCardId && refreshCardsIds.value.length > 1) {
		refreshCardsIds.value = shuffleArray(refreshCardsIds.value)
	}

	reset()
	isFirstShow.value = false
	if (!cardIsExistInSecondStep(getCurrentCard.value?.id)) speakStore.speak(getCurrentCard.value?.word)
}

const cardClickHandler = () => {
	visibleState.value = true
	isFirstShow.value ||= true
	if (cardIsExistInSecondStep(getCurrentCard.value.id)) speakStore.speak(getCurrentCard.value?.word)
}

const cardIsExistInSecondStep = (id) => secondStepCardsIds.value.includes(id)
const cardIsExistInRefreshCards = (id) => refreshCardsIds.value.includes(id)
</script>

<style lang="scss" scoped>
.card-wrapper {
	margin: auto;
}
</style>
