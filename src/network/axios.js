import originAxios from 'axios'
import Npropress from 'nprogress'
import router from '../router'
// import 'nprogress/nprogress.css'

const baseURL = 'http://localhost:8888/api/private/v1'

export default function axios (option) {
  return new Promise((resolve, reject) => {
    // 1.创建axios的实例
    const instance = originAxios.create({
      baseURL: baseURL,
      timeout: 5000
    })
    // 配置请求和响应拦截
    instance.interceptors.request.use(req => {
      Npropress.start()
      // console.log('来到了request拦截success中');
      // 1.当发送网络请求时, 在页面中添加一个loading组件, 作为动画

      // 2.某些请求要求用户必须登录, 判断用户是否有token, 如果没有token跳转到login页面

      // 为请求头对象添加 token验证的Authorization字段
      req.headers.Authorization = window.sessionStorage.getItem('token')

      // 4.等等
      return req
    }, err => {
      // console.log('来到了request拦截failure中');
      return err
    })

    instance.interceptors.response.use(response => {
      // 判断token是否过期
      if (response.data.meta.status === 400) {
        router.push('/login')
        sessionStorage.clear()
        window.location.reload()
      }

      Npropress.done()
      return response
    }, err => {
      // console.log('来到了response拦截failure中')
      // if (err && err.response) {
      //   switch (err.response.status) {
      //     case 400:
      //       err.message = '请求错误'
      //       break
      //     case 401:
      //       err.message = '未授权的访问'
      //       break
      //   }
      // }
      return err
    })

    // 2.传入对象进行网络请求
    instance(option).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
