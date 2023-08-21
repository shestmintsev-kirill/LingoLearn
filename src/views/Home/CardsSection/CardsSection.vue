<template>
	<div class="full-width flex justify-center no-wrap">
		<q-btn-dropdown
			:model-value="cardsShow"
			persistent
			color="white"
			unelevated
			label="cards"
			class="full-width select text-grey-8"
			@update:model-value="updateShowCardsTrigger"
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
				@update:model-value="(value) => emits('cardsStateUpdate', value)"
			/>
			<q-checkbox
				v-model="lvlSortValue"
				label="level"
				color="primary"
				class="q-mr-md"
				toggle-indeterminate
				indeterminate-value="high"
				checked-icon="arrow_upward"
				unchecked-icon="arrow_upward"
				indeterminate-icon="arrow_downward"
			/>
			<q-input
				:model-value="searchValue"
				dense
				outlined
				bg-color="white"
				label="Search"
				@update:model-value="toSearchCard"
			>
				<template
					v-slot:append
					v-if="searchValue.length"
				>
					<q-icon
						name="close"
						size="xs"
						class="cursor-pointer"
						@click="searchValue = ''"
					/>
				</template>
			</q-input>
		</div>

		<div
			ref="listOfCardsRef"
			v-if="cardsShow && cardsList.length"
			class="list-wrapper full-width q-mt-sm"
		>
			<q-list
				bordered
				class="rounded-borders full-width"
				:style="{ backgroundColor: 'white' }"
			>
				<CardItem
					:key="card.id"
					v-for="card in shownCardsList"
					v-intersection="onIntersection"
					:data-id="card.id"
					:card="card"
					@deleteAction="deleteHandler"
					@updateAction="resetCardsList"
				/>
				<!-- loader for async data fetching -->
				<div
					v-if="shownCardsList.length < cardsList.length"
					class="row justify-center"
				>
					<q-spinner-dots
						color="primary"
						size="40px"
					/>
				</div>
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
import { computed, ref, watch } from 'vue'
import { useCardsStore } from '@/stores/cards'
import CardItem from '../CardItem/CardItem.vue'
import common from '@/common'

const emits = defineEmits(['cardsShowUpdate', 'cardsStateUpdate'])
const props = defineProps({
	cardsShow: { type: Boolean, default: false },
	cardState: { type: Object, default: () => ({ label: 'All', value: '' }) }
})

const cardsStore = useCardsStore()
const listOfCardsRef = ref(null)
const searchValue = ref('')
const timeout = ref(null) // TODO
const shownCardsList = ref([]) // TODO
const countForUpload = 10
const lvlSortValue = ref(false)
const isIntersectingDisable = ref(false) // TODO rewrite to better solution

const cardsList = computed(() => {
	const { value: state } = props.cardState
	let list
	if (!state) {
		list = searchValue.value
			? cardsStore.getCards.filter(
					(card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase()) || card.translate.toLowerCase().includes(searchValue.value.toLowerCase())
			  )
			: cardsStore.getCards
	} else {
		list = searchValue.value ? cardsStore[state].filter((card) => card.word.toLowerCase().includes(searchValue.value.toLowerCase())) : cardsStore[state]
	}

	// TODO to improve performance
	if (lvlSortValue.value === true) return list.toSorted((a, b) => a.level - b.level)
	else if (lvlSortValue.value === 'high') return list.toSorted((a, b) => b.level - a.level)
	else return list
})

watch(cardsList, () => {
	resetCardsList()
})

const resetCardsList = () => {
	shownCardsList.value = []
	if (listOfCardsRef.value?.scrollTop) listOfCardsRef.value.scrollTop = 0
	const shownLength = shownCardsList.value.length
	shownCardsList.value = cardsList.value.filter((card, index) => index >= shownLength && index < shownLength + countForUpload)
}

const toSearchCard = (value) => {
	// try to change to useDebounce
	clearTimeout(timeout.value)
	timeout.value = setTimeout(() => {
		searchValue.value = value
	}, 600)
}

const onIntersection = (entry) => {
	if (isIntersectingDisable.value) return // TODO rewrite to better solution
	if (entry.isIntersecting && entry.target.dataset.id === shownCardsList.value.at(-1).id) {
		const shownLength = shownCardsList.value.length
		const newPartOfCards = cardsList.value.filter((card, index) => index >= shownLength && index < shownLength + countForUpload)
		shownCardsList.value.push(...newPartOfCards)
	}
}

const updateShowCardsTrigger = (isShowValue) => {
	emits('cardsShowUpdate', isShowValue)
	if (isShowValue) {
		resetCardsList()

		// TODO rewrite to better solution
		isIntersectingDisable.value = true
		setTimeout(() => {
			isIntersectingDisable.value = false
		}, 1000)
	}
}

const deleteHandler = (cardId) => (shownCardsList.value = shownCardsList.value.filter((card) => card.id !== cardId))
</script>

<style lang="scss" scoped>
.select {
	max-width: 400px;
	border: 1px $grey-5 solid;
}

.list-wrapper {
	height: calc(100svh - 480px);
	touch-action: auto;
	overflow: auto;
	border-radius: 5px;
}
</style>
