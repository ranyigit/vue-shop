import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import Goods from '../components/goods/Goods'
import AddGoods from '../components/goods/Add'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  const token = window.sessionStorage.getItem('token')

  if (to.path === '/login' && token) return next('/home')
  // 没有token，强制跳转到登录页
  if (to.path !== '/login' && !token) return next('/login')

  next()
})

export default router
