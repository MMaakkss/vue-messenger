<template>
	<router-link
			class="chat cursor-pointer hover:bg-zinc-100 transition flex items-center gap-3 py-1 px-3 border-t"
			:to="{ name: 'chat', params: { id: data.id } }"
	>
		<div class="img flex rounded-full bg-amber-200 items-center justify-center">2</div>
		<div>
			<div class="text-lg">{{ data.name }}</div>
			<div class="text-sm">
				<template v-if="data.messages.length">
					{{ data.messages[data.messages.length - 1].author }}:
					{{ data.messages[data.messages.length - 1].message }}
				</template>
				<template v-else>No messages</template>
			</div>
		</div>
		<div class="ml-auto text-xs">
			{{ new Date(data.date).toLocaleString([], {timeStyle: "short", dateStyle: "short",}) }}
		</div>
	</router-link>
</template>

<script setup>
const props = defineProps({
	data: {
		type: Object,
		required: true
	}
});
</script>

<style scoped>
.img {
    width: 40px;
    height: 40px;
}

.chat:last-child {
    @apply border-b;
}
</style>