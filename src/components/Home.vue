<template>
	<div class="column items-center">
		<div class="q-pa-md row q-gutter-md justify-between q-mb-xl full-width">
			<q-card
				:key="index"
				v-for="(widget, index) in widgets"
				dark
				bordered
				class="bg-grey-1 shadow-2"
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
			v-if="cardsShow"
			class="list-wrapper full-width q-mt-sm"
		>
			<q-list
				bordered
				class="rounded-borders full-width"
				:style="{ backgroundColor: 'white' }"
			>
				<q-item
					:key="card.id"
					v-for="card in cardsList"
					class="card-item q-py-none"
				>
					<q-item-section
						avatar
						class="q-pr-none"
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
					</q-item-section>

					<q-item-section top>
						<q-item-label lines="1">
							<q-btn
								flat
								round
								@click.stop="speakStore.speak(card.word)"
							>
								<q-icon
									name="play_arrow"
									color="green"
									size="sm"
								/>
							</q-btn>
							<span class="text-weight-medium">{{ card.word }}</span>
						</q-item-label>
						<q-item-label lines="1">
							<span class="q-ml-md text-grey-8">{{ card.translate }}</span>
						</q-item-label>
						<q-item-label
							caption
							lines="1"
						>
							<q-btn
								class="q-mr-xs"
								flat
								round
								@click.stop="speakStore.speak(card.example)"
							>
								<q-icon
									name="play_arrow"
									color="green"
									size="sm"
								/>
							</q-btn>
							{{ card.example }}
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
									v-close-popup
									clickable
									@click="cardsStore.showAddingCardDialog(card)"
								>
									<q-item-section>
										<q-icon
											size="sm"
											color="green"
											name="edit"
										/>
									</q-item-section>
								</q-item>

								<q-item
									v-close-popup
									clickable
									@click="cardsStore.refreshCard(card.id)"
								>
									<q-item-section>
										<q-icon
											size="sm"
											color="orange"
											name="restart_alt"
										/>
									</q-item-section>
								</q-item>

								<q-item
									v-close-popup
									clickable
									@click="cardsStore.deleteCard(card.id, true)"
								>
									<q-item-section>
										<q-icon
											size="sm"
											color="red"
											name="delete"
										/>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
					</q-item-section>
				</q-item>
			</q-list>
		</div>
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

const cardStates = [
	{ label: 'All', value: '' },
	{ label: 'To Learn', value: 'getToLearnCards' },
	{ label: 'Known', value: 'getKnownCards' },
	{ label: 'Learned', value: 'getLearnedCards' }
]

const widgets = ref([
	{ label: 'To learn', count: 'getToLearnCards', color: 'text-green-7' },
	{ label: 'Known', count: 'getKnownCards', color: 'text-blue-5' },
	{ label: 'Learned', count: 'getLearnedCards', color: 'text-orange-5' }
])

const cardsShow = ref(false)
const cardState = ref('')
const searchValue = ref('')
const timeout = ref(null)

const cardsList = computed(() => {
	const { value: state } = cardState.value
	if (!state) return searchValue.value ? cardsStore.getCards.filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore.getCards
	return searchValue.value ? cardsStore[state].filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore[state]
})

const toSearchCard = (value) => {
	clearTimeout(timeout.value)
	timeout.value = setTimeout(() => {
		if (!searchValue.value || searchValue.value.length >= 3) {
			searchValue.value = value
		} else {
			searchValue.value = ''
		}
	}, 600)
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
</style>
