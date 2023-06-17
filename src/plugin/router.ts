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
        path: '/recommend',
        component: () => import('@/pages/recommend/index.vue')
    }, {
        path: '/about',
        component: () => import('@/pages/about/index.vue')
    },
    // =================
    // ------ 绘制 ------
    // =================
    {
        name: GraphTypeEnum.DRAUU,
        path: '/apps/' + GraphTypeEnum.DRAUU,
        component: () => import('@/pages/apps/drauu/index.vue')
    }, {
        name: GraphTypeEnum.ECHARTS,
        path: '/apps/' + GraphTypeEnum.ECHARTS,
        component: () => import('@/pages/apps/echarts/index.vue')
    }, {
        name: GraphTypeEnum.WORD_CLOUD,
        path: '/apps/' + GraphTypeEnum.WORD_CLOUD,
        component: () => import('@/pages/apps/word-cloud/index.vue')
    },
    // ===================
    // ------ 各种图 ------
    // ===================
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
        }, {
            name: GraphTypeEnum.WHITE_BOARD,
            path: '/graph/white-board/:id',
            component: () => import('@/pages/graph/white-board/index.vue')
        }]
    },
    // =================
    // ------ 设置 ------
    // =================
    {
        path: "/setting",
        component: () => import('@/pages/setting/index.vue'),
        children: [{
            path: '/setting/base',
            component: () => import('@/pages/setting/base.vue')
        }, {
            path: '/setting/backup',
            component: () => import('@/pages/setting/backup/index.vue')
        }, {
            path: '/setting/simple-mind-map',
            component: () => import('@/pages/setting/simple-mind-map.vue')
        }, {
            path: '/setting/diagram',
            component: () => import('@/pages/setting/diagram.vue')
        }]
    }]
});

export default router;