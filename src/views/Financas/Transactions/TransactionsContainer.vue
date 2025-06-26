<template>
  <ConfirmDialog :pt="{ content: { style: { fontSize: '18px' } } }" />
  <Loading v-if="loading" />
  <Toast />
  <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
    <div class="md:col-start-1 md:col-end-9">
      <MonthFilter @month-changed="onMonthChanged" />
      <Resume :totalExpenseToPay="totalExpenseToPay" :totalExpensePay="totalExpensePay" :totalIncomes="totalIncomes" />
      <TableTransactions :transactions="transactions" :banks="banks" @delete:transaction="deleteTransaction"
        @save:transaction="saveTransaction" @edit:transaction="editTransaction" />
    </div>
    <div class="md:col-start-9 md:col-end-13">
      <ResumeBank :totalAmount="totalAmountBank" @save:bank="saveBank" />
      <ListBank :banks="banks" open:modal-bank="" />
    </div>
  </div>


</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue';
import ExpensesService from '@/service/Expenses';
import IncomesService from '@/service/Incomes';
import BanksService from '@/service/Banks';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import MonthFilter from './MonthFilter.vue';
import TableTransactions from './TableTransactions.vue';
import Resume from './Resume.vue';
import ResumeBank from './ResumeBank.vue';
import ListBank from './ListBanks.vue';

const transactions = ref([])
const loading = ref(false)
const toast = useToast()
const totalIncomes = ref(0)
const totalExpenseToPay = ref(0)
const totalExpensePay = ref(0)
const banks = ref([]);
const totalAmountBank = ref(0)
const selectedMonth = ref('')


const currentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return { year, month }
}

// metodos api expense

const getTotalExpense = async () => {
  let year, month;

  if (selectedMonth.value) {
    [month, year] = selectedMonth.value.split('/');
  } else {
    const currentDateResult = currentDate();
    year = currentDateResult.year;
    month = currentDateResult.month;
  }

  const { status, response } = await ExpensesService.getTotalExpenses({ year: parseInt(year), month })
  return {
    total_expense_pay: response.total_expense_pay,
    total_expense_to_pay: response.total_expense_to_pay
  }
}

const getTotalIncomes = async () => {
  let year, month;

  if (selectedMonth.value) {
    [month, year] = selectedMonth.value.split('/');
  } else {
    const currentDateResult = currentDate();
    year = currentDateResult.year;
    month = currentDateResult.month;
  }

  const { status, response } = await IncomesService.getTotalIncomes({ year: parseInt(year), month })
  return response.total_income
}

const getExpenses = async () => {
  let year, month;

  if (selectedMonth.value) {
    [month, year] = selectedMonth.value.split('/');
  } else {
    const currentDateResult = currentDate();
    year = currentDateResult.year;
    month = currentDateResult.month;
  }

  const { status, response } = await ExpensesService.getExpenses({ year: parseInt(year), month })
  return response ?? []
}

const getIncomes = async () => {
  let year, month;

  if (selectedMonth.value) {
    [month, year] = selectedMonth.value.split('/');
  } else {
    const currentDateResult = currentDate();
    year = currentDateResult.year;
    month = currentDateResult.month;
  }

  const { status, response } = await IncomesService.getIncomes({ year: parseInt(year), month })
  return response ?? []
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

const saveTransaction = async ({ transaction, is_recurring, recurring_count, status, isIncome, id_bank, date_payment }) => {
  try {
    if (isIncome) {
      await IncomesService.createIncome({
        ...transaction,
        status,
        is_recurring,
        recurring_count,
        id_bank
      });
    } else {
      await ExpensesService.createExpense({
        ...transaction,
        status,
        is_recurring,
        recurring_count,
        id_bank,
        date_payment
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

const getBanks = async () => {
  const { status, response } = await BanksService.getBanks();
  return response ?? []
}

const saveBank = async ({ name, amount }) => {
  await BanksService.createBank({ name, amount });
  banks.value = await getBanks();
  totalAmountBank.value = banks.value.reduce((accumulator, bank) => accumulator + bank.amount, 0)
}

const onMonthChanged = (month) => {
  selectedMonth.value = month;
  init(); // Recarrega os dados para o mês selecionado
}

const init = async () => {
  try {
    loading.value = true;
    const incomes = await getIncomes();
    const expenses = await getExpenses();
    const totalExpenseResult = await getTotalExpense();
    const totalIncomesResult = await getTotalIncomes();
    banks.value = await getBanks();

    totalAmountBank.value = banks.value.reduce((accumulator, bank) => accumulator + bank.amount, 0)

    transactions.value = [...incomes, ...expenses];
    totalExpenseToPay.value = totalExpenseResult.total_expense_to_pay;
    totalExpensePay.value = totalExpenseResult.total_expense_pay;
    totalIncomes.value = totalIncomesResult;

    loading.value = false;


  } catch (error) {
    loading.value = false;
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error interno', life: 3000 });
    console.log('Error ao buscar os dados')
  }

  loading.value = false
}

// metodos api expense

init()
</script>
