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
import IncomesService from '@/service/Incomes'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import TableTransactions from './TableTransactions.vue'

const transactions = ref([])
const loading = ref(false)

const toast = useToast()

const deleteTransaction = async ({ id, isIncome }) => {
  try {
    if(isIncome) {
      await IncomesService.deleteIncome(id)
    } else {
      await ExpensesService.deleteExpense(id)
    }
    toast.add({severity:'success', summary: 'Successful', detail: 'Registro deletado', life: 3000});
    init()
  } catch (error) {
    toast.add({severity:'error', summary: 'Error', detail: 'Erro ao deletar o registro', life: 3000});
    init()
  }
}

const saveTransaction = async ({ transaction, is_recurring, recurring_count, status, isIncome  }) => {
  try {
    if(isIncome) {
      await IncomesService.createIncome({
        ...transaction,
        status,
        is_recurring,
        recurring_count,
      });
    } else {
      await ExpensesService.createExpense({
        ...transaction,
        status,
        is_recurring,
        recurring_count,
      });
    }
    

    toast.add({severity:'success', summary: 'Successful', detail: 'Registro salvo', life: 3000});
    init()
  } catch (error) {
    toast.add({severity:'error', summary: 'Error', detail: 'Erro ao salvar o registro', life: 3000});
    init()
  }
}

const editTransaction = async (transaction) => {
  try {
    console.log('transaction ---------------->', transaction)

    if(transaction.isIncome) {
      await IncomesService.updateIncome(transaction);
    } else {
      await ExpensesService.updateExpense(transaction);
    }

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
    return response ?? []

  } catch (err) {
    console.error('Error getting transactions', err)
    return
  }
}

const getIncomes = async () => {
  try {
    const { year, month } = currentDate()
    const { status, response }  = await IncomesService.getIncomes({ year, month })
    return response ?? []
  } catch (err) {
    console.error('Error getting transactions', err)
    return
  }
}

const init = async () => {
  loading.value = true
  const incomes = await getIncomes();
  const expenses = await getExpenses();
  transactions.value = [...incomes, ...expenses];
  

  loading.value = false
}

init()
</script>
