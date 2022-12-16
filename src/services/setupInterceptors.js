import TokenService from './token.service'
import axiosInstance from './api'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken()
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token // for ASP.NET Core back-end
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  axiosInstance.defaults.withCredentials = true

  axiosInstance.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalConfig = err.config

      if (
        originalConfig.url !== '/User/auth' &&
        originalConfig.url !== '/User/verify_code' &&
        err.response
      ) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true

          try {
            await axiosInstance
              .post('/User/refresh', {
                access_Token: TokenService.getLocalAccessToken(),
                refresh_Token: TokenService.getLocalRefreshToken(),
              })
              .then(
                (response) => {
                  const resp = response.data

                  store.dispatch('auth/refreshToken', resp.tokens.access_Token)
                  TokenService.updateLocalAccessToken(resp.tokens.access_Token)
                  TokenService.updateLocalRefreshToken(
                    resp.tokens.refresh_Token,
                  )
                },
                (error) => {
                  console.log('ERRRORR:' + error)
                },
              )

            return axiosInstance(originalConfig)
          } catch (_error) {
            return Promise.reject(_error)
          }
        }
      }

      return Promise.reject(err)
    },
  )
}

export default setup
