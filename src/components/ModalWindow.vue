<template>
	<div class="absolute top-0 bottom-0 right-0 left-0 z-50 flex items-center justify-center">
		<div class="absolute w-full h-full bg-zinc-950/40" @click="close"></div>
		<div class=" relative z-10 bg-white min-w-[280px] rounded overflow-hidden">
			<div class="text-white bg-red-600 text-xl pl-4 py-2" v-if="showErrorMessage">Error message:</div>
			<div class="pl-4 py-4 text-lg pr-7">
				<slot></slot>
			</div>
			<div class="btn w-fit m-auto mb-3" @click="close">Confirm</div>
		</div>
	</div>

</template>

<script setup>
const props = defineProps({
	showErrorMessage: {
		type: Boolean,
		default: true,
	}
})
const emits = defineEmits(["closeModal"]);

const close = () => emits("closeModal");
</script>

<style scoped></style>
