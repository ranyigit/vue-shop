import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]
const router = new VueRouter({
  routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')

  // 没有token，强制跳转到登录页
  if (!token) return next('/login')
  next()
})

export default router
