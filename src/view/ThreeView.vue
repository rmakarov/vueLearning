<template>
	<div>
		<ThreeScene ref="sceneRef" />
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import ThreeScene from "./../components/three/ThreeScene.vue";

const sceneRef = ref(null);

onMounted(() => {
	console.log("ThreeView mounted");
});

onUnmounted(() => {
	console.log("ThreeView unmounted");
});

</script>
