<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-3">
        <CCardHeader>
          <strong>Токен доступа</strong>
          <CTooltip content="Скопировать в буфер обмена" placement="right">
            <template #toggler="{ on }">
              <CButton
                class="m-2"
                color="primary"
                variant="ghost"
                @click="copyToken"
                v-on="on"
              >
                <CIcon :icon="cilCopy" />
              </CButton>
            </template>
          </CTooltip>
        </CCardHeader>
        <CCardBody>
          <p ref="tokenRef" @dblclick="copyToken">{{ token }}</p>
        </CCardBody>
      </CCard>

      <DataProiderForm :token="token" />
    </CCol>
  </CRow>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { cilCopy } from '@coreui/icons'
import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import DataProiderForm from '@/views/profile/components/DataProiderForm'

const store = useStore()
const tokenRef = ref(null)
const token = computed(() => store.state.auth.user.token)

function copyToken() {
  let el = tokenRef.value.innerHTML
  navigator.clipboard.writeText(el)
  createToast('Токен успешно скопирован в буфер обмена!', {
    type: 'success',
    position: 'top-right',
    showIcon: true,
  })
}
</script>
