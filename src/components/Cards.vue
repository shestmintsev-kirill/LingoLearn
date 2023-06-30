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
					>
						<q-card-section class="flex column items-center justify-center">
							<div class="row items-center no-wrap">
								<q-btn
									v-if="!!getCurrentCard?.word && (cardIsExistInSecondStep ? isFirstShow : !isFirstShow)"
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
										v-if="isBlurCard && !cardIsExistInSecondStep"
										class="absolute-center z-top"
										name="visibility"
										color="grey-7"
										size="32px"
										@click.stop="toVisible"
									/>
									<span :class="{ blur: isBlurCard }">
										{{
											isFirstShow
												? getCurrentCard?.[cardIsExistInSecondStep ? 'word' : 'translate'] ?? 'Empty'
												: getCurrentCard?.[cardIsExistInSecondStep ? 'translate' : 'word'] ?? 'Empty'
										}}
									</span>
								</div>
							</div>
							<div
								v-if="!!getCurrentCard?.example && (cardIsExistInSecondStep ? isFirstShow : !isFirstShow)"
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
const learnCards = computed(() => {
	const mainCardsStack = cardsStore.getToLearnCards.filter((card) => !refreshCardsIds.value.includes(card.id) && !secondStepCardsIds.value.includes(card.id))
	const refreshCardsStack = cardsStore.getToLearnCards.filter((card) => refreshCardsIds.value.includes(card.id))
	const secondStepCardsStack = cardsStore.getToLearnCards.filter((card) => secondStepCardsIds.value.includes(card.id))

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = (Math.floor(Math.random() * (i + 1))[(array[i], array[j])] = [array[j], array[i]])
		}
		return array
	} // TODO вынести в helper

	const lastShuffleCards = shuffleArray([...refreshCardsStack, ...secondStepCardsStack])
	return [...mainCardsStack, ...lastShuffleCards]
})
const getCurrentCard = computed(() => {
	return learnCards.value[0]
	// return cardsStore.getCurrentCard
})
const cardIsExistInSecondStep = computed(() => secondStepCardsIds.value.includes(getCurrentCard.value?.id))
const cardIsExistInRefreshCards = computed(() => refreshCardsIds.value.includes(getCurrentCard.value?.id))

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
	const { cardInSecondStep } = setCardToSecondStep()
	refreshCardsIds.value = refreshCardsIds.value.filter((id) => id !== getCurrentCard.value.id)

	if (!cardInSecondStep) {
		await cardsStore.updateCard(getCurrentCard.value.id, {
			level: getCurrentCard.value.level + 1,
			date: new Date().toISOString()
		})
	}

	reset()
	isFirstShow.value = false
	if (!cardIsExistInSecondStep.value) speakStore.speak(getCurrentCard.value?.word)
}

const setCardToSecondStep = () => {
	if (!cardIsExistInSecondStep.value) {
		secondStepCardsIds.value.push(getCurrentCard.value.id)
		return { cardInSecondStep: true }
	}
	return { cardInSecondStep: false }
}

const refreshCard = async ({ reset }) => {
	if (!cardIsExistInRefreshCards.value) {

		if (!cardIsExistInSecondStep.value) {
			const { id, level: cardLvl } = getCurrentCard.value
			const level = cardLvl > 1 ? cardLvl - 1 : 1
			await cardsStore.updateCard(id, { level })
		}

		secondStepCardsIds.value = secondStepCardsIds.value.filter((id) => id !== getCurrentCard.value.id)
		refreshCardsIds.value.push(getCurrentCard.value.id)
	}

	reset()
	isFirstShow.value = false
	if (!cardIsExistInSecondStep.value) speakStore.speak(getCurrentCard.value?.word)
}

const cardClickHandler = () => {
	visibleState.value = true
	isFirstShow.value ||= true
	if (cardIsExistInSecondStep.value) speakStore.speak(getCurrentCard.value?.word)
}
</script>

<style lang="scss" scoped>
.card-wrapper {
	margin: auto;
}
</style>
