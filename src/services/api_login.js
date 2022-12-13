import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://mdc-client-api.azurewebsites.net/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default instance
