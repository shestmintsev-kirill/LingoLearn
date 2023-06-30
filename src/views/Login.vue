<template>
	<q-page class="flex flex-center light-blue-1">
		<q-card
			class="q-pb-md shadow-2 my_card"
			bordered
		>
			<q-card-section class="q-pa-none">
				<q-tabs
					v-model="authMode"
					no-caps
				>
					<q-tab
						:ripple="false"
						name="login"
						label="Log in"
					/>
					<q-tab
						:ripple="false"
						name="register"
						label="Register"
					/>
				</q-tabs>
				<q-separator />
			</q-card-section>
			<div
				class="q-px-md"
				:class="{ 'q-mt-xl': !isLogin }"
			>
				<q-card-section
					v-if="isLogin"
					class="text-center"
				>
					<div class="text-grey-9 text-h5 text-weight-bold q-mb-lg">Log in to your account</div>
					<div class="row justify-center q-gutter-md">
						<q-btn
							unelevated
							color="grey-2"
							@click="authStore.sighWithGoogle"
						>
							<q-img
								width="25px"
								height="25px"
								src="@/assets/google-icon.svg"
								alt="Google Icon"
							/>
						</q-btn>
					</div>
				</q-card-section>
				<q-card-section class="q-pt-xs">
					<div
						v-if="isLogin"
						class="text-grey-9"
					>
						Or log in with an email
					</div>
					<q-input
						v-model="email"
						class="q-mt-md"
						color="grey-8"
						dense
						outlined
						label="Email Address"
					/>
					<q-input
						v-model="password"
						dense
						color="grey-8"
						outlined
						class="q-mt-md"
						label="Password"
						:type="isPwd ? 'password' : 'text'"
					>
						<template v-slot:append>
							<q-icon
								:name="isPwd ? 'visibility_off' : 'visibility'"
								class="cursor-pointer"
								@click="isPwd = !isPwd"
							/>
						</template>
					</q-input>
					<div
						v-if="isLogin"
						class="text-grey-9 q-mt-md cursor-pointer"
						style="text-decoration: underline"
					>
						Forgot your password?
					</div>
				</q-card-section>
				<q-card-section class="q-pt-none">
					<q-btn
						color="dark"
						size="md"
						:label="isLogin ? 'Log in' : 'Register'"
						no-caps
						class="full-width"
						@click="login"
					/>
				</q-card-section>
			</div>
		</q-card>
	</q-page>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { computed, ref } from 'vue'

const email = ref('')
const password = ref('')
const isPwd = ref(true)
const authMode = ref('login')

const isLogin = computed(() => authMode.value === 'login')

const login = () => {
	const auth = getAuth()
	const authHandler = isLogin.value ? signInWithEmailAndPassword : createUserWithEmailAndPassword
	authHandler(auth, email.value, password.value)
		.then((userCredential) => {
			if (!isLogin.value) sendEmailVerification(userCredential.user)
		})
		.catch((err) => {
			console.error(err.code)
		})
}

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
.my_card {
	width: 80vw;
	max-width: 500px;
	min-width: 250px;
	min-height: 433px;
	border-radius: 8px;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
