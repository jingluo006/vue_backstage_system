import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element-ui 组件
import '@/plugins/element.js'
// 导入全局css
import '@/assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
