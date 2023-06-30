import GraphTypeEnum from '@/enumeration/GraphTypeEnum';
import {createRouter, createWebHashHistory} from 'vue-router';
// 引入路由

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: "首页",
        path: '/',
        redirect: '/home'
    }, {
        name: "仪表盘",
        path: '/dashboard',
        component: () => import('@/pages/dashboard/index.vue')
    }, {
        name: "首页",
        path: '/home',
        component: () => import('@/pages/home/index.vue')
    },
        // =================
        // ------ 更多 ------
        // =================
        {
            name: "推荐",
            path: '/more/recommend',
            component: () => import('@/pages/more/recommend/index.vue')
        }, {
            name: "高级版",
            path: '/more/vip',
            component: () => import('@/pages/more/vip/index.vue')
        }, {
            name: "关于",
            path: '/more/about',
            component: () => import('@/pages/more/about/index.vue')
        },
        // ===================
        // ------ 小程序 ------
        // ===================
        {
            name: "画板",
            path: '/apps/' + GraphTypeEnum.DRAUU,
            component: () => import('@/pages/apps/drauu/index.vue')
        }, {
            name: "可视化图表",
            path: '/apps/' + GraphTypeEnum.ECHARTS,
            component: () => import('@/pages/apps/echarts/index.vue')
        }, {
            name: "二维码",
            path: '/apps/' + GraphTypeEnum.QR_CODE,
            component: () => import('@/pages/apps/qr-code/index.vue')
        },
        // ======================
        // ------ 图片编辑器 ------
        // ======================
        {
            name: "设计编辑器",
            path: '/image/' + GraphTypeEnum.FABRIC,
            component: () => import('@/pages/image/fabric/index.vue')
        }, {
            name: "图片裁剪",
            path: '/image/' + GraphTypeEnum.CROPPER,
            component: () => import('@/pages/image/cropper/index.vue')
        }, {
            name: "图片压缩",
            path: '/image/' + GraphTypeEnum.COMPRESSOR,
            component: () => import('@/pages/image/compressor/index.vue')
        }, {
            name: "PSD查看器",
            path: '/image/' + GraphTypeEnum.PSD,
            component: () => import('@/pages/image/PSD/index.vue')
        },
        // ===================
        // ------ 各种图 ------
        // ===================
        {
            path: '/graph',
            component: () => import('@/pages/graph/index.vue'),
            children: [{
                name: "简易思维导图",
                path: '/graph/mind/:id',
                component: () => import('@/pages/graph/mind/index.vue')
            }, {
                name: "完整思维导图",
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
                name: "基础设置",
                path: "/setting/base",
                component: () => import('@/pages/setting/base.vue')
            }, {
                name: "备份设置",
                path: "/setting/backup",
                component: () => import('@/pages/setting/backup/index.vue')
            }, {
                name: "完整思维导图设置",
                path: "/setting/simple-mind-map",
                component: () => import('@/pages/setting/simple-mind-map.vue')
            }, {
                name: "流程图设置",
                path: "/setting/diagram",
                component: () => import('@/pages/setting/diagram.vue')
            }]
        }]
});

export default router;
