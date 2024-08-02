import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api/index'
import commonUtils from './utils/commonUtils'
import localUtils from './utils/storageUtils'

//导入 elementplus 相关
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.config.globalProperties.$api = api;
app.config.globalProperties.$utils = commonUtils;
app.config.globalProperties.$local = localUtils;

app.mount('#app')
