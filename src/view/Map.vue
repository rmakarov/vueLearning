<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import YaMap from "./../components/map/YaMap.vue";

onMounted(() => {
	console.log("Родительский компонент смонтирован");
});
</script>

<template>
	<!-- 👇 ИЗМЕНИЛИ ID и добавили временную красную рамку для отладки -->
	<div id="map-page-wrapper" style="border: 5px solid red; padding: 10px">
		<h1>Страница с картой</h1>
		<YaMap />
	</div>
</template>
