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

// simple-mind-elixir-map
import MindMap from 'simple-mind-map'
import MiniMap from 'simple-mind-map/src/MiniMap.js'
import Drag from 'simple-mind-map/src/Drag.js'
import Export from 'simple-mind-map/src/Export.js'
import Select from 'simple-mind-map/src/Select.js'
import AssociativeLine from 'simple-mind-map/src/AssociativeLine.js'
// 注册插件
MindMap.usePlugin(Export)
    //     .usePlugin(Watermark)
    .usePlugin(Drag)
    //     .usePlugin(KeyboardNavigation)
    .usePlugin(Select)
    .usePlugin(MiniMap)
    .usePlugin(AssociativeLine)


// utools
import { utools } from './plugin/utools';
import { preload, api } from './plugin/preload';
window.rain = {
    env: window.utools ? 'utools' : 'web'
}
// 非utools环境，需要注入utools对象
if (!window.utools) {
    // @ts-ignore
    window.utools = utools;
    // @ts-ignore
    window.preload = preload;
    // @ts-ignore
    window.api = api;
}


createApp(App)
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
    .mount('#app');

import { statistics } from './global/BeanFactory';
statistics.init();
statistics.open();
