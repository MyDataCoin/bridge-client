<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Держатели данных</strong>
        </CCardHeader>
        <CCardBody class="p-0">
          <EasyDataTable
            :headers="headers"
            :items="items"
            :empty-message="'Данные отсутствуют'"
            :rows-of-page-separator-message="'из'"
            :rows-per-page-message="'Показывать по'"
            alternating
            show-index
          >
            <template #expand="item">
              <div style="padding: 15px">
                <CRow>
                  <CCol :lg="6" :md="12"> Наименование: {{ item.name }} </CCol>
                  <CCol :lg="6" :md="12"> Адрес: {{ item.address }} </CCol>
                  <CCol :lg="6" :md="12">
                    Номер телефона: {{ item.phone }}
                  </CCol>
                  <CCol :lg="6" :md="12">
                    Электронная почта: {{ item.email }}
                  </CCol>
                  <CCol :lg="6" :md="12">
                    Категории монетизации:
                    <CBadge
                      class="ms-auto me-1"
                      color="primary"
                      v-for="cat in item.rewardCategories"
                      v-bind:key="cat.id"
                    >
                      {{ cat.name }}
                    </CBadge>
                  </CCol>
                  <CCol :lg="6" :md="12">
                    Страна:
                    {{
                      item.countries.length !== 0
                        ? item.countries[0].countryName
                        : 'Нет страны'
                    }}
                  </CCol>
                  <CCol :lg="6" :md="12">
                    Статус:
                    <CBadge
                      class="ms-auto me-1"
                      :color="item.isVerified ? 'success' : 'danger'"
                    >
                      {{
                        item.isVerified ? 'Верифицирован' : 'Не верифицирован'
                      }}
                    </CBadge>
                  </CCol>
                  <CCol :lg="6" :md="12">
                    Действия:
                    <button
                      v-if="!item.isVerified"
                      class="btn btn-sm btn-primary ms-2"
                      @click="verifyModalOpenFunc(item.bridgeUserEmail)"
                    >
                      Верифицировать
                    </button>
                    <span v-else>(Нет доступных действий)</span>
                  </CCol>
                </CRow>
              </div>
            </template>
            <template #item-isVerified="item">
              <div class="text-success" v-if="item.isVerified">
                Верифицирован
              </div>
              <div class="text-danger" v-else>Не верифицирован</div>
            </template>
            <template #item-country="item">
              <div class="text-primary">
                {{ item.countries[0].countryName }}
              </div>
            </template>
          </EasyDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CModal
    alignment="center"
    backdrop="static"
    :visible="verifyModalOpen"
    @close="verifyModalCloseFunc"
  >
    <CModalHeader>
      <CModalTitle>Подтверждение держателя данных</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Вы действительно хотите подтвердить статус данного держателя данных?
    </CModalBody>
    <CModalFooter>
      <CButton color="light" @click="verifyModalCloseFunc">Отмена</CButton>
      <CButton color="primary" @click="verifyProvider">Подтвердить</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import ProviderService from '@/services/provider.service'
import { onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const headers = ref([
  { text: 'Название', value: 'name' },
  { text: 'Адрес', value: 'address' },
  { text: 'Номер телефона', value: 'phone' },
  { text: 'Электронная почта', value: 'email' },
  { text: 'Страна', value: 'country' },
  { text: 'Статус', value: 'isVerified' },
])

const items = ref([])
const verifyModalOpen = ref(false)
const currentProviderUserEmail = ref(null)

function verifyModalOpenFunc(userEmail) {
  verifyModalOpen.value = true
  currentProviderUserEmail.value = userEmail
}

function verifyModalCloseFunc() {
  verifyModalOpen.value = false
  currentProviderUserEmail.value = null
}

async function getProviders() {
  items.value = []
  ProviderService.getProviders().then(
    (response) => {
      items.value = response.data
    },
    (error) => {
      console.log(error)
    },
  )
}

async function verifyProvider() {
  ProviderService.verifyProvider(currentProviderUserEmail.value).then(
    (response) => {
      if (response.status === 200) {
        getProviders()
        verifyModalCloseFunc()
      }
    },
    (error) => {
      console.log(error)
    },
  )
}

onMounted(() => {
  getProviders()
})
</script>
