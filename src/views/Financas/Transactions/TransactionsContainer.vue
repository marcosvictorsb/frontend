<template>
  <ConfirmDialog :pt="{ content: { style: { fontSize: '18px' } } }" />
  <Loading v-if="loading" />
  <Toast />
  <!-- <div class="grid grid-cols-12 gap-2">
    <div class="col-start-1 col-end-9">
      <Resume :totalExpense="totalExpense" :totalIncomes="totalIncomes" />
      <TableTransactions :transactions="transactions" @delete:transaction="deleteTransaction"
        @save:transaction="saveTransaction" @edit:transaction="editTransaction" />
    </div>
    <div class="col-start-9 col-end-13">
      <ResumeBank />
      <ListBank />
    </div>
  </div> -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
    <div class="md:col-start-1 md:col-end-9">
      <Resume :totalExpense="totalExpense" :totalIncomes="totalIncomes" />
      <TableTransactions :transactions="transactions" @delete:transaction="deleteTransaction"
        @save:transaction="saveTransaction" @edit:transaction="editTransaction" />
    </div>
    <div class="md:col-start-9 md:col-end-13">
      <ResumeBank />
      <ListBank />
    </div>
  </div>


</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue'
import ExpensesService from '@/service/Expenses'
import IncomesService from '@/service/Incomes'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import TableTransactions from './TableTransactions.vue'
import Resume from './Resume.vue'
import ResumeBank from './ResumeBank.vue'
import ListBank from './ListBanks.vue'
import ListBanksCustom from './ListBanksCustom.vue'

const transactions = ref([])
const loading = ref(false)
const toast = useToast()
const totalExpense = ref(0)
const totalIncomes = ref(0)


const currentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return { year, month }
}

// metodos api expense

const getTotalExpense = async () => {
  try {
    const { status, response } = await ExpensesService.getTotalExpenses()
    return response.total_expense
  } catch (error) {
    console.error('Error getting transactions', err)
    return
  }
}

const getTotalIncomes = async () => {
  try {
    const { status, response } = await IncomesService.getTotalIncomes()
    return response.total_income
  } catch (error) {
    console.error('Error getting transactions', err)
    return
  }
}

const getExpenses = async () => {
  try {
    const { year, month } = currentDate()
    const { status, response } = await ExpensesService.getExpenses({ year, month })
    return response ?? []

  } catch (err) {
    console.error('Error getting transactions', err)
    return
  }
}

const getIncomes = async () => {
  try {
    const { year, month } = currentDate()
    const { status, response } = await IncomesService.getIncomes({ year, month })
    return response ?? []
  } catch (err) {
    console.error('Error getting transactions', err)
    return
  }
}

const deleteTransaction = async ({ id, isIncome }) => {
  try {
    if (isIncome) {
      await IncomesService.deleteIncome(id)
    } else {
      await ExpensesService.deleteExpense(id)
    }
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro deletado', life: 3000 });
    init()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Erro ao deletar o registro', life: 3000 });
    init()
  }
}

const saveTransaction = async ({ transaction, is_recurring, recurring_count, status, isIncome }) => {
  try {
    if (isIncome) {
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


    toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro salvo', life: 3000 });
    init()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Erro ao salvar o registro', life: 3000 });
    init()
  }
}

const editTransaction = async (transaction) => {
  try {

    if (transaction.isIncome) {
      await IncomesService.updateIncome(transaction);
    } else {
      await ExpensesService.updateExpense(transaction);
    }

    toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro editado', life: 3000 });
    init()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Erro ao editar o registro', life: 3000 });
    init()
  }
}


const init = async () => {
  loading.value = true
  const incomes = await getIncomes();
  const expenses = await getExpenses();
  transactions.value = [...incomes, ...expenses];

  totalExpense.value = await getTotalExpense();
  totalIncomes.value = await getTotalIncomes();

  loading.value = false
}

// metodos api expense

init()
</script>
