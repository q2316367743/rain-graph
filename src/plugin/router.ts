import GraphTypeEnum from '@/enumeration/GraphTypeEnum';
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
        name: GraphTypeEnum.MIND,
        path: '/mind/:id',
        component: () => import('@/pages/mind/index.vue')
    }, {
        name: GraphTypeEnum.ATRAMENT,
        path: '/atrament/:id',
        component: () => import('@/pages/atrament/index.vue')
    }, {
        name: 'flow-chart',
        path: '/flow-chart/:id',
        component: () => import('@/pages/flow-chart/index.vue')
    }]
});

export default router;