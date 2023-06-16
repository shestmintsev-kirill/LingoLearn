<template>
	<div
		class="q-pa-md card-wrapper"
		style="max-width: 90%"
	>
		<q-list
			bordered
			separator
		>
			<div class="absolute-top-right text-h4 q-mr-md">
				{{ cardsStore.getToLearnCards?.length }}
			</div>
			<q-slide-item
				right-color="red"
				@left="completeCard"
				@right="refreshCard"
			>
				<template
					v-slot:left
					v-if="firstStep && !isEmptyCards"
				>
					<q-icon name="done" />
					Complete
				</template>
				<template
					v-slot:right
					v-if="firstStep && !isEmptyCards"
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
						style="height: 80vh"
						@click="cardClickHandler"
					>
						<q-card-section class="flex column items-center justify-center">
							<div class="row">
								<q-icon
									v-if="!!getCurrentCard?.word && !firstStep"
									class="q-mr-md"
									name="play_arrow"
									color="green"
									size="32px"
									@click.stop="speakStore.speak(getCurrentCard.word)"
								/>
								<div class="text-h6 relative-position">
									<q-icon
										v-if="isBlurCard"
										class="absolute-center z-top"
										name="visibility"
										color="grey-7"
										size="32px"
										@click.stop="toVisible"
									/>
									<span :class="{ blur: isBlurCard }">
										{{ firstStep ? getCurrentCard?.translate ?? 'Empty' : getCurrentCard?.word ?? 'Empty' }}
									</span>
								</div>
							</div>
							<div
								v-if="!!getCurrentCard?.example"
								class="row q-mt-md"
							>
								<q-icon
									class="q-mr-md"
									name="play_arrow"
									color="green"
									size="24px"
									@click.stop="speakStore.speak(getCurrentCard.example)"
								/>
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
import { computed, onMounted, ref } from 'vue'
import { useSpeakStore } from '@/store/speak'
import { useTabsStore } from '@/store/tabs'
import { useCardsStore } from '@/store/cards'

const cardActions = [
	{ icon: 'add', color: 'blue-5', handler: () => cardsStore.showAddingCardDialog() },
	{ icon: 'edit', color: 'green-5', handler: () => cardsStore.showAddingCardDialog(getCurrentCard.value) },
	{ icon: 'restart_alt', color: 'orange-5', handler: () => cardsStore.refreshCard(getCurrentCard.value.id) },
	{ icon: 'delete', color: 'red-5', handler: () => cardsStore.deleteCard(getCurrentCard.value.id, true) }
]

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()

const firstStep = ref(false)
const visibleState = ref(true)
const refreshCardsIds = ref([])

const isEmptyCards = computed(() => {
	// const mainCardsStack = cardsStore.getToLearnCards.filter(card => )
	return !cardsStore.getToLearnCards?.length
})

const isBlurCard = computed(() => {
	return !firstStep.value && getCurrentCard.value?.level > 3 && visibleState.value
})

const learnCards = computed(() => {
	const mainCardsStack = cardsStore.getToLearnCards.filter((card) => !refreshCardsIds.value.includes(card.id))
	const refreshCardsStack = cardsStore.getToLearnCards.filter((card) => refreshCardsIds.value.includes(card.id))
	return [...mainCardsStack, ...refreshCardsStack]
})

const getCurrentCard = computed(() => {
	return learnCards.value[0]
	// return cardsStore.getCurrentCard
})

onMounted(() => {
	speakStore.speak(getCurrentCard.value?.word)
})

const toVisible = () => {
	visibleState.value = false
}

const completeCard = async ({ reset }) => {
	// await cardsStore.learnCard()
	refreshCardsIds.value = refreshCardsIds.value.filter((id) => id !== getCurrentCard.value.id)
	await cardsStore.updateCard(getCurrentCard.value.id, {
		level: getCurrentCard.value.level + 1,
		date: new Date().toISOString()
	})
	reset()
	if (!cardsStore.getToLearnCards.length) tabsStore.setTab('Home')
	firstStep.value = false
	speakStore.speak(getCurrentCard.value?.word)
}

const refreshCard = async ({ reset }) => {
	if (!refreshCardsIds.value.includes(getCurrentCard.value.id)) {
		refreshCardsIds.value.push(getCurrentCard.value.id)
	}
	const { id, level: cardLvl } = getCurrentCard.value
	const level = cardLvl > 1 ? cardLvl - 1 : 1
	await cardsStore.updateCard(id, { level })
	reset()
	firstStep.value = false
	speakStore.speak(getCurrentCard.value?.word)
}

const cardClickHandler = () => {
	visibleState.value = true
	firstStep.value ||= true
}
</script>

<style lang="scss" scoped>
.card-wrapper {
	margin: auto;
	max-width: 500px;
}

.blur {
	filter: blur(5px);
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.fadeIn {
	animation-name: fadeIn;
}

@keyframes fadeOut {
	from {
		opacity: 1;
	}

	to {
		opacity: 0;
	}
}

.fadeOut {
	animation-name: fadeOut;
}
</style>
