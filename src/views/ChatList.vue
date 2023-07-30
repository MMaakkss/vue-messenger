<template>
	<div class="max-w-[540px] m-auto">
		<div class="flex flex-col lg:flex-row gap-3 items-center mb-5 lg:mb-3">
			<input class="flex-1" type="text" placeholder="New chat name" v-model="newChatName" />
			<div class="btn w-full flex-1" @click="createNewChat">Create New Chat</div>
		</div>
		<div class="flex gap-3 flex-col lg:flex-row items-center mb-5 lg:mb-3">
			<input class="flex-1" type="text" placeholder="Enter chat's id" v-model="joinChatId" />
			<div class="btn w-full flex-1" @click="joinChat">Join Chat</div>
		</div>
		<div class="relative mb-4">
			<input type="text" placeholder="Search chat" v-model="search" />
			<svg class="absolute top-2/4 fill-zinc-200 -translate-y-2/4 right-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z"/></svg>
		</div>
		<div>

		</div>
		<div class="text-center text-zinc-200" v-show="!chatsOutput.length && search.length">
			No Chats: <span class="italic">{{ search }}</span>
		</div>
		<div class="text-zinc-200 text-center text-2xl mt-5" v-show="!chatsOutput.length && !search.length">
			Create your first chat!
		</div>
		<div v-if="chatsOutput.length">
			<ChatBlock
					v-for="item in chatsOutput"
					:key="item.id"
					:data="item"
			/>
		</div>
		<TransitionGroup name="modal">
			<ModalWindow
					v-if="showModalWindow"
					@close-modal="closeModalWindow"
			>
				Incorrect Chat Id
			</ModalWindow>
		</TransitionGroup>
	</div>
</template>

<script setup>
import ChatBlock from "@/components/ChatBlock.vue";

const ModalWindow = defineAsyncComponent(() => import("@/components/ModalWindow.vue"));

import {
	collection, addDoc, onSnapshot, query, orderBy, getFirestore, updateDoc, doc, arrayUnion
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

const router = useRouter();

const newChatName = ref("");
const joinChatId = ref("");
let showModalWindow = ref(false);
let chats = ref([]);

const chatsCollectionsRef = collection(db, "chats");
const chatsCollectionsQuery = query(chatsCollectionsRef, orderBy("date", "desc"));

const createNewChat = async () => {
	await addDoc(chatsCollectionsRef, {
		name: newChatName.value || "New Chat",
		members: [getAuth().currentUser.uid],
		messages: [],
		date: Date.now(),
	}).then(res => router.push({ name: "chat", params: { id: res.id } }));

	newChatName.value = "";
};

const joinChat = async () => {
	if (joinChatId.value) {
		await updateDoc(doc(db, "chats", joinChatId.value), {
			members: arrayUnion(getAuth().currentUser.uid),
		})
			.then(() => router.push({ name: "chat", params: { id: joinChatId.value } }))
			.catch(() => (showModalWindow.value = true));

		joinChatId.value = "";
	}
};

const closeModalWindow = () => (showModalWindow.value = false);

const search = ref("");
const chatsOutput = computed(() => {
	if (search.value) {
		return chats.value.filter((elem) => elem.name.toLowerCase().includes(search.value.toLowerCase()));
	} else {
		return chats.value;
	}
});

onMounted(() => {
	onSnapshot(chatsCollectionsQuery, (querySnapshot) => {
		const chatsArray = [];
		querySnapshot.forEach((doc) => {
			const chat = {
				id: doc.id,
				...doc.data(),
			};
			if (chat.members.includes(getAuth().currentUser.uid)) {
				chatsArray.push(chat);
			}
		});
		chats.value = chatsArray;
	});
});
</script>

<style scoped></style>
