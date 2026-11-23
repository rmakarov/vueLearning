<template>
	<div class="simple-map">
		<h2>Тест Яндекс.Карты</h2>
		<p v-if="status === 'loading'">⏳ Загружаем API Яндекс.Карт...</p>
		<p v-else-if="status === 'error'" class="error">❌ {{ errorMessage }}</p>
		<p v-else class="success">✅ Карта загружена</p>
		<div ref="mapContainer" class="map-canvas"></div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY;
const mapContainer = ref(null);
const status = ref("loading");
const errorMessage = ref("");
let mapInstance = null;

function loadYmaps() {
	return new Promise((resolve, reject) => {
		// 1. Если API уже полностью готов — используем сразу
		if (window.ymaps && typeof window.ymaps.ready === "function") {
			console.log("🟢 ymaps уже готов, используем его");
			window.ymaps.ready(() => resolve(window.ymaps));
			return;
		}

		const SCRIPT_ID = "yandex-maps-api";

		// 2. 👇 ГЛАВНОЕ: удаляем старый "битый" скрипт, если он есть
		const oldScript = document.getElementById(SCRIPT_ID);
		if (oldScript) {
			console.log("🗑️ Удаляем старый битый скрипт из DOM");
			oldScript.remove();
		}

		// 3. Создаём абсолютно новый скрипт
		console.log("🟡 Создаём свежий тег <script>...");
		const script = document.createElement("script");
		script.id = SCRIPT_ID;
		const url = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
		script.src = url;
		script.async = true;

		console.log("🔗 URL скрипта:", url);

		script.onload = () => {
			console.log("🟢 Скрипт загрузился! window.ymaps:", window.ymaps);
			if (window.ymaps && typeof window.ymaps.ready === "function") {
				window.ymaps.ready(() => {
					console.log("🟢 ymaps.ready() выполнен!");
					resolve(window.ymaps);
				});
			} else {
				reject(new Error("Скрипт загрузился, но window.ymaps не появился. Проверь блокировщик рекламы!"));
			}
		};

		script.onerror = () => {
			console.error("🔴 Скрипт не смог загрузиться");
			reject(new Error("Ошибка загрузки скрипта. Проверь интернет или блокировщик рекламы."));
		};

		document.head.appendChild(script);
	});
}

onMounted(async () => {
	try {
		console.log("🔑 API_KEY:", API_KEY ? "Присутствует ✅" : "Отсутствует ❌");

		if (!API_KEY) {
			throw new Error("Не указан API_KEY. Проверь файл .env и префикс VITE_");
		}

		console.log("🔄 Начинаем загрузку ymaps...");
		const ymaps = await loadYmaps();
		console.log("🔄 Инициализируем карту в контейнере...");

		mapInstance = new ymaps.Map(mapContainer.value, {
			center: [55.751244, 37.618423],
			zoom: 12,
			controls: ["zoomControl", "trafficControl"],
		});

		const placemark = new ymaps.Placemark([55.751244, 37.618423], { balloonContent: "Центр Москвы", hintContent: "Я тут!" }, { preset: "islands#redDotIcon" });
		mapInstance.geoObjects.add(placemark);

		status.value = "ready";
		console.log("✅ Карта успешно добавлена в DOM!");
	} catch (e) {
		status.value = "error";
		errorMessage.value = e.message || String(e);
		console.error("❌ Критическая ошибка карты:", e);
	}
});

onBeforeUnmount(() => {
	if (mapInstance) {
		mapInstance.destroy();
		mapInstance = null;
	}
});
</script>

<style scoped>
.simple-map {
	padding: 16px;
}
.map-canvas {
	width: 100%;
	height: 500px;
	border: 1px solid #ccc;
	border-radius: 8px;
	background: #f5f5f5;
}
.error {
	color: #d32f2f;
	font-weight: 500;
}
.success {
	color: #2e7d32;
	font-weight: 500;
}
</style>
