import { createRouter, createWebHistory, type RouterOptions } from 'vue-router';
import Home from './../view/Home.vue';
import LeetCodeExamples from '../view/LeetCodeExamples.vue';

const routes: ({ path: string; component: any } | { path: string; component: any })[] = [
    { path: '/', component: Home },
    { path: '/leetCode', component: LeetCodeExamples },
];

const router = createRouter(<RouterOptions>{
    history: createWebHistory(),
    routes,
});

export default router;