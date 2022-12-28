<script setup>
import { onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import ProviderService from '@/services/provider.service'
import { createToast } from 'mosha-vue-toastify'
import moment from 'moment'

const loading = ref(false)
const statistics = ref([])

const headers = ref([
  { text: 'Email или номер телефона пользователя', value: 'emailPhone' },
  { text: 'Категория монетизации', value: 'rewardCategoryName' },
  { text: 'Количество', value: 'count' },
  { text: 'Вознаграждение', value: 'usdmcdAmount' },
  { text: 'Дата', value: 'created', sortable: true },
])

function getStatistics() {
  loading.value = true
  statistics.value = []
  ProviderService.getBridgeStatisticsFromAdmin().then(
    (response) => {
      statistics.value = response.data
      loading.value = false
    },
    (error) => {
      createToast('Возникли ошибки при загрузке данных!', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
      })
      console.log(error)
      loading.value = false
    },
  )
}

onMounted(() => {
  getStatistics()
})
</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Статистика</strong>
        </CCardHeader>
        <CCardBody class="p-0">
          <EasyDataTable
            :headers="headers"
            :items="statistics"
            :empty-message="'Данные отсутствуют'"
            :rows-of-page-separator-message="'из'"
            :rows-per-page-message="'Показывать по'"
            alternating
            buttons-pagination
            show-index
            v-if="!loading"
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
</template>
