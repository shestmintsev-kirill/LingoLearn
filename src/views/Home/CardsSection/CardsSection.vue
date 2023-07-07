<template>
	<div class="full-width flex justify-center no-wrap">
		<q-btn-dropdown
			:model-value="cardsShow"
			persistent
			color="white"
			unelevated
			label="cards"
			class="full-width select text-grey-8"
			@update:model-value="(value) => $emit('cardsShowUpdate', value)"
		/>
		<q-btn
			round
			class="q-ml-lg"
			color="primary"
			icon="add"
			@click="cardsStore.showAddingCardDialog()"
		/>
	</div>
	<transition-group name="scale">
		<div
			v-if="cardsShow"
			class="full-width flex justify-between no-wrap q-mt-sm"
		>
			<q-select
				:model-value="cardState"
				dense
				style="min-width: 150px"
				outlined
				bg-color="white"
				:options="common.cardStates"
				label="Card state"
				@update:model-value="(value) => $emit('cardsStateUpdate', value)"
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
				<!-- <template v-slot:loading>
						<div class="row justify-center q-my-md">
							<q-spinner-dots
								color="primary"
								size="40px"
							/>
						</div>
					</template> -->
				<!-- v-for="card in searchValue ? cardsList : shownCardsList" -->
				<CardItem
					:key="card.id"
					v-for="card in cardsList"
					:card="card"
				/>
				<!-- </q-infinite-scroll> -->
			</q-list>
		</div>
		<span
			v-if="!cardsList.length"
			class="q-mt-md text-weight-regular"
		>
			Cards wasn't found 🤷‍♂️
		</span>
	</transition-group>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCardsStore } from '@/stores/cards'
import CardItem from '../CardItem/CardItem.vue'
import common from '@/common'

defineEmits(['cardsShowUpdate', 'cardsStateUpdate'])
const props = defineProps({
	cardsShow: { type: Boolean, default: false },
	cardState: { type: Object, default: () => ({ label: 'All', value: '' }) }
})

const cardsStore = useCardsStore()

const scrollTargetRef = ref(null)
const searchValue = ref('')
const timeout = ref(null) // TODO
const shownCardsList = ref([]) // TODO

const cardsList = computed(() => {
	const { value: state } = props.cardState
	if (!state)
		return searchValue.value
			? cardsStore.getCards.filter(
					(card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase()) || card.translate.toLowerCase().includes(searchValue.value.toLowerCase())
			  )
			: cardsStore.getCards
	// TODO improve performance
	return searchValue.value ? cardsStore[state].filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore[state]
})

const toSearchCard = (value) => {
	// try to change to useDebounce
	clearTimeout(timeout.value)
	timeout.value = setTimeout(() => {
		searchValue.value = value
	}, 600)
}

const onLoadCards = (index, done) => {
	// TODO
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
