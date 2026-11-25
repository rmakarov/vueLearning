import { createRouter, createWebHistory, type RouterOptions } from "vue-router";
import Home from "./../view/Home.vue";
import Map from "../view/Map.vue";
import ThreeView from "../view/ThreeView.vue";
import Charts from "@/view/Charts.vue";

const routes: ({ path: string; component: any } | { path: string; component: any })[] = [
	{ path: "/", component: Home },
	{ path: "/map", component: Map },
	{ path: "/three-view", component: ThreeView },
	{ path: "/charts", component: Charts },
];

const router = createRouter(<RouterOptions>{
	history: createWebHistory(),
	routes,
});

export default router;
