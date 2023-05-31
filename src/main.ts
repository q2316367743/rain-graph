import { createApp } from 'vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './plugin/router';


// 样式
import '@/less/customer.less';
import '@/less/index.less';
import '@arco-design/web-vue/dist/arco.css';

// simple-mind-map
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/MiniMap.js'
import Watermark from 'simple-mind-map/src/Watermark.js'
import Drag from 'simple-mind-map/src/Drag.js'
import KeyboardNavigation from 'simple-mind-map/src/KeyboardNavigation.js'
import Export from 'simple-mind-map/src/Export.js'
import Select from 'simple-mind-map/src/Select.js'
import AssociativeLine from 'simple-mind-map/src/AssociativeLine.js'

import { utools } from './plugin/utools';

// 非utools环境，需要注入utools对象
if (!window.utools) {
    // @ts-ignore
    window.utools = utools;
}

// 注册插件
MindMap.usePlugin(MiniMap)
    .usePlugin(Watermark)
    .usePlugin(Drag)
    .usePlugin(KeyboardNavigation)
    .usePlugin(Export)
    .usePlugin(Select)
    .usePlugin(AssociativeLine)


createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
    .mount('#app')
