import $api from './api'

async function getProviders() {
  return await $api.get('/Providers/DataProviderGetList')
}

async function getProviderById(id) {
  return await $api.get('/Providers/DataProviderGet/' + id)
}

export default {
  getProviders,
  getProviderById,
}
