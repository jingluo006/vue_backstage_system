import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/Login.vue')
const Users = () => import('@/views/User/User.vue')
const Rights = () => import('@/views/Rights/Rights.vue')
const Roles = () => import('@/views/Rights/Roles.vue')
const Goods = () => import('@/views/Goods/Goods.vue')
const Params = () => import('@/views/Goods/Params.vue')
const Categories = () => import('@/views/Goods/Categories.vue')
const Orders = () => import('@/views/Orders/Orders.vue')
const Reports = () => import('@/views/Reports/Reports.vue')
const Add = () => import('@/views/Goods/Add.vue')

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
      { path: 'reports', component: Reports },
      { path: 'goods/add', component: Add }
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
