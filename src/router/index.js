import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import NotFound from '@/components/NotFound'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */'../components/Welcome.vue')

// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */'../components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */'../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */'../components/power/Roles')

// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */'../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */'../components/goods/Params')

const Goods = () => import(/* webpackChunkName: "Goods_AddGoods" */'../components/goods/Goods')
const AddGoods = () => import(/* webpackChunkName: "Goods_AddGoods" */'../components/goods/Add')

const Order = () => import(/* webpackChunkName: "Order_Report" */'../components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */'../components/report/Report')

Vue.use(VueRouter)

const ruleMapping = {
  'users': { path: '/users', component: Users },
  'rights': { path: '/rights', component: Rights },
  'roles': { path: '/roles', component: Roles },
  'categories': { path: '/categories', component: Cate },
  'params': { path: '/params', component: Params },
  'goods': { path: '/goods', component: Goods },
  'goods.add': { path: '/goods/add', component: AddGoods },
  'orders': { path: '/orders', component: Order },
  'reports': { path: '/reports', component: Report },
  'notfound': { path: '*', component: NotFound }
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome }
      // { path: '/users', component: Users },
      // { path: '/rights', component: Rights },
      // { path: '/roles', component: Roles },
      // { path: '/categories', component: Cate },
      // { path: '/params', component: Params },
      // { path: '/goods', component: Goods },
      // { path: '/goods/add', component: AddGoods },
      // { path: '/orders', component: Order },
      // { path: '/reports', component: Report }
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
  // initDynamicRoutes()
  next()
})

export function initDynamicRoutes() {
  // 根据二级权限，对路由规则动态的添加
  const currentRoutes = router.options.routes
  const rightList = store.state.rightList
  rightList.forEach(item => {
    item.children.forEach(route => {
      currentRoutes[2].children.push(ruleMapping[route.path])
    })
  })
  // ！！！一定要最后添加 404路由
  currentRoutes.push(ruleMapping.notfound)
  router.addRoutes(currentRoutes)
}
export default router
