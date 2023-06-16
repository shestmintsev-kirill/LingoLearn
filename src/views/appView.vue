<template>
	<q-page
		v-show="!loading"
		padding
	>
		<!-- <keep-alive> -->
		<component :is="currentComponent" />
		<!-- </keep-alive> -->
	</q-page>
	<q-page-sticky
		expand
		position="bottom"
	>
		<div class="full-width">
			<q-tabs
				v-model="tabsStore.tab"
				dense
				class="bg-grey-1 text-grey-7 shadow-2 top-index"
				align="justify"
				indicator-color="transparent"
				active-color="black"
			>
				<q-tab
					:disable="!cardsStore.getToLearnCards.length"
					class="q-pa-md"
					name="Cards"
					icon="school"
				>
					<q-badge
						v-if="cardsStore.getToLearnCards.length"
						class="q-mb-lg"
						color="green"
						floating
						rounded
					>
						{{ cardsStore.getToLearnCards.length }}
					</q-badge>
				</q-tab>
				<q-tab
					class="q-pa-md"
					name="Home"
					icon="home"
				/>
				<q-tab
					class="q-pa-md"
					name="Settings"
					icon="settings"
				/>
			</q-tabs>
		</div>
	</q-page-sticky>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useSpeakStore } from '@/store/speak'
import { useTabsStore } from '@/store/tabs'
import { useCardsStore } from '@/store/cards'
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useAuthStore } from '@/store/auth'

const $q = useQuasar()

const speakStore = useSpeakStore()
const tabsStore = useTabsStore()
const cardsStore = useCardsStore()
const authStore = useAuthStore()

const loading = ref(true)

const currentComponent = computed(() => {
	const componentName = tabsStore.tab
	return defineAsyncComponent(() => import(`../components/${componentName}`))
})

onMounted(async () => {
	$q.loading.show({
		spinner: QSpinnerFacebook,
		spinnerSize: 270,
		backgroundColor: 'green',
		message: 'Application initializing...',
		messageColor: 'grey-9'
	})
	await authStore.createUserCollection()
	await speakStore.initUserSettings()
	speakStore.setSpeechSynthesis()
	$q.loading.hide()
	loading.value = false
})
</script>
