<template>
	<div class="column items-center">
		<div class="q-pa-md row q-gutter-md justify-between q-mb-xl full-width">
			<q-card
				:key="index"
				v-for="(widget, index) in widgets"
				dark
				bordered
				class="bg-grey-1 shadow-2"
				@click="openParticularCards(widget)"
			>
				<q-card-section>
					<div
						class="text-h5 flex justify-center"
						:class="widget.color"
					>
						{{ cardsStore[widget.count].length }}
					</div>
				</q-card-section>

				<q-separator inset />

				<q-card-section
					class="flex justify-center"
					:class="widget.color"
				>
					{{ widget.label }}
				</q-card-section>
			</q-card>
		</div>
		<div class="full-width flex justify-center q-mb-xl">
			<q-btn
				class="q-pa-md"
				:style="{ width: '250px' }"
				color="primary"
				rounded
				:disable="!cardsStore.getToLearnCards?.length"
				label="Start"
				@click="cardsStore.getToLearnCards?.length && tabsStore.setTab('Cards')"
			/>
		</div>
		<div class="full-width flex justify-center no-wrap">
			<q-btn-dropdown
				v-model="cardsShow"
				persistent
				color="white"
				unelevated
				label="cards"
				class="full-width select text-grey-8"
			/>
			<q-btn
				round
				class="q-ml-lg"
				color="primary"
				icon="add"
				@click="cardsStore.showAddingCardDialog"
			/>
		</div>
		<transition-group name="scale">
			<div
				v-if="cardsShow"
				class="full-width flex justify-between no-wrap q-mt-sm"
			>
				<q-select
					v-model="cardState"
					dense
					style="min-width: 150px"
					outlined
					bg-color="white"
					:options="cardStates"
					label="Card state"
				/>
				<q-input
					:model-value="searchValue"
					dense
					outlined
					bg-color="white"
					label="Search"
					@update:model-value="toSearchCard"
				/>
			</div>

			<div
				ref="scrollTargetRef"
				v-if="cardsShow && cardsList.length"
				class="list-wrapper full-width q-mt-sm"
			>
				<q-list
					bordered
					class="rounded-borders full-width"
					:style="{ backgroundColor: 'white' }"
				>
					<!-- <q-infinite-scroll
						:offset="200"
						:scroll-target="scrollTargetRef"
						:disable="false"
						@load="onLoadCards"
					> -->
					<template v-slot:loading>
						<div class="row justify-center q-my-md">
							<q-spinner-dots
								color="primary"
								size="40px"
							/>
						</div>
					</template>
					<!-- v-for="card in searchValue ? cardsList : shownCardsList" -->
					<q-item
						:key="card.id"
						v-for="card in cardsList"
						class="card-item q-py-none"
					>
						<q-item-section
							avatar
							class="q-pr-none items-center"
						>
							<q-circular-progress
								show-value
								:class="{ 'text-blue': card.level >= 2 && card.level <= 5, 'text-green': card.level < 2, 'light-orange': card.level > 5 }"
								:value="card.level * 10"
								size="50px"
								:color="card.level < 2 ? 'light-green' : card.level > 5 ? 'light-orange' : 'light-blue'"
								track-color="grey-3"
							>
								{{ card.level }}
							</q-circular-progress>
							<span
								v-if="isNotToLearnCard(card)"
								class="text-caption q-mt-xs"
								:class="card.level < 2 ? 'text-green' : card.level > 5 ? 'text-orange' : 'text-blue'"
							>
								{{ getReturnDate(card) }}
							</span>
						</q-item-section>

						<q-item-section top>
							<q-item-label class="item-label">
								<q-btn
									flat
									round
									@click.stop="speakStore.speak(card.word)"
								>
									<q-icon
										:name="speakStore.isSpeaking && speakStore.speakingText === card.word ? 'stop_circle' : 'play_arrow'"
										:color="speakStore.isSpeaking && speakStore.speakingText === card.word ? 'red' : 'green'"
										size="sm"
									/>
								</q-btn>
								<span class="text-weight-medium">{{ card.word }}</span>
							</q-item-label>
							<q-item-label class="item-label">
								<span class="q-ml-md text-grey-8">{{ card.translate }}</span>
							</q-item-label>
							<q-item-label
								v-if="card.example"
								class="item-label"
								lines="1"
								caption
							>
								<q-btn
									class="q-mr-xs"
									flat
									round
									@click.stop="speakStore.speak(card.example)"
								>
									<q-icon
										:name="speakStore.isSpeaking && speakStore.speakingText === card.example ? 'stop_circle' : 'play_arrow'"
										:color="speakStore.isSpeaking && speakStore.speakingText === card.example ? 'red' : 'green'"
										size="sm"
									/>
								</q-btn>
								<span>{{ card.example }}</span>
							</q-item-label>
						</q-item-section>

						<q-item-section side>
							<q-btn-dropdown
								dense
								rounded
								unelevated
								dropdown-icon="more_vert"
							>
								<q-list>
									<q-item
										:key="index"
										v-for="(cardAction, index) in cardActions"
										v-close-popup
										clickable
										@click="cardAction.handler(card)"
									>
										<q-item-section>
											<q-icon
												size="sm"
												:color="cardAction.color"
												:name="cardAction.icon"
											/>
										</q-item-section>
									</q-item>
								</q-list>
							</q-btn-dropdown>
						</q-item-section>
					</q-item>
					<!-- </q-infinite-scroll> -->
				</q-list>
			</div>
		</transition-group>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCardsStore } from '@/store/cards'
