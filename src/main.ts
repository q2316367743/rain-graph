import { createApp } from 'vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import ArcoVue from '@arco-design/web-vue';
import {createPinia} from 'pinia';
import App from './App.vue'
import router from './plugin/router';


// 样式
import '@/less/customer.less';
import '@/less/index.less';
import '@arco-design/web-vue/dist/arco.css';


createApp(App)
.use(ArcoVue)
.use(ArcoVueIcon)
    .use(createPinia())
    .use(router)
    .mount('#app')
