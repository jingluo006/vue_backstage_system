import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/User/User.vue'
import Rights from '@/views/Rights/Rights.vue'
import Roles from '@/views/Rights/Roles.vue'
import Goods from '@/views/Goods/Goods.vue'
import Params from '@/views/Goods/Params.vue'
import Categories from '@/views/Goods/Categories.vue'
import Orders from '@/views/Orders/Orders.vue'
import Reports from '@/views/Reports/Reports.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  // 登录路由
  { path: '/login', component: Login },
  // home 路由
  {
    path: '/home',
    redirect: '/home/users',
    component: Home,
    children: [
      { path: 'users', component: Users },
      { path: 'roles', component: Roles },
      { path: 'rights', component: Rights },
      { path: 'goods', component: Goods },
      { path: 'params', component: Params },
      { path: 'categories', component: Categories },
      { path: 'orders', component: Orders },
      { path: 'reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/home') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})
export default router
