<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCard class="p-4">
            <CCardBody>
              <CForm>
                <h1>Авторизация</h1>
                <div class="mb-3">
                  <CFormLabel for="exampleFormControlInput1">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    v-model="model.email"
                    :disabled="codeSent"
                    placeholder="name@example.com"
                  />
                </div>
                <div class="mb-3" v-if="codeSent">
                  <CFormLabel for="exampleFormControlInput1">Код</CFormLabel>
                  <CFormInput type="text" v-model="model.code" />
                </div>
                <CRow>
                  <CCol :xs="6">
                    <CButton
                      color="primary"
                      class="px-4"
                      @click="receiveCode"
                      :disabled="model.email === '' || loading"
                      v-if="!codeSent"
                    >
                      <CSpinner size="sm" v-if="loading" color="secondary" />
                      Получить код
                    </CButton>

                    <CButton
                      color="primary"
                      class="px-4"
                      @click="handleLogin"
                      :disabled="
                        model.email === '' || model.code === '' || loading
                      "
                      v-else
                    >
                      <CSpinner size="sm" v-if="loading" color="secondary" />
                      Войти
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import AuthService from '@/services/auth.service'

const store = useStore()
const router = useRouter()

const codeSent = ref(false)
const loading = ref(false)

const model = reactive({
  email: '',
  code: '',
})

const loggedIn = computed(() => store.state.auth.status.loggedIn)

async function handleLogin() {
  loading.value = true
  const resp = await store.dispatch('auth/login', model)
  if (resp.code === 200) {
    router.push({ name: 'Home' })
  }

  loading.value = false
}

async function receiveCode() {
  loading.value = true
  AuthService.receive_code(model.email).then(
    (response) => {
      console.log(response)
      if (response.status === 200) {
        codeSent.value = true
      } else {
        alert('Пользователь с такой почтой не найден!')
      }
      loading.value = false
    },
    (error) => {
      console.log(error)
      loading.value = false
      alert('Пользователь с такой почтой не найден!')
    },
  )
}

onMounted(() => {
  if (loggedIn.value) {
    router.push({ name: 'Home' })
  }
})
</script>
