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
        path: '/about',
        component: () => import('@/pages/about/index.vue')
    },
    // ------ 各种图 ------
    {
        name: GraphTypeEnum.MIND,
        path: '/mind/:id',
        component: () => import('@/pages/graph/mind/index.vue')
    }, {
        name: GraphTypeEnum.ATRAMENT,
        path: '/atrament/:id',
        component: () => import('@/pages/graph/atrament/index.vue')
    }, {
        name: GraphTypeEnum.BPMN,
        path: '/bpmn/:id',
        component: () => import('@/pages/graph/bpmn/index.vue')
    }, {
        name: GraphTypeEnum.DIAGRAM,
        path: '/diagram/:id',
        component: () => import('@/pages/graph/diagram/index.vue')
    }, {
        name: 'flow-chart',
        path: '/flow-chart/:id',
        component: () => import('@/pages/graph/flow-chart/index.vue')
    }]
});

export default router;