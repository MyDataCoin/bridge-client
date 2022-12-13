class TokenService {
  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.access_Token
  }

  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.refresh_Token
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'))
    user.access_Token = token
    localStorage.setItem('user', JSON.stringify(user))
  }

  updateLocalRefreshToken(token) {
    let user = JSON.parse(localStorage.getItem('user'))
    user.refresh_Token = token
    localStorage.setItem('user', JSON.stringify(user))
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  removeUser() {
    localStorage.removeItem('user')
  }
}

export default new TokenService()
