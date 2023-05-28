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
        path: '/graph/mind/:id',
        component: () => import('@/pages/graph/mind/index.vue')
    }, {
        name: GraphTypeEnum.ATRAMENT,
        path: '/graph/atrament/:id',
        component: () => import('@/pages/graph/atrament/index.vue')
    }, {
        name: GraphTypeEnum.BPMN,
        path: '/graph/bpmn/:id',
        component: () => import('@/pages/graph/bpmn/index.vue')
    }, {
        name: GraphTypeEnum.DIAGRAM,
        path: '/graph/diagram/:id',
        component: () => import('@/pages/graph/diagram/index.vue')
    }]
});

export default router;