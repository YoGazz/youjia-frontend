import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App)
// 注册 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册 Pinia 和路由
app.use(createPinia())
// 注册路由
app.use(router)
// 注册 Element Plus 语言包
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
