<script setup lang="ts"></script>

<template>
	<header class="app-header">
		<img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
		<nav class="nav-links">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/map">Map</RouterLink>
			<RouterLink to="/three-view">Three View</RouterLink>
		</nav>
	</header>

	<main>
		<RouterView :key="$route.fullPath" />
	</main>
</template>

<style scoped>
.app-header {
	position: sticky;
	width: 100%;
	top: 0;
	z-index: 100;

	display: flex;
	align-items: center;
	gap: 1.5rem;

	padding: 0.75rem 1.5rem;

	background: #fff; /* обязательно — иначе контент просвечивает */
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.logo {
	display: block;
	flex-shrink: 0;
}

.nav-links {
	display: flex;
	gap: 1rem;
}

.nav-links a {
	text-decoration: none;
	color: #2c3e50;
	font-weight: 500;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	transition: background 0.2s;
}

.nav-links a:hover {
	background: #f0f0f0;
}

.nav-links a.router-link-active {
	color: #42b883;
}

main {
	max-width: 1280px;
	padding: 1.5rem;
}

@media (min-width: 1024px) {
	.app-header {
		padding: 0.75rem 2rem;
	}
}
</style>
