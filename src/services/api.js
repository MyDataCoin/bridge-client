import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://bridge.mydatacoin.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default instance
