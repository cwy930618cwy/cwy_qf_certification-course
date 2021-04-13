import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import persistedState from 'vuex-persistedstate'
const state = {
  moduleTip: '欢迎vuex',
  userinfo: ''
}
const getters = {
  moduleTip: state => state.moduleTip
}
const mutations = {
  SET_MODULETIP(state, data) {
    state.moduleTip = data
  },
  setSserinfo(state, data) {
    state.userinfo = data
  }
}
const actions = {
  setSserinfo({ commit }, data) {
    commit('setSserinfo', data)
  }
}
const plugins = [
  persistedState({
    storage: window.localStorage,
    reducer(val) {
      return {
        userinfo: val.userinfo
      }
    }
  })
]
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins
})

export default store
