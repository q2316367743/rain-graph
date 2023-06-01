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
        name: GraphTypeEnum.ECHARTS,
        path: '/echarts',
        component: () => import('@/pages/echarts/index.vue')
    }, {
        path: '/setting',
        component: () => import('@/pages/setting/index.vue')
    }, {
        path: '/recommend',
        component: () => import('@/pages/recommend/index.vue')
    }, {
        path: '/about',
        component: () => import('@/pages/about/index.vue')
    },
    // ------ 各种图 ------
    {
        path: '/graph',
        component: () => import('@/pages/graph/index.vue'),
        children: [{
            name: GraphTypeEnum.MIND,
            path: '/graph/mind/:id',
            component: () => import('@/pages/graph/mind/index.vue')
        }, {
            name: GraphTypeEnum.SIMPLE_MIND_MAP,
            path: '/graph/simple-mind-map/:id',
            component: () => import('@/pages/graph/simple-mind-map/index.vue')
        }, {
            name: GraphTypeEnum.DIAGRAM,
            path: '/graph/diagram/:id',
            component: () => import('@/pages/graph/diagram/index.vue')
        }]
    }]
});

export default router;