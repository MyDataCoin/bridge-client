import AuthService from '../services/auth.service'
import TokenService from '@/services/token.service'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null }

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, model) {
      return AuthService.login(model).then(
        (response) => {
          commit('loginSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('loginFailure')
          return Promise.reject(error)
        },
      )
    },
    logout({ commit }) {
      TokenService.removeUser()
      commit('logout')
    },
    refreshToken({ commit }, jwtToken) {
      commit('refreshToken', jwtToken)
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure(state) {
      state.status.loggedIn = false
      state.user = null
    },
    logout(state) {
      state.status.loggedIn = false
      state.user = null
    },
    refreshToken(state, access_Token) {
      state.status.loggedIn = true
      state.user = { ...state.user, access_Token: access_Token }
    },
  },
}
