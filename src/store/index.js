import { createStore } from 'vuex'
import { auth } from './auth.module'

export default createStore({
  state: {
    AUTH_API_URI: 'https://api.mydatacoin.io/api/v1',
    API_URI: 'https://bridge.mydatacoin.io/api/v1',
    sidebarVisible: '',
    sidebarUnfoldable: false,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
  },
  actions: {},
  modules: {
    auth,
  },
})
