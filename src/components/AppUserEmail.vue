<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userEmail = computed(() => store.state.auth.user.email)
const userRole = computed(() => store.state.auth.user.role)

function getUserRole() {
  if (userRole.value === 'Administrator') return 'Администратор'
  else if (userRole.value === 'Manager') return 'Менеджер'
  else if (userRole.value === 'User') return 'Провайдер'
  else return 'Неизвестная роль'
}
</script>

<template>
  <h6>{{ `${userEmail} (${getUserRole()})` }}</h6>
</template>
