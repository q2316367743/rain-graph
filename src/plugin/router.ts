import { createRouter, createWebHashHistory } from 'vue-router';
// 引入路由

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/home'
    }, {
        path: '/home',
        component: () => import('@/pages/home/index.vue')
    }, {
        path: '/mind/:id',
        component: () => import('@/pages/mind/index.vue')
    }, {
        path: '/atrament/:id',
        component: () => import('@/pages/atrament/index.vue')
    }, {
        path: '/flow-chart/:id',
        component: () => import('@/pages/flow-chart/index.vue')
    }]
});

export default router;