<template>
	<div class="w-1/2 m-auto flex flex-col chat-wrapper">
		<div class="flex justify-between">
			<div class="btn flex gap-2 items-center fill-white" @click="$router.push('/')">
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M4.7 244.7c-6.2 6.2-6.2 16.4 0 22.6l144 144c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L54.6 272 496 272c8.8 0 16-7.2 16-16s-7.2-16-16-16L54.6 240 171.3 123.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-144 144z"/></svg>
				Go back
			</div>
			<div
					class="btn flex gap-2 items-center fill-white"
					@click="showModalWindow = true"
			>
				Invite friend
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M240 64c0-8.8-7.2-16-16-16s-16 7.2-16 16V240H32c-8.8 0-16 7.2-16 16s7.2 16 16 16H208V448c0 8.8 7.2 16 16 16s16-7.2 16-16V272H416c8.8 0 16-7.2 16-16s-7.2-16-16-16H240V64z"/></svg>
			</div>
		</div>
		<div class="flex-1 overflow-auto my-4" v-if="chatData">
			<div
					v-for="item in chatData.messages"
					:key="item.authorId + item.date + item.message"
					:class="{'text-right': item.authorId === getAuth().currentUser.uid}"
			>
				{{ item.author }}: {{ item.message }}
			</div>
		</div>
		<input type="text" placeholder="Enter message" v-model="message" />
		<div class="btn mt-3" @click="sendMessage">Enter</div>
		<TransitionGroup name="modal">
			<ModalWindow
					v-if="showModalWindow"
					:show-error-message="false"
					@close-modal="closeModalWindow"
			>
				<div class="mb-2">Use this id to invite friends in chat:</div>
				<div class="border-2 rounded-lg flex items-center" :class="{'border-green-500': isCopied}">
					<div class="px-4 py-1 border-r-2" :class="{'border-green-500': isCopied}">{{ $route.params.id }}</div>
					<div
							class="px-3 cursor-pointer h-full"
							@click="copyId"
							v-if="!isCopied"
					>
						<svg class="w-[19.5px]" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M448 352H288c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32H396.1c4.2 0 8.3 1.7 11.3 4.7l67.9 67.9c3 3 4.7 7.1 4.7 11.3V320c0 17.7-14.3 32-32 32zM497.9 81.9L430.1 14.1c-9-9-21.2-14.1-33.9-14.1H288c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H224c35.3 0 64-28.7 64-64V416H256v32c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32H192V128H64z"/></svg>
					</div>
					<div class="px-3 cursor-pointer fill-green-500 h-full" v-else>
						<svg class="h-[22px]" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z"/></svg>
					</div>
				</div>
			</ModalWindow>
		</TransitionGroup>
	</div>
</template>

<script setup>
const ModalWindow = defineAsyncComponent(() =>
	import("@/components/ModalWindow.vue")
);

import { collection, doc, onSnapshot, where, query, updateDoc, documentId, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const route = useRoute();
const router = useRouter();

let showModalWindow = ref(false);
let isCopied = ref(false);
const message = ref("");
const chatData = ref(null);

const chatsCollectionsRef = collection(db, "chats");
const chatsCollectionsQuery = query(chatsCollectionsRef, where(documentId(), "==", route.params.id));

const sendMessage = async () => {
	const messageString = message.value;
	message.value = "";
	const date = Date.now();
	await updateDoc(doc(db, "chats", route.params.id), {
		date: date,
		messages: [
			...chatData.value.messages,
			{
				author: getAuth().currentUser.displayName || getAuth().currentUser.email,
				authorId: getAuth().currentUser.uid,
				date: Date.now(),
				message: messageString,
			},
		],
	});
};

const copyId = () => {
	navigator.clipboard.writeText(route.params.id);
	isCopied.value = true;
};

const closeModalWindow = () => {
	showModalWindow.value = false;
	isCopied.value = false;
};

onMounted(() => {
	onSnapshot(chatsCollectionsQuery, (querySnapshot) => {
		const chatArray = [];
		querySnapshot.forEach((doc) => {
			const chat = {
				id: doc.id,
				...doc.data(),
			};
			chatArray.push(chat);
			console.log(chat);
		});

		if (chatArray.length) {
			chatData.value = chatArray[0];
		} else {
			router.push("/");
		}
	});
});
</script>

<style scoped>
.chat-wrapper {
    height: calc(100vh - 7.5rem);
}
</style>
