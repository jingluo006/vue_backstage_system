import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局css
import '@/assets/css/global.css'
// 导入element-ui 组件
import '@/plugins/element.js'
// 导入axios
import axios from '@/utils/requestLogin.js'
import treeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', treeTable)

axios.interceptors.request.use((config) => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
