import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import 'virtual:svg-icons-register';
import router from './router'

//引入mock测试数据
import "../mock/index";

const app = createApp(App)

app.use(ElementPlus, { locale });
app.use(createPinia());
app.use(router);

app.mount('#app')
