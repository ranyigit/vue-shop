import Vue from 'vue'
import router from '@/router'
Vue.directive('permission', {
  inserted(el, binding) {
    const action = binding.value.action
    const effect = binding.value.effect
    // 判断当前的路由所对应的组件中，判断用户是否具备action的权限
    if (!router.currentRoute.meta.includes(action)) {
      if (effect === 'disabled') {
        el.disabled = true
        el.classList.add('is-disabled')
      } else {
        el.parentNode.removeChild(el)
      }
    }
  }
})
