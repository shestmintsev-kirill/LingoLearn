<template>
	<div>
		<div class="full-width flex justify-center">
			<q-item v-if="authStore.user">
				<q-item-section avatar>
					<q-avatar>
						<img
							:src="authStore.user.photoURL"
							referrerpolicy="no-referrer"
						>
					</q-avatar>
				</q-item-section>
				<q-item-section>
					<q-item-label>{{ authStore.user.displayName }}</q-item-label>
					<q-item-label caption>
						{{ authStore.user.email }}
					</q-item-label>
				</q-item-section>
				<q-item-section>
					<q-btn
						class="q-ml-xl"
						color="grey-6"
						icon="logout"
						@click="logout"
					/>
				</q-item-section>
			</q-item>
		</div>
		<q-select
			v-model="speakStore.currentVoice"
			rounded
			bottom-slots
			:options="speakStore.getPreparedVoices"
			label="Speaker"
		>
			<template v-slot:before>
				<q-icon
					size="32px"
					color="grey"
					class="q-mr-xs"
					name="record_voice_over"
				/>
			</template>
		</q-select>
		<div class="row justify-center align-center no-wrap q-mt-md">
			<q-icon
				class="q-mr-md"
				name="speed"
				color="grey"
				size="32px"
			/>
			<q-slider
				v-model="speakStore.rate"
				class="q-pt-xs"
				:min="0.5"
				:max="2"
				:step="0.1"
				label-always
				:label-value="'Rate: ' + speakStore.rate"
			/>
		</div>
		<div class="row justify-center align-center no-wrap q-mt-lg">
			<q-icon
				class="q-mr-md"
				name="interpreter_mode"
				color="grey"
				size="32px"
			/>
			<q-slider
				v-model="speakStore.pitch"
				class="q-pt-xs"
				:min="0"
				:max="3"
				:step="0.1"
				label-always
				:label-value="'Pitch: ' + speakStore.pitch"
			/>
		</div>
		<q-input
			v-model="text"
			outlined
			bg-color="white"
			class="q-mt-md"
			label="Example for voice checking"
			type="textarea"
		/>
		<div class="flex justify-around q-mt-lg">
			<q-btn
				round
				size="xl"
				color="green"
				icon="play_arrow"
				@click="speakStore.speak(text)"
			/>
			<q-btn
				round
				size="xl"
				color="red"
				icon="stop"
				@click="speakStore.stopSpeck"
			/>
			<q-btn
				round
				size="xl"
				color="primary"
				icon="save"
				@click="speakStore.saveUserSettings"
			/>
		</div>
	</div>
</template>

<script setup>
import { useSpeakStore } from '@/store/speak'
import { useAuthStore } from '@/store/auth'
import { useQuasar } from 'quasar'

const speakStore = useSpeakStore()
const authStore = useAuthStore()
const $q = useQuasar()

const text = "This text is for checking the current speaker's voice"

const logout = () => {
	$q.dialog({
		title: 'Confirm',
		message: 'Are you sure to logout?',
		cancel: true,
		persistent: true
	})
		.onOk(async () => {
			await authStore.logout()
		})
		.onCancel(() => {})
		.onDismiss(() => {})
}

</script>
