<template>
  <Toast />
  <Panel class="content-center">
    <div
      class="flex flex-col"
      v-for="(account, index) in accounts"
      :key="index"
    >
      <Card class="mb-2 rounded">
        <template #content>
          <div class="flex items-start justify-end">
            <Avatar
              class="mr-2"
              style="background-color: #dee9fc; color: #1a2551"
              size="large"
              :icon="account.icon"
            />
            <div class="flex-auto">
              <h3 class="text-lg font-semibold">{{ account.fullNameBank }}</h3>
              <p class="text-lg text-gray-600">{{ account.balance }}</p>
            </div>
            <Button
              label="Ajustar"
              severity="success"
              icon="pi pi-plus"
              outlined
              class="flex-auto"
              size="small"
            />
          </div>
        </template>
      </Card>
    </div>
  </Panel>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
const toast = useToast()

defineProps({
  accounts: {
    type: Array,
  },
})

const addTransaction = () => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Transação adicionada',
    life: 3000,
  })
}

const init = () => {
  console.log('init')
}

init()
</script>
