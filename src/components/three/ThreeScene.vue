<template>
	<div ref="container" class="three-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const container = ref(null);
let scene, camera, renderer, animationId;

onMounted(() => {
	initScene();
	animate();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	cleanup();
	window.removeEventListener("resize", handleResize);
});

function initScene() {
	if (!container.value) return;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	const aspect = container.value.clientWidth / container.value.clientHeight;
	camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(container.value.clientWidth, container.value.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	container.value.appendChild(renderer.domElement);
}

function animate() {
	animationId = requestAnimationFrame(animate);
	if (renderer && scene && camera) {
		renderer.render(scene, camera);
	}
}

function handleResize() {
	if (!container.value || !renderer || !camera) return;

	const width = container.value.clientWidth;
	const height = container.value.clientHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function cleanup() {
	console.log("Cleaning up Three.js resources");

	// Останавливаем анимацию
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}

	// Удаляем canvas из DOM с проверками
	if (renderer && renderer.domElement) {
		// Проверяем, что container.value существует И canvas все еще в DOM
		if (container.value && renderer.domElement.parentNode === container.value) {
			container.value.removeChild(renderer.domElement);
		}

		// Освобождаем ресурсы рендерера
		renderer.dispose();
		renderer = null;
	}

	// Освобождаем ресурсы сцены
	if (scene) {
		scene.traverse((object) => {
			if (object.isMesh) {
				if (object.geometry) {
					object.geometry.dispose();
				}
				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach((material) => {
							if (material.dispose) material.dispose();
						});
					} else {
						if (object.material.dispose) object.material.dispose();
					}
				}
			}
		});
		scene = null;
	}

	camera = null;
}
</script>

<style scoped>
.three-container {
	width: 100%;
	height: 500px;
	position: relative;
}
</style>
