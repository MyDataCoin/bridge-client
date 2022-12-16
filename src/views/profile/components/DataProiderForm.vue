<template>
  <CCard class="mb-3">
    <CCardHeader>
      <strong class="me-3">Держатель данных</strong>
      <CTooltip
        content="Создать держателя данных"
        placement="right"
        v-if="!hasDataProvider && !isEditing"
      >
        <template #toggler="{ on }">
          <CButton
            class="p-2"
            color="primary"
            variant="ghost"
            v-on="on"
            @click="startEditing"
          >
            <CIcon :icon="cilPlus" />
          </CButton>
        </template>
      </CTooltip>
      <CTooltip
        content="Изменить держателя данных"
        placement="right"
        v-if="hasDataProvider && !isEditing"
      >
        <template #toggler="{ on }">
          <CButton
            class="p-2"
            color="primary"
            variant="ghost"
            v-on="on"
            @click="startEditing"
          >
            <CIcon :icon="cilColorBorder" />
          </CButton>
        </template>
      </CTooltip>
      <CTooltip
        content="Удалить держателя данных"
        placement="right"
        v-if="hasDataProvider && !isEditing"
      >
        <template #toggler="{ on }">
          <CButton
            class="p-2"
            color="danger"
            variant="ghost"
            v-on="on"
            @click="
              () => {
                deleteModalOpen = true
              }
            "
          >
            <CIcon :icon="cilTrash" />
          </CButton>
        </template>
      </CTooltip>
    </CCardHeader>
    <CCardBody>
      <form
        class="row g-3"
        @submit.prevent="handleSubmit"
        v-if="hasDataProvider || isEditing"
      >
        <CCol md="6">
          <CFormInput
            label="Название"
            required
            v-model="model.name"
            :disabled="!isEditing"
          />
        </CCol>
        <CCol md="6">
          <CFormInput
            label="Адрес"
            required
            v-model="model.address"
            :disabled="!isEditing"
          />
        </CCol>
        <CCol md="6">
          <CFormInput
            label="Номер телефона"
            required
            v-model="model.phone"
            :disabled="!isEditing"
          />
        </CCol>
        <CCol md="6">
          <CFormInput
            label="Электронная почта"
            required
            type="email"
            v-model="model.email"
            :disabled="!isEditing"
          />
        </CCol>
        <CCol md="6">
          <label class="form-label">Категории монетизации</label>
          <Select2
            v-model="model.rewardCategories"
            :options="rewardCategoriesOpt"
            :settings="{ multiple: true }"
            :disabled="!isEditing"
          ></Select2>
        </CCol>
        <CCol md="6">
          <label class="form-label">Страны</label>
          <CFormSelect
            v-model="model.countries"
            :options="countriesOpt"
            :disabled="!isEditing"
            required
          ></CFormSelect>
        </CCol>

        <CCol xs="12" v-if="isEditing">
          <CButton color="primary" type="submit">Сохранить</CButton>
          <CButton class="ms-3" color="light" type="button" @click="endEditing">
            Отменить
          </CButton>
        </CCol>
      </form>
      <div class="row" v-else>
        <CCol md="12" class="text-center">
          <h6>(У вас нет держателя данных)</h6>
        </CCol>
      </div>
    </CCardBody>
  </CCard>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="deleteModalOpen"
    @close="
      () => {
        deleteModalOpen = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Удаление</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Вы действительно хотите удалить поставщика данных?
    </CModalBody>
    <CModalFooter>
      <CButton
        color="light"
        @click="
          () => {
            deleteModalOpen = false
          }
        "
      >
        Отмена
      </CButton>
      <CButton color="danger" @click="deleteDataProvider">Удалить</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { cilPlus, cilColorBorder, cilTrash } from '@coreui/icons'
import ProviderService from '@/services/provider.service'
import { createToast } from 'mosha-vue-toastify'
import Select2 from 'vue3-select2-component'

const props = defineProps({ token: [String] })
const isEditing = ref(false)
const hasDataProvider = ref(false)
const deleteModalOpen = ref(false)

const rewardCategoriesOpt = ref([])
const countriesOpt = ref([])

const model = ref({
  id: null,
  name: null,
  icon: null,
  address: null,
  phone: null,
  email: null,
  rewardCategories: [],
  countries: [],
})

function getDataProvider() {
  resetModel()
  ProviderService.getProviderById(props.token).then(
    (response) => {
      if (response.status === 200) {
        hasDataProvider.value = true

        model.value.id = response.data.id
        model.value.name = response.data.name
        model.value.icon = response.data.icon
        model.value.address = response.data.address
        model.value.phone = response.data.phone
        model.value.email = response.data.email

        if (response.data.rewardCategories.length !== 0) {
          response.data.rewardCategories.forEach((item) => {
            model.value.rewardCategories.push(item.id)
          })
        }

        if (response.data.countries.length !== 0) {
          response.data.countries.forEach((item) => {
            model.value.countries.push(item.id)
          })
        }

        model.value.countries = model.value.countries[0]
      } else {
        hasDataProvider.value = false
      }
    },
    (error) => {
      console.log(error)
      hasDataProvider.value = false
    },
  )
}

function startEditing() {
  isEditing.value = true
}

function endEditing() {
  isEditing.value = false
  getDataProvider()
}

function handleSubmit() {
  model.value.id === null ? createDataProvider() : editDataProvider()
  console.log('submit')
}

function getNormalizedModel(model) {
  let localModel = {
    id: model.id,
    name: model.name,
    icon: model.icon,
    address: model.address,
    phone: model.phone,
    email: model.email,
    rewardCategories: model.rewardCategories,
    countries: model.countries,
  }

  let rewardCategoriesList = []
  let countriesList = []

  if (localModel.rewardCategories.length !== 0) {
    localModel.rewardCategories.forEach((item) => {
      rewardCategoriesList.push({ id: item })
    })
  }

  countriesList.push({ id: localModel.countries })

  localModel.rewardCategories = rewardCategoriesList
  localModel.countries = countriesList

  console.log(localModel)

  return localModel
}

function createDataProvider() {
  let temp = getNormalizedModel(model.value)
  ProviderService.createDataProvider(temp, props.token).then(
    (response) => {
      console.log(response)
      isEditing.value = false
      getDataProvider()
      createToast('Держатель данных успешно добавлен!', {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })
    },
    (error) => {
      console.log(error)
      createToast('Возникла ошибка при добавлении!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    },
  )
}

function editDataProvider() {
  let temp = getNormalizedModel(model.value)
  ProviderService.editDataProvider(temp, props.token).then(
    (response) => {
      console.log(response)
      isEditing.value = false
      getDataProvider()
      createToast('Держатель данных успешно изменен!', {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })
    },
    (error) => {
      console.log(error)
      createToast('Возникла ошибка при изменении!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    },
  )
}

function deleteDataProvider() {
  ProviderService.deleteProvider(model.value.id).then(
    () => {
      deleteModalOpen.value = false
      getDataProvider()
      createToast('Держатель данных успешно удален!', {
        type: 'warning',
        position: 'top-right',
        showIcon: true,
      })
    },
    (error) => {
      console.log(error)
      createToast('Возникла ошибка при удалении!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    },
  )
}

function loadOptions() {
  ProviderService.getRewardCategoryList().then(({ list, hasResponse }) => {
    if (hasResponse) {
      rewardCategoriesOpt.value = list
    } else {
      createToast('Возникла ошибка при загрузке категорий!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    }
  })

  ProviderService.getCountryList().then(({ list, hasResponse }) => {
    if (hasResponse) {
      countriesOpt.value = list
    } else {
      createToast('Возникла ошибка при загрузке стран!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
    }
  })
}

function resetModel() {
  model.value.id = null
  model.value.name = null
  model.value.icon = null
  model.value.address = null
  model.value.phone = null
  model.value.email = null
  model.value.rewardCategories = []
  model.value.countries = []
}

onMounted(() => {
  loadOptions()
  getDataProvider()
})
</script>
