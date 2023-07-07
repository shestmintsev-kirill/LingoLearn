<template>
	<div class="column items-center">
		<div class="q-pa-md row q-gutter-md justify-between q-mb-xl full-width">
			<CardsCountWidget
				:key="index"
				v-for="(widget, index) in common.widgets"
				:color="widget.color"
				:count="cardsStore[widget.count].length"
				:label="widget.label"
				@click="openParticularCards(widget)"
			/>
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
		<CardsSection
			:cardsShow="cardsShow"
			:cardState="cardState"
			@cardsShowUpdate="(value) => cardsShow = value"
			@cardsStateUpdate="(value) => cardState = value"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { useTabsStore } from '@/stores/tabs'
import CardsCountWidget from './CardsCountWidget/CardsCountWidget.vue'
import CardsSection from './CardsSection/CardsSection.vue'
import common from '@/common'

const cardsStore = useCardsStore()
const tabsStore = useTabsStore()

const cardsShow = ref(false)
const cardState = ref({ label: 'All', value: '' })

const openParticularCards = (widget) => {
	const { count: cardStateFromWidget } = widget
	cardsShow.value ||= true
	cardState.value = common.cardStates.find((card) => card.value === cardStateFromWidget)
}
</script>

<style lang="scss" scoped></style>
