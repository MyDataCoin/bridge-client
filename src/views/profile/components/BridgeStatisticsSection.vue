<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong class="me-3">Статистика</strong>
          <CTooltip content="Добавить статистику" placement="right">
            <template #toggler="{ on }">
              <CButton
                class="p-2"
                color="primary"
                variant="ghost"
                v-on="on"
                @click="openStatisticsModalFunc"
              >
                <CIcon :icon="cilCloudUpload" />
              </CButton>
            </template>
          </CTooltip>
        </CCardHeader>
        <CCardBody class="p-0">
          <EasyDataTable
            :headers="headersForSecondTable"
            :items="statistics"
            :empty-message="'Данные отсутствуют'"
            :rows-of-page-separator-message="'из'"
            :rows-per-page-message="'Показывать по'"
            alternating
            buttons-pagination
            show-index
            v-if="!loadingFirstSection"
          >
            <template #item-created="{ created }">
              {{ moment(created).format('DD.MM.YYYY') }}
            </template>
          </EasyDataTable>
          <CRow v-else>
            <CCol class="text-center p-5">
              <CSpinner color="secondary" />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="addStatisticsModalOpen"
    @close="addStatisticsModalCloseFunc"
    size="xl"
  >
    <CModalHeader>
      <CModalTitle>Отправка статистики</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div v-if="!loading">
        <form
          class="row g-3 p-3"
          @submit.prevent="
            editingItemIndex === null ? addItem() : saveChanges()
          "
        >
          <CCol md="4">
            <CFormInput
              label="Электронная почта или телефон клиента"
              required
              type="text"
              v-model="item.emailPhone"
            />
          </CCol>
          <CCol md="4">
            <label class="form-label">Категория монетизации</label>
            <CFormSelect v-model="item.rewardCategoryId" required>
              <option selected="" disabled="" value="">Выберите...</option>
              <option
                v-for="category in rewardCategoriesOpt"
                :value="category.value"
                v-bind:key="category.value"
              >
                {{ category.label }}
              </option>
            </CFormSelect>
          </CCol>
          <CCol md="4">
            <CFormInput
              label="Количество"
              required
              type="number"
              v-model="item.count"
            />
          </CCol>
          <CCol md="12" class="text-end">
            <CButton color="primary" type="submit">
              {{ editingItemIndex === null ? 'Добавить' : 'Изменить' }}
            </CButton>
          </CCol>
        </form>
        <EasyDataTable
          :headers="headers"
          :items="items"
          :empty-message="'Данные отсутствуют'"
          :rows-of-page-separator-message="'из'"
          :rows-per-page-message="'Показывать по'"
          alternating
          buttons-pagination
          show-index
        >
          <template #item-rewardCategoryId="item">
            {{ getCategoryNameById(item.rewardCategoryId) }}
          </template>
          <template #item-actions="item">
            <CTooltip content="Изменить данные" placement="right">
              <template #toggler="{ on }">
                <CButton
                  class="p-2"
                  color="primary"
                  variant="ghost"
                  v-on="on"
                  @click="editItem(item)"
                >
                  <CIcon :icon="cilColorBorder" />
                </CButton>
              </template>
            </CTooltip>
            <CTooltip content="Удалить данные" placement="right">
              <template #toggler="{ on }">
                <CButton
                  class="p-2"
                  color="danger"
                  variant="ghost"
                  v-on="on"
                  @click="deleteItem(item)"
                >
                  <CIcon :icon="cilTrash" />
                </CButton>
              </template>
            </CTooltip>
          </template>
        </EasyDataTable>
      </div>
      <CRow v-else>
        <CCol class="text-center p-5">
          <CSpinner color="secondary" />
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="light" @click="addStatisticsModalCloseFunc">
        Отмена
      </CButton>
      <CButton
        color="primary"
        @click="sendArrayToServer"
        :disabled="items.length === 0"
      >
        Отправить
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { cilColorBorder, cilTrash, cilCloudUpload } from '@coreui/icons'
import ProviderService from '@/services/provider.service'
import { createToast } from 'mosha-vue-toastify'
import moment from 'moment'

const props = defineProps({ token: [String] })

const headers = ref([
  { text: 'Email или номер телефона пользователя', value: 'emailPhone' },
  { text: 'Категория монетизации', value: 'rewardCategoryId' },
  { text: 'Количество', value: 'count' },
  { text: 'Действия', value: 'actions' },
])

const headersForSecondTable = ref([
  { text: 'Email или номер телефона пользователя', value: 'emailPhone' },
  { text: 'Категория монетизации', value: 'rewardCategoryName' },
  { text: 'Количество', value: 'count' },
  { text: 'Вознаграждение', value: 'usdmcdAmount' },
  { text: 'Дата', value: 'created', sortable: true },
])

const editingItemIndex = ref(null)
const items = ref([])
const statistics = ref([])
const rewardCategoriesOpt = ref([])
const loading = ref(false)
const loadingFirstSection = ref(false)
const addStatisticsModalOpen = ref(false)

const item = ref({
  emailPhone: '',
  rewardCategoryId: '',
  count: null,
})

function getCategoryNameById(id) {
  let name = ''

  rewardCategoriesOpt.value.forEach((obj) => {
    if (obj.value === id) {
      name = obj.label
    }
  })

  return name
}

async function addItem() {
  let temp = {
    emailPhone: item.value.emailPhone,
    rewardCategoryId: item.value.rewardCategoryId,
    count: item.value.count,
  }
  items.value.push(temp)
  item.value.emailPhone = ''
  item.value.rewardCategoryId = ''
  item.value.count = null
}

function editItem(object) {
  editingItemIndex.value = object.index - 1
  item.value.emailPhone = object.emailPhone
  item.value.rewardCategoryId = object.rewardCategoryId
  item.value.count = object.count
}

function saveChanges() {
  let temp = {
    emailPhone: item.value.emailPhone,
    rewardCategoryId: item.value.rewardCategoryId,
    count: item.value.count,
  }

  items.value[editingItemIndex.value].emailPhone = temp.emailPhone
  items.value[editingItemIndex.value].rewardCategoryId = temp.rewardCategoryId
  items.value[editingItemIndex.value].count = temp.count

  item.value.emailPhone = ''
  item.value.rewardCategoryId = ''
  item.value.count = null
  editingItemIndex.value = null
}

function deleteItem(item) {
  items.value.splice(item.index - 1, 1)
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
}

function sendArrayToServer() {
  loading.value = true
  ProviderService.sendBridgeStatistics(props.token, items.value).then(
    () => {
      createToast('Успешно отправлено на сервер!', {
        type: 'success',
        position: 'top-right',
        showIcon: true,
      })
      loading.value = false
      addStatisticsModalCloseFunc()
      getStatistics()
    },
    (error) => {
      console.log(error)
      loading.value = false
    },
  )
}

function getStatistics() {
  loadingFirstSection.value = true
  statistics.value = []
  ProviderService.getBridgeStatisticsFromProvider(props.token).then(
    (response) => {
      statistics.value = response.data
      loadingFirstSection.value = false
    },
    (error) => {
      console.log(error)
      loadingFirstSection.value = false
    },
  )
}

function openStatisticsModalFunc() {
  addStatisticsModalOpen.value = true
}

function addStatisticsModalCloseFunc() {
  addStatisticsModalOpen.value = false
  items.value = []
  item.value.emailPhone = ''
  item.value.rewardCategoryId = ''
  item.value.count = null
  editingItemIndex.value = null
}

onMounted(() => {
  loadOptions()
  getStatistics()
})
</script>
