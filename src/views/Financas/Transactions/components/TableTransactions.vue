<template>
  <div class="card mt-2">
    <Toolbar class="mb-6">
      <template #start>

      </template>

      <template #end>
        <Button label="Receita" icon="pi pi-dollar" severity="success" @click="openNew(isIncome = true)" />
        <Button label="Despesa" icon="pi pi-shopping-cart" severity="warn" class="ml-2"
          @click="openNew(isIncome = false)" />
        <!-- <Button label="Delete" icon="pi pi-trash" severity="danger"  class="ml-1" outlined @click="confirmDeleteSelected" :disabled="!selectedTransactions || !selectedTransactions.length" />               -->
      </template>
    </Toolbar>

    <DataTable ref="dt" v-model:selection="selectedTransactions" :value="transactions" dataKey="id" :paginator="true"
      :rows="10" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate=" Mostrando {first} a {last} de {totalRecords} registros" :size="'small'">

      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">Gerencias os Gastos</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Procurar..." />
          </IconField>
        </div>
      </template>

      <template #empty>
        Nenhuma despesa ou receita cadastrada
      </template>

      <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
      <Column field="description" header="Descrição" sortable style="min-width: 12rem"></Column>
      <Column field="amount" header="Valor" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
      </Column>
      <Column field="reference_month" header="Mês de Referência" sortable style="min-width: 8rem"></Column>
      <Column field="date_payment" header="Data do Pagamento" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ ajustDateToColumn(slotProps.data.date_payment) }}
        </template>
      </Column>
      <Column field="type" header="Tipo" sortable style="min-width: 8rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.type" :severity="getSeverityType(slotProps.data)" />
        </template>
      </Column>
      <Column field="status" header="Status" sortable style="min-width: 8rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverityStatus(slotProps.data)" />
        </template>
      </Column>

      <Column :exportable="false" header="Ações" style="min-width: 6rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editTransaction(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>

  <Dialog v-model:visible="deleteTransactionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="transaction">Tem certeza de que deseja excluir <b>{{ transaction.description }}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" text @click="deleteTransactionDialog = false" />
      <Button label="Sim" icon="pi pi-check" @click="deleteTransaction" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { formatCurrency } from '@/shared/Utils';

const dt = ref();
const transactionDialog = ref(false);
const deleteTransactionDialog = ref(false);
const selectedTransactions = ref([]);
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

const transaction = ref();
const selectedStatus = ref(null);
const title = ref('');
const isEdit = ref(false);
const isIncome = ref(false);
const selectedBank = ref(null)
const date_payment = ref(null)

const props = defineProps({
  transactions: { type: Array, default: null },
  banks: { type: Array, default: null }
})

const emit = defineEmits([
  'delete:transaction',
  'open:modalTransaction',
  'update:month',
  'edit:transaction',
  'open:modalExpenseIncome'
])

const openNew = (isIncomeModal) => {
  emit('open:modalExpenseIncome', {
    expense: {},
    isIncome: isIncomeModal,
  });
};


const ajustDateToColumn = (date) => {
  if (typeof date === 'undefined' || date === null) {
    return ''
  }

  const dataOriginal = new Date(date);
  const dia = String(dataOriginal.getUTCDate()).padStart(2, '0');
  const mes = String(dataOriginal.getUTCMonth() + 1).padStart(2, '0'); // Mês é 0-based
  const ano = dataOriginal.getUTCFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada
}

const editTransaction = (editTransaction) => {
  emit('open:modalExpenseIncome', {
    isIncome: editTransaction.type === 'receita',
    expense: {
      id: editTransaction.id,
      description: editTransaction.description,
      amount: editTransaction.amount / 100,
      type: editTransaction.type,
      id_bank: editTransaction.id_bank,
      date_payment: editTransaction.date_payment,
      status: {
        name: editTransaction.status === 'pago' ? 'Pago' :
          editTransaction.status === 'pendente' ? 'Pendente' :
            editTransaction.status === 'recebido' ? 'Recebido' : 'Aguardando Receber',
        code: editTransaction.status
      }
    },
    selectedStatus: {
      name: editTransaction.status === 'pago' ? 'Pago' :
        editTransaction.status === 'pendente' ? 'Pendente' :
          editTransaction.status === 'recebido' ? 'Recebido' : 'Aguardando Receber',
      code: editTransaction.status
    },
    selectedBank: props.banks.find(bank => bank.id === editTransaction.id_bank),
    recorrent: editTransaction.recurring_count || 0
  });
};


const editedTransaction = () => {
  emit('edit:transaction', {
    id: transaction.value.id,
    description: transaction.value.description,
    status: selectedStatus.value.name,
    amount: transaction.value.amount * 100,
    isIncome: transaction.value.type === 'receita',
    id_bank: selectedBank.value.id,
    date_payment: ajustDatePayment(date_payment.value)
  });
  submitted.value = false;
  transactionDialog.value = false;
};


const confirmDeleteProduct = (prod) => {
  transaction.value = prod;
  deleteTransactionDialog.value = true;
};

const deleteTransaction = async () => {
  emit('delete:transaction', {
    id: transaction.value.id,
    isIncome: transaction.value.type === 'receita',
  });
  deleteTransactionDialog.value = false;
};

const getSeverityStatus = (status) => {
  switch (status.status) {
    case 'pago':
      return 'success';
    case 'pendente':
      return 'warn';
    case 'recebido':
      return 'success';
    case 'aguardando receber':
      return 'warn';
  }
}

const getSeverityType = (status) => {
  switch (status.type) {
    case 'despesa':
      return 'danger';
    case 'receita':
      return 'success';
  }
}



</script>
