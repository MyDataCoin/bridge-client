import api from './api_login'
import TokenService from './token.service'

class AuthService {
  receive_code(email) {
    return api.get('/users/send_code/' + email)
  }
  default_login() {
    return api
      .post('/users/auth', {
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
      .post('/users/verify_code', {
        email,
        code,
      })
      .then((response) => {
        if (response.data.tokens) {
          TokenService.setUser(response.data.tokens)
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
