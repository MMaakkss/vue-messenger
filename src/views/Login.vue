<template>
	<h1 class="text-center text-zinc-200 text-3xl">Sign In to an account</h1>

	<div class="form max-w-[340px] mt-20 mx-auto">
		<input
				class="block"
				type="text"
				placeholder="Email"
				:class="{ error: invalidEmail }"
				v-model="email"
		/>
		<div class="error-message" v-show="invalidEmail">Invalid e-mail</div>
		<div class="pass mt-3 relative">
			<div class="absolute cursor-pointer top-2/4 fill-zinc-200 -translate-y-2/4 right-3" @click="showPassword = !showPassword">
				<svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M117.2 136C160.3 96 217.6 64 288 64s127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-13.3 32-42.1 80-85.2 120c-43.1 40-100.4 72-170.8 72s-127.7-32-170.8-72C74.1 336 45.3 288 32 256c13.3-32 42.1-80 85.2-120zM288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM192 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>
				<svg v-else xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M25.9 3.4C19-2 8.9-.8 3.4 6.1S-.8 23.1 6.1 28.6l608 480c6.9 5.5 17 4.3 22.5-2.6s4.3-17-2.6-22.5L25.9 3.4zM605.5 268.3c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-51.2 0-96 14.8-133.9 36.8l27.3 21.5C244.6 74.2 280.2 64 320 64c70.4 0 127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-9.2 22.1-25.9 52-49.5 81.5l25.1 19.8c25.6-32 43.7-64.4 53.9-89zM88.4 154.7c-25.6 32-43.7 64.4-53.9 89c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c51.2 0 96-14.8 133.9-36.8l-27.3-21.5C395.4 437.8 359.8 448 320 448c-70.4 0-127.7-32-170.8-72C106.1 336 77.3 288 64 256c9.2-22.1 25.9-52 49.5-81.5L88.4 154.7zM320 384c16.7 0 32.7-3.2 47.4-9.1l-30.9-24.4c-5.4 .9-10.9 1.4-16.5 1.4c-51 0-92.8-39.8-95.8-90.1l-30.9-24.4c-.9 6-1.3 12.2-1.3 18.5c0 70.7 57.3 128 128 128zM448 256c0-70.7-57.3-128-128-128c-16.7 0-32.7 3.2-47.4 9.1l30.9 24.4c5.4-.9 10.9-1.4 16.5-1.4c51 0 92.8 39.8 95.8 90.1l30.9 24.4c.9-6 1.3-12.2 1.3-18.5z"/></svg>
			</div>
			<input
					class="block"
					placeholder="Password"
					:class="{ error: invalidPassword }"
					:type="showInputPassword"
					v-model="password"
			/>
		</div>
		<div class="error-message" v-show="invalidPassword">Min length 6</div>
		<div class="error-message">{{ errMessage }}</div>

		<div
				class="mt-3 mb-2 btn"
				:class="{ disabled: isFormValid }"
				@click="signIn"
		>
			Sign In
		</div>
		<div class="btn mb-2" @click="signInWithGoogle">Sign In With Google</div>
		<router-link class="btn block" to="/register">Create An Account</router-link>
	</div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { emailValidation, passwordValidation } from "@/Composables/formValidaion.js";
import { signWithGoogle } from "@/Composables/signInWithGoogle.js";

const router = useRouter();

const email = ref("");
const password = ref("");
const errMessage = ref("");

let showPassword = ref(false);
let invalidEmail = ref(false);
let invalidPassword = ref(false);

const showInputPassword = computed(() => (showPassword.value ? "text" : "password"));
const isFormValid = computed(() => invalidEmail.value || invalidPassword.value || !password.value.length || !email.value.length);

const signIn = () => {
	if (isFormValid.value) return;

	signInWithEmailAndPassword(getAuth(), email.value, password.value)
		.then(() => router.push("/"))
		.catch((error) => {
			switch (error.code) {
				case "auth/invalid-email":
					errMessage.value = "Invalid email";
					break;
				case "auth/user-not-found":
					errMessage.value = "User not found";
					break;
				case "auth/wrong-password":
					errMessage.value = "Wrong password";
					break;
				default:
					errMessage.value = "Email or password was incorrect";
					break;
			}
		});
};

const signInWithGoogle = () => {
	signWithGoogle().then(res => {
		if (res.success) {
			router.push("/")
		}
	});
};

watch(email, () => invalidEmail.value = emailValidation(email.value));

watch(password, () => invalidPassword.value = passwordValidation(password.value));
</script>
