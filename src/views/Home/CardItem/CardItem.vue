<template>
	<q-item class="card-item q-py-none">
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
			<q-item-label
				class="item-label"
				:class="{ 'q-mb-sm': !card.example }"
			>
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
</template>

<script setup>
import { useCardsStore } from '@/stores/cards'
import { useSpeakStore } from '@/stores/speak'
import helpers from '@/helpers'

const cardActions = [
	{ icon: 'edit', color: 'green', handler: (card) => cardsStore.showAddingCardDialog(card) },
	{ icon: 'restart_alt', color: 'orange', handler: (card) => cardsStore.refreshCard(card.id) },
	{ icon: 'delete', color: 'red', handler: (card) => cardsStore.deleteCard(card.id, true) }
]

defineProps({
	card: { type: Object, required: true, default: () => ({ word: '', translate: '', example: '' }) }
})

const cardsStore = useCardsStore()
const speakStore = useSpeakStore()

const isNotToLearnCard = (card) => !cardsStore.getToLearnCards.find((cardToLearn) => cardToLearn.id === card.id)

const getReturnDate = (card) => {
	const { interval } = cardsStore.calculateIntervals(card).intervalForLevel

	const cardDate = new Date(card.date)
	const intervalDate = new Date()
	intervalDate.setDate(intervalDate.getDate() - interval)
	const { days, hours, minutes } = helpers.getDateTimeBetween(intervalDate, cardDate)

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
</script>

<style lang="scss" scoped>
.card-item {
	border-bottom: 1px $grey-3 solid;
}

.item-label {
	max-height: 40px;
	margin-top: 0px !important;
}
</style>
