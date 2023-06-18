<template>
	<q-page class="flex flex-center light-blue-1">
		<q-card
			class="q-pa-md shadow-2 my_card"
			bordered
		>
			<q-item v-if="authStore.user">
				<q-item-section avatar>
					<q-avatar>
						<img :src="authStore.user.photoURL" >
					</q-avatar>
				</q-item-section>

				<q-item-section>
					<q-item-label>{{ authStore.user.displayName }}</q-item-label>
					<q-item-label caption>
						{{ authStore.user.email }}
					</q-item-label>
				</q-item-section>
			</q-item>

			<q-card-section class="text-center">
				<div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
				<div class="text-grey-8">Sign in below to access your account</div>
			</q-card-section>
			<q-card-section>
				<q-btn
					color="dark"
					rounded
					size="md"
					label="Sign In with Google"
					no-caps
					class="full-width"
					@click="authStore.sighWithGoogle"
				/>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
.my_card {
	max-width: 300px;
	border-radius: 8px;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
