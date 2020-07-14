import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rightList: JSON.parse(sessionStorage.getItem('rightList') || '[]')
  },
  /* mutations 里面不能处理异步操作 */
  mutations: {
    setRight (state, rights) {
      state.rightList = rights
      sessionStorage.setItem('rightList', JSON.stringify(rights))
    }
  },
  /* actions里面能处理任意异步操作
   * Action 提交的是 mutation，而不是直接变更状态
   */
  actions: {
  },
  getters: {
  }
})
