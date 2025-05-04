<template>
  <ConfirmDialog :pt="{ content: { style: { fontSize: '18px' } } }" />
  <Loading v-if="loading" />
  <Toast />
  <TableTransactions 
    :transactions="transactions"
    @delete:transaction="deleteTransaction"
    @save:transaction="saveTransaction"
    @edit:transaction="editTransaction"
  />    
</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue'
import ExpensesService from '@/service/Expenses'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import TableTransactions from './TableTransactions.vue'

const transactions = ref([])
const loading = ref(false)

const toast = useToast()

const deleteTransaction = async (id) => {
  try {
    await ExpensesService.deleteExpense(id)  
    toast.add({severity:'success', summary: 'Successful', detail: 'Registro deletado', life: 3000});
    init()
  } catch (error) {
    toast.add({severity:'error', summary: 'Error', detail: 'Erro ao deletar o registro', life: 3000});
    init()
  }
}

const saveTransaction = async ({ transaction, is_recurring, recurring_count, status  }) => {
  try {
    await ExpensesService.createExpense({
      ...transaction,
      status,
      is_recurring,
      recurring_count,
    });

    toast.add({severity:'success', summary: 'Successful', detail: 'Registro salvo', life: 3000});
    init()
  } catch (error) {
    toast.add({severity:'error', summary: 'Error', detail: 'Erro ao salvar o registro', life: 3000});
    init()
  }
}

const editTransaction = async (transaction) => {
  try {
    await ExpensesService.updateExpense(transaction);

    toast.add({severity:'success', summary: 'Successful', detail: 'Registro editado', life: 3000});
    init()
  } catch (error) {
    toast.add({severity:'error', summary: 'Error', detail: 'Erro ao editar o registro', life: 3000});
    init()
  }
}

const currentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return { year, month }
}

const getExpenses = async () => {
  try {
    const { year, month } = currentDate()
    const { status, response }  = await ExpensesService.getExpenses({ year, month })

    console.log(response)
    transactions.value = response ?? []
    
    

  } catch (err) {
    console.error('Error getting transactions', err)
    return
  }
}

const init = async () => {
  loading.value = true
  await getExpenses()

  loading.value = false
}

init()
</script>
