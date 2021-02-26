import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// import TreeTable from 'vue-table-with-tree-grid'
import './utils/permission.js'
// 导入富文本编辑起对用的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import ECharts from 'vue-echarts'

Vue.config.productionTip = false
// 将富文本编辑器注册为全局可用
Vue.component('quill-editor', quillEditor)
Vue.component('v-chart', ECharts)
// Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
