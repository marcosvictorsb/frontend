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

  <Dialog v-model:visible="transactionDialog" :style="{ width: '450px' }" :header="title" :modal="true">
    <div class="flex flex-col gap-6">
      <div>
        <label for="description" class="block font-bold mb-3">Descrição</label>
        <InputText id="description" v-model.trim="transaction.description" required="true" autofocus
          :invalid="submitted && !transaction.description" fluid placeholder="Descrição" />
        <small v-if="submitted && !transaction.description" class="text-red-500">Descrição é obrigatório.</small>
      </div>

      <div class="col-span-12">
        <label for="status" class="block font-bold mb-3">Banco</label>
        <Select v-model="selectedBank" :options="banks" optionLabel="name" placeholder="Selecione o banco"
          class="w-full" fluid>
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <i class="text-2xl mb-4 text-surface-500 dark:text-surface-400 pi pi-calendar-clock"></i>
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </Select>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <label for="amount" class="block font-bold mb-3">Valor</label>
          <InputNumber id="amount" v-model="transaction.amount" mode="currency" currency="BRL" locale="pt-BR" fluid
            placeholder="Valor" />
        </div>

        <div class="col-span-6">
          <label for="status" class="block font-bold mb-3">Status</label>
          <Select v-model="selectedStatus" :options="getOptionSelectedStatus(isIncome)" optionLabel="name"
            placeholder="Selecione o status" class="w-full md:w-56">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <div class="mr-1">
                  <span>
                    <i :class="['pi', slotProps.option.icone || 'pi-palette']"></i>
                  </span>
                </div>
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
        </div>

        <div class="col-span-12" v-if="selectedStatus && selectedStatus.name === 'Pago'">
          <label for="status" class="block font-bold mb-3">Data Pagamento</label>
          <DatePicker name="date_payment" fluid v-model="date_payment" dateFormat="dd/mm/yy" />
        </div>

        <div class="col-span-2" v-if="!isEdit">
          <label for="recorrent" class="block font-bold mb-3">Recorrencia</label>
          <InputNumber v-model="recorrent" showButtons buttonLayout="horizontal" style="width: 1.5rem" :min="0"
            :max="99" class="text-right">
            <template #incrementIcon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementIcon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
      <Button v-if="!isEdit" label="Salvar" icon="pi pi-check" @click="saveTransaction(isIncome)" />
      <Button v-if="isEdit" label="Editar" icon="pi pi-check" @click="editedTransaction(isIncome)" />
    </template>
  </Dialog>

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
import { formatCurrency } from '@/shared/Utils'

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
const recorrent = ref(0);
const isEdit = ref(false);
const isIncome = ref(false);
const selectedBank = ref(null)
const date_payment = ref(null)
// comentario avulso

const props = defineProps({
  transactions: { type: Array, default: null },
  banks: { type: Array, default: null }
})

const emit = defineEmits([
  'delete:transaction',
  'save:transaction',
  'open:modalTransaction',
  'update:month',
  'edit:transaction'
])

const openNew = (isIncomeModal) => {
  transaction.value = {};
  submitted.value = false;
  transactionDialog.value = true;
  title.value = isIncomeModal ? 'Cria Receita' : 'Criar Despesa';
  selectedStatus.value = null;
  date_payment.value = null;
  selectedBank.value = null;
  isEdit.value = false;
  isIncome.value = isIncomeModal;
  recorrent.value = 0;
};

const hideDialog = () => {
  transactionDialog.value = false;
  selectedStatus.value = null;
  date_payment.value = null;
  selectedBank.value = null;
  submitted.value = false;
};

const saveTransaction = async () => {
  submitted.value = true;
  if (isIncome.value || selectedStatus.value.name === 'Pendente') {
    emit('save:transaction', {
      transaction: transaction.value,
      status: selectedStatus.value.name,
      is_recurring: recorrent.value > 0,
      recurring_count: recorrent.value,
      isIncome: isIncome.value,
      id_bank: selectedBank.value.id
    });
    transactionDialog.value = false;
    return
  }
  emit('save:transaction', {
    transaction: transaction.value,
    status: selectedStatus.value.name,
    is_recurring: recorrent.value > 0,
    recurring_count: recorrent.value,
    isIncome: isIncome.value,
    id_bank: selectedBank.value.id,
    date_payment: ajustDatePayment(date_payment.value)
  });

  submitted.value = false;
  transactionDialog.value = false;
};

const ajustDatePayment = (date) => {
  const dataOriginal = new Date(date);
  console.log(dataOriginal)
  const agora = new Date();

  date.setHours(agora.getHours());
  date.setMinutes(agora.getMinutes());
  date.setSeconds(agora.getSeconds());

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  };

  const dataFormatada = new Intl.DateTimeFormat('pt-BR', options)
    .format(dataOriginal)
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
    .replace(',', '');

  return dataFormatada;
}

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
  title.value = 'Editar Registro';
  transaction.value = { ...editTransaction, amount: editTransaction.amount / 100 };
  transactionDialog.value = true;
  isEdit.value = true;
  selectedStatus.value = {
    name: editTransaction.status,
    code: editTransaction.status === 'pago' ? 'pg' : 'pend'
  };
  date_payment.value = selectedStatus.value.name === 'Pago' ? new Date(transaction.value.date_payment) : null;
  selectedBank.value = props.banks.find((bank) => bank.id === transaction.value.id_bank);
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

const getOptionSelectedStatus = (isIncome) => {
  if (isIncome) {
    return [
      { name: 'Recebido', code: 'recebido', icone: 'pi-check' },
      { name: 'Aguardando Receber', code: 'aguardando receber', icone: 'pi-clock' },
    ];
  } else {
    return [
      { name: 'Pago', code: 'pago', icone: 'pi-money-bill' },
      { name: 'Pendente', code: 'pendente', icone: 'pi-exclamation-triangle' },
    ];
  }
}

</script>
