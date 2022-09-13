import { createApp } from 'vue'
import App from './App.vue'

import 'virtual:svg-icons-register';
import { setupStore } from "@/stores/";
import {router, setupRouter} from '@/router'
import { setupRouterGuard } from "@/router/guard";

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

//引入mock测试数据
import "../mock/index";

const app = createApp(App)
setupStore(app);

app.use(ElementPlus, { locale });

setupRouter(app);
// 路由守卫
setupRouterGuard(router);

app.mount('#app')
