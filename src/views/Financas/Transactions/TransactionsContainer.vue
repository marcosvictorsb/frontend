<template>
  <ConfirmDialog :pt="{ content: { style: { fontSize: '18px' } } }" />
  <Loading v-if="loading" />
  <Toast />
  <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
    <div class="md:col-start-1 md:col-end-9">
      <Resume :totalExpenseToPay="totalExpenseToPay" :totalExpensePay="totalExpensePay" :totalIncomes="totalIncomes" />
      <TableTransactions :transactions="transactions" :banks="banks" @delete:transaction="deleteTransaction"
        @edit:transaction="editTransaction" @open:modalExpenseIncome="openModalExpenseIncome" />
      />
    </div>
    <div class="md:col-start-9 md:col-end-13">
      <ResumeBank :totalAmount="totalAmountBank" @save:bank="saveBank" />
      <ListBank :banks="banks" open:modal-bank="" />
    </div>
  </div>

  <ModalExpenseIncome :showModalExpenseIncome="showModalExpenseIncome" :transaction="transaction"
    :isIncome="isIncomeModal" :title="title" :banks="banksUser" @hide:modal="showModalExpenseIncome = false"
    @save:transaction="saveTransaction" @edit:transaction="editTransaction" />


</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue';
import ExpensesService from '@/service/Expenses';
import IncomesService from '@/service/Incomes';
import BanksService from '@/service/Banks';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import TableTransactions from './components/TableTransactions.vue';
import Resume from './components/Resume.vue';
import ResumeBank from './components/banks/ResumeBank.vue';
import ListBank from './components/banks/ListBanks.vue';
import ModalExpenseIncome from './components/modais/ModalExpenseIncome.vue';

const transactions = ref([])
const transaction = ref({})
const loading = ref(false)
const toast = useToast()
const totalIncomes = ref(0)
const totalExpenseToPay = ref(0)
const totalExpensePay = ref(0)
const banks = ref([]);
const banksUser = ref([])
const totalAmountBank = ref(0)
const isIncomeModal = ref(false)
const title = ref('');
const isEditModalExpenseIncome = ref(false)
const showModalExpenseIncome = ref(false)
const selectedStatusModal = ref(null);
const selectedBankModal = ref(null);
const recorrentModal = ref(0);


const currentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return { year, month }
}

// function emits 
const openModalExpenseIncome = ({
  isIncome,
  expense,
  selectedStatus,
  selectedBank,
  recorrent
}) => {

  transaction.value = !expense || Object.keys(expense).length === 0 ? {} : expense;
  banksUser.value = banks.value;
  isEditModalExpenseIncome.value = expense && expense.id ? true : false;
  isIncomeModal.value = isIncome;
  title.value = isIncome ?
    (isEditModalExpenseIncome.value ? 'Editar Receita' : 'Adicionar Receita') :
    (isEditModalExpenseIncome.value ? 'Editar Despesa' : 'Adicionar Despesa');
  showModalExpenseIncome.value = true;

  // Pass these values to the modal component
  if (isEditModalExpenseIncome.value) {
    // These will be picked up by ModalExpenseIncome's watch or setup
    transaction.value = expense;
    selectedStatusModal.value = selectedStatus;
    selectedBankModal.value = selectedBank;
    recorrentModal.value = recorrent;
  }
};


// metodos api expense

const getTotalExpense = async () => {
  const { status, response } = await ExpensesService.getTotalExpenses()
  return {
    total_expense_pay: response.total_expense_pay,
    total_expense_to_pay: response.total_expense_to_pay
  }
}

const getTotalIncomes = async () => {
  const { status, response } = await IncomesService.getTotalIncomes()
  return response.total_income
}

const getExpenses = async () => {
  const { year, month } = currentDate()
  const { status, response } = await ExpensesService.getExpenses({ year, month })
  return response ?? []
}

const getIncomes = async () => {
  const { year, month } = currentDate()
  const { status, response } = await IncomesService.getIncomes({ year, month })
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
