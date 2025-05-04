<template>
  <div class="card">
    <AccountAdd />
    <AccountItem :accounts="accounts" />
  </div>
</template>
<script setup>
import AccountService from '@/service/AccountService'
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import AccountAdd from './AccountAdd.vue'
import AccountItem from './AccountItem.vue'

const accounts = ref([])

const { user } = useUserStore()

const getAccounts = async () => {
  try {
    const { status, response } = await AccountService.getAccounts(user.id)
    accounts.value = response.accounts
  } catch (e) {
    console.log(e)
  }
}

const currencyFilter = (value) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const transformBalanceInNumber = () => {
  accounts.value = accounts.value.map((account) => {
    return {
      ...account,
      balance: currencyFilter(Number(account.balance)),
    }
  })
}

const init = async () => {
  await getAccounts()
  transformBalanceInNumber()
}

init()
</script>
