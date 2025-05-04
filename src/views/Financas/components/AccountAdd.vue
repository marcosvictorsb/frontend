<template>
  <Toast />
  <AccountModal
    :isVisible="isShowAccountModal"
    @close:modal="closeModalAccount"
  />
  <div class="flex justify-between items-center mb-3">
    <h2 class="mb-2 text-conta">Contas</h2>
    <Button
      label="Adicionar"
      severity="success"
      icon="pi pi-plus"
      outlined
      @click="openModalAccount"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import AccountModal from './AccountModal.vue'

const isShowAccountModal = ref(false)

const openModalAccount = () => {
  isShowAccountModal.value = true
}

const closeModalAccount = () => {
  isShowAccountModal.value = false
}
</script>
<style scoped>
.text-conta {
  font-size: 22px;
}
</style>
