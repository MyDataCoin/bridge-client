import api from './api'
import TokenService from './token.service'

class AuthService {
  receive_code(email) {
    return api.get('/User/send_code/' + email)
  }
  receive_code_reg(email) {
    return api.post('/User/registration/' + email)
  }
  default_login() {
    return api
      .post('/User/auth', {
        socialId: 'string',
        email: 'example@example.com',
        nickName: 'John Doe',
        socialNetwork: 'meta',
        deviceId: 'string',
        fcmToken: 'string',
      })
      .then((response) => {
        if (response.status === 200) {
          TokenService.setUser(response.data.bodyResponse.tokens)
        }

        return response.data
      })
  }

  login({ email, code }) {
    return api
      .post('/User/verify_code', {
        email,
        code,
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          TokenService.setUser(response.data)
        }
        return response.data
      })
  }

  logout() {
    TokenService.removeUser()
    api.post('/User/revoke-token', {}).then((response) => {
      console.log(response)
    })
  }
}

export default new AuthService()
