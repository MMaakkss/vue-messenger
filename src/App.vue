<template>
	<header class="h-14 fixed top-0 left-0 right-0 bg-sky-500 z-40">
		<div class="container flex items-center justify-between h-full">
			<router-link class="text-2xl logo fill-white" to="/">
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M192 416c0-17.7-14.3-32-32-32H64c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H309.3c-6.9 0-13.7 2.2-19.2 6.4L192 464V416zM64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h64 32v32 48c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zm80 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H368c8.8 0 16-7.2 16-16s-7.2-16-16-16H144zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16H272c8.8 0 16-7.2 16-16s-7.2-16-16-16H144z"/></svg>
			</router-link>
			<div class="gap-3 flex text-white">
				<template v-if="!isLoggedIn">
					<router-link class="link" to="/register">Sign Up</router-link>
					<router-link class="link" to="/login">Sign In</router-link>
				</template>
				<template v-else>
					<div class="">{{ userName }}</div>
					<div class="link" @click="handleSignOut">Sign Out</div>
				</template>
			</div>
		</div>
	</header>
	<div class="mt-14">
		<router-view />
	</div>
</template>

<script setup>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const isLoggedIn = ref(false);

const route = useRoute();
const router = useRouter();

const userName = ref("");

let auth;
onMounted(() => {
	auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn.value = true;
			userName.value = user.email;
		} else {
			isLoggedIn.value = false;
		}
	});
});

const handleSignOut = () => {
	signOut(auth).then(() => {
		if (route.name === "home" || route.name === "chat") router.push("/login");
	});
};
</script>

<style scoped>
.router-link-active {
	@apply text-zinc-300 cursor-default
}

.logo {
    cursor: pointer !important;
}
</style>
