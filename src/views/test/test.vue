<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Vue Button</strong>
        </CCardHeader>
        <CCardBody>
          <h1>Hello</h1>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import ProviderService from '@/services/provider.service'
import { onMounted } from 'vue'

async function getDictionaries() {
  ProviderService.getProviderById('4e572947-daab-41c7-9fca-59852c0f9632').then(
    (response) => {
      console.log(response)
    },
    (error) => {
      console.log(error)
    },
  )
}

onMounted(() => {
  getDictionaries()
})
</script>
