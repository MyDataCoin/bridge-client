<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Пользователи</strong>
        </CCardHeader>
        <CCardBody class="p-0">
          <EasyDataTable :headers="headers" :items="items" alternating>
            <template #item-isVerified="item">
              <div class="text-success" v-if="item.isVerified">
                Верифицирован
              </div>
              <div class="text-danger" v-else>Не верифицирован</div>
            </template>
            <template #item-role="item">
              <div class="text-primary" v-if="item.role === 0">
                Администратор
              </div>
              <div class="text-dark" v-if="item.role === 1">Менеджер</div>
              <div class="text-dark" v-if="item.role === 2">Провайдер</div>
            </template>
            <template #item-actions="item">
              <div v-if="item.role === 2">
                <button
                  class="btn btn-sm btn-primary"
                  @click="upUserToManager(item.id)"
                >
                  Назначить менеджером
                </button>
              </div>
              <div v-else>(Нет действий)</div>
            </template>
          </EasyDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import ProviderService from '@/services/provider.service'
import { onMounted, ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const headers = ref([
  { text: 'Email', value: 'email' },
  { text: 'Верификация', value: 'isVerified', sortable: true },
  { text: 'Роль', value: 'role', sortable: true },
  { text: 'Действия', value: 'actions' },
])

const items = ref([])

async function getUsers() {
  items.value = []
  ProviderService.getUsers().then(
    (response) => {
      items.value = response.data
    },
    (error) => {
      console.log(error)
    },
  )
}

async function upUserToManager(userId) {
  ProviderService.userUpTomanager(userId).then(
    (response) => {
      if (response.status === 200) {
        getUsers()
      }
    },
    (error) => {
      console.log(error)
    },
  )
}

onMounted(() => {
  getUsers()
})
</script>