import { useSpeakStore } from '@/store/speak'
import { useTabsStore } from '@/store/tabs'

const cardsStore = useCardsStore()
const tabsStore = useTabsStore()
const speakStore = useSpeakStore()

const cardActions = [
	{ icon: 'edit', color: 'green', handler: (card) => cardsStore.showAddingCardDialog(card) },
	{ icon: 'restart_alt', color: 'orange', handler: (card) => cardsStore.refreshCard(card.id) },
	{ icon: 'delete', color: 'red', handler: (card) => cardsStore.deleteCard(card.id, true) }
]
const cardStates = [
	{ label: 'All', value: '' },
	{ label: 'To Learn', value: 'getToLearnCards' },
	{ label: 'Known', value: 'getKnownCards' },
	{ label: 'Learned', value: 'getLearnedCards' }
]
const widgets = [
	{ label: 'To learn', count: 'getToLearnCards', color: 'text-green-7' },
	{ label: 'Known', count: 'getKnownCards', color: 'text-blue-5' },
	{ label: 'Learned', count: 'getLearnedCards', color: 'text-orange-5' }
]

const scrollTargetRef = ref(null)
const cardsShow = ref(false)
const cardState = ref({ label: 'All', value: '' })
const searchValue = ref('')
const timeout = ref(null) // TODO
const shownCardsList = ref([]) // TODO

const cardsList = computed(() => {
	const { value: state } = cardState.value
	if (!state) return searchValue.value ? cardsStore.getCards.filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore.getCards
	return searchValue.value ? cardsStore[state].filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore[state]
})

const isNotToLearnCard = (card) => !cardsStore.getToLearnCards.find((cardToLearn) => cardToLearn.id === card.id)

const toSearchCard = (value) => { // try to change to useDebounce
	clearTimeout(timeout.value)
	timeout.value = setTimeout(() => {
		if (!searchValue.value || searchValue.value.length >= 3) {
			searchValue.value = value
		} else {
			searchValue.value = ''
		}
	}, 600)
}
const openParticularCards = (widget) => {
	const { count: cardStateFromWidget } = widget
	cardsShow.value = true
	cardState.value = cardStates.find((card) => card.value === cardStateFromWidget)
}
const getReturnDate = (card) => {
	const { interval } = cardsStore.calculateIntervals(card).intervalForLevel

	const cardDate = new Date(card.date)
	const intervalDate = new Date()
	intervalDate.setDate(intervalDate.getDate() - interval)
	const { days, hours, minutes } = cardsStore.getDateTimeBetween(intervalDate, cardDate)

	const prepareTime = (time) => {
		if (time.toString().length === 1) return `0${time}`
		if (!time) return '00'
		return time
	}
	// let finalText = `${minutes} until returns back`
	// if (hours || days) finalText = `${hours} hours ` + finalText
	// if (!days) finalText = `${days} days ` + finalText
	// return `${days}:${prepareTime(hours)}:${prepareTime(minutes)} until returns back`
	return `${days}:${prepareTime(hours)}:${prepareTime(minutes)}`
}

const onLoadCards = (index, done) => { // TODO
	const shownLength = shownCardsList.value.length
	if (shownLength >= cardsList.value.length) return
	setTimeout(() => {

		const newPartOfCards = cardsList.value.slice(shownLength, shownLength + 10)
		shownCardsList.value.push(...newPartOfCards)
		done()
	}, 200)
}
</script>

<style lang="scss" scoped>
.card-item {
	border-bottom: 1px $grey-3 solid;
}

.select {
	max-width: 400px;
	border: 1px $grey-5 solid;
}

.list-wrapper {
	height: calc(100vh - 480px);
	touch-action: auto;
	overflow: auto;
	border-radius: 5px;
}

.item-label {
	max-height: 40px;
	margin-top: 0px !important;
}
</style>
