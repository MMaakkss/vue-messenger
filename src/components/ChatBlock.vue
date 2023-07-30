<template>
	<router-link
			class="chat cursor-pointer text-zinc-200 hover:bg-zinc-700 transition flex items-center gap-3 py-1 px-3"
			:to="{ name: 'chat', params: { id: data.id } }"
	>
		<div
				class="img flex rounded-full bg-red-500 items-center justify-center"
		>
			{{ data.members.length }}
		</div>
		<div class="whitespace-nowrap overflow-hidden">
			<div class="text-lg">{{ data.name }}</div>
			<div class="text-sm text-ellipsis text-zinc-300 overflow-hidden">
				<template v-if="data.messages.length">
					{{ data.messages[data.messages.length - 1].author }}:
					{{ data.messages[data.messages.length - 1].message }}
				</template>
				<template v-else>No messages</template>
			</div>
		</div>
		<div class="ml-auto text-xs whitespace-nowrap">
			{{ dateOutput(data.date) }}
		</div>
	</router-link>
</template>

<script setup>
import { dateOutput } from "@/Composables/dateOutput.js";

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});

// const getRandomColor = computed(() => {
// 	let letters = '0123456789ABCDEF';
// 	let color = '#';
// 	for (let i = 0; i < 6; i++) {
// 		color += letters[Math.floor(Math.random() * 16)];
// 	}
// 	return {
// 		'background-color': color,
// 	}
// })
</script>

<style scoped>
.img {
	min-width: 40px;
	height: 40px;
}
</style>
