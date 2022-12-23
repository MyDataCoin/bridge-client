<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Настройки
      </CDropdownHeader>
      <!--      <CDropdownItem style="cursor: pointer">-->
      <!--        <CIcon icon="cil-user" /> Profile-->
      <!--      </CDropdownItem>-->
      <!--      <CDropdownItem style="cursor: pointer">-->
      <!--        <CIcon icon="cil-settings" /> Settings-->
      <!--      </CDropdownItem>-->
      <!--      <CDropdownDivider />-->
      <CDropdownItem @click="logout" style="cursor: pointer">
        <CIcon icon="cil-lock-locked" /> Выход
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import avatar from '@/assets/images/avatars/user.png'

const store = useStore()
const router = useRouter()

async function logout() {
  await store.dispatch('auth/logout')
  await router.push('/pages/login')
}
</script>
