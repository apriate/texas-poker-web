import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'

// 手动导入message样式
// import 'element-plus/theme-chalk/el-message.css'

// 初始化脚本
import '@/utils/init'
import VConsole from 'vconsole'

// 开发环境添加vconsole
if (import.meta.env.DEV) {
  // tslint:disable-next-line:no-unused-expression
  new VConsole()
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
