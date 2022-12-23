import $api from './api'

async function getProviders() {
  return await $api.get('/Providers/DataProviderGetList')
}

async function getProviderById(token) {
  return await $api.get('/Providers/DataProviderGet', {
    params: {
      token: token,
    },
  })
}

async function createDataProvider(
  { name, icon, address, phone, email, rewardCategories, countries },
  token,
) {
  return await $api.post('/Providers/DataProviderCreate', {
    name,
    icon,
    address,
    phone,
    email,
    token,
    rewardCategories,
    countries,
  })
}

async function editDataProvider(
  { id, name, icon, address, phone, email, rewardCategories, countries },
  token,
) {
  return await $api.put('/Providers/DataProviderEdit/' + id, {
    id,
    name,
    icon,
    address,
    phone,
    email,
    token,
    rewardCategories,
    countries,
  })
}

async function deleteProvider(id) {
  return await $api.delete('/Providers/DataProviderDelete/' + id)
}

async function getRewardCategoryList() {
  let list = []
  let hasResponse = false
  await $api.get('/Providers/RewardCategoryGetList').then(
    (response) => {
      list.slice(0, list.length)
      response.data.forEach((item) => {
        list.push({ id: item.id, text: item.name })
      })
      hasResponse = true
    },
    (error) => {
      console.log(error)
    },
  )
  return { list, hasResponse }
}

async function getCountryList() {
  let list = []
  let hasResponse = false
  await $api.get('/Providers/GETLISTCountry').then(
    (response) => {
      list.slice(0, list.length)
      response.data.forEach((item) => {
        list.push({ value: item.id, label: item.countryName })
      })
      hasResponse = true
    },
    (error) => {
      console.log(error)
    },
  )
  return { list, hasResponse }
}

async function getUsers() {
  return await $api.post('/User/list')
}

async function userUpTomanager(userId) {
  return await $api.post(
    '/User/UpToManager',
    {},
    {
      params: {
        userId: userId,
      },
    },
  )
}

async function verifyProvider(bridgeUserEmail) {
  return await $api.post('/User/verify/' + bridgeUserEmail)
}

export default {
  getProviders,
  getProviderById,
  createDataProvider,
  editDataProvider,
  getRewardCategoryList,
  getCountryList,
  deleteProvider,
  getUsers,
  userUpTomanager,
  verifyProvider,
}
