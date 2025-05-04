<template>
  <div class="col">
    <div class="card border border-surface rounded-2xl">
      <div class="flex justify-between items-center">
        <div
          class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4"
        >
          <span>Conta Bancarias</span>
        </div>
        <Button icon="pi pi-plus" raised @click="addAccount()" size="small" />
      </div>

      <ul class="list-none p-0 m-0">
        <li
          class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700 gap-4"
          v-for="account in accounts"
          :key="account.id"
        >
          <div class="text-lg">
            <span class="ibb-caixa"></span>
          </div>

          <div class="flex flex-col">
            <span
              class="font-medium text-surface-900 dark:text-surface-0 mb-1"
              >{{ account.name_bank }}</span
            >
          </div>
          <span
            class="text-surface-900 dark:text-surface-0 ml-auto font-semibold"
            >{{ formatCurrency(account.bank_balance) }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
defineProps({ accounts: { type: Array } })

const emit = defineEmits(['open:modal'])

const addAccount = () => {
  emit('open:modal')
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const init = async () => {}

init()
</script>
