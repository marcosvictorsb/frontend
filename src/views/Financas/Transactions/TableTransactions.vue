
<template>
  <div>
    <div class="card mt-2">
      <Toolbar class="mb-6">
          <template #start>
              
          </template>

          <template #end>
              <Button label="Receita" icon="pi pi-dollar"  severity="success" @click="openNew(isIncome = true)"/>
              <Button label="Despesa" icon="pi pi-shopping-cart" severity="warn" class="ml-2" @click="openNew(isIncome = false)" />
              <!-- <Button label="Delete" icon="pi pi-trash" severity="danger"  class="ml-1" outlined @click="confirmDeleteSelected" :disabled="!selectedTransactions || !selectedTransactions.length" />               -->
          </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedTransactions"
        :value="transactions"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        :size="'small'"
      >
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

          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column field="description" header="Descrição" sortable style="min-width: 12rem"></Column>
          <Column field="amount" header="Valor" sortable style="min-width: 16rem">
            <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
            </template>
          </Column>
          <Column field="reference_month" header="Mês de Referência" sortable style="min-width: 16rem"></Column>
          <Column field="type" header="Tipo" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="getSeverityType(slotProps.data)" />
            </template>
          </Column>
          <Column field="status" header="Status" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getSeverityStatus(slotProps.data)" />
            </template>
          </Column> 
          
          <Column :exportable="false" header="Ações" style="min-width: 12rem">
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
          <InputText id="description" v-model.trim="transaction.description" required="true" autofocus :invalid="submitted && !transaction.description" fluid  placeholder="Descrição" />
          <small v-if="submitted && !transaction.description" class="text-red-500">Descrição é obrigatório.</small>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="amount" class="block font-bold mb-3">Valor</label>
            <InputNumber id="amount" v-model="transaction.amount" mode="currency" currency="BRL" locale="pt-BR" fluid placeholder="Valor" />
          </div>

          <div class="col-span-6">
            <label for="status" class="block font-bold mb-3">Status</label>
            <Select v-model="selectedStatus" :options="getOptionSelectedStatus(isIncome)" optionLabel="name" placeholder="Selecione o status" class="w-full md:w-56">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                  <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code}`" style="width: 18px" />
                  <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center">
                  <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code}`" style="width: 18px" />
                  <div>{{ slotProps.option.name }}</div>
                </div>
              </template>
            </Select>
          </div>

          <div class="col-span-2" v-if="!isEdit">
            <label for="recorrent" class="block font-bold mb-3">Recorrencia</label>
            <InputNumber v-model="recorrent" showButtons buttonLayout="horizontal" style="width: 1.5rem" :min="0" :max="99" class="text-right">
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
            <span v-if="transaction"
                >Tem certeza de que deseja excluir <b>{{ transaction.description }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteTransactionDialog = false" />
            <Button label="Sim" icon="pi pi-check" @click="deleteTransaction" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="product">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
        </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const dt = ref();
const products = ref();
const transactionDialog = ref(false);
const deleteTransactionDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedTransactions = ref([]);
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);

const transaction = ref();
const selectedStatus = ref(null);
const title = ref('');
const recorrent = ref(0);
const isEdit = ref(false);
const isIncome = ref(false);

defineProps({
  transactions: { type: Array, default: null },
})

const emit = defineEmits([
  'delete:transaction',
  'save:transaction',
  'open:modalTransaction',
  'update:month',
])

const formatCurrency = (value) => {
  if(value !== null && value !== undefined) {
    const amount = value / 100;
    return amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  } 
  return 'R$ 0,00';
};

const openNew = (isIncomeModal) => {
  transaction.value = {};
  submitted.value = false;
  transactionDialog.value = true;
  title.value = 'Novo Registro';
  selectedStatus.value = null
  isEdit.value = false;
  isIncome.value = isIncomeModal;
};

const hideDialog = () => {
  transactionDialog.value = false;
  submitted.value = false;
};

const saveTransaction = async () => {
  submitted.value = true;
  emit('save:transaction', {
    transaction: transaction.value,
    status: selectedStatus.value.name,
    is_recurring: recorrent.value > 0,
    recurring_count: recorrent.value,
    isIncome
  });
  submitted.value = false;
  transactionDialog.value = false;
};

const editTransaction = (editTransaction) => {
  title.value = 'Editar Registro';
  transaction.value = {...editTransaction, amount: editTransaction.amount / 100};
  transactionDialog.value = true;
  isEdit.value = true;
  selectedStatus.value = {
    name: editTransaction.status,
    code: editTransaction.status === 'pago' ? 'pg' : 'pend'
  };
};

const editedTransaction = () => {
  emit('edit:transaction', { 
    id: transaction.value.id,
    description: transaction.value.description,
    status: selectedStatus.value.name,
    amount: transaction.value.amount * 100,
    isIncome: transaction.value.type === 'receita',
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


const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
  products.value = products.value.filter(val => !selectedProducts.value.includes(val));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
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
  if(isIncome) {
    return [
      { name: 'Recebido', code: 'recebido' },
      { name: 'Aguardando Receber', code: 'aguardando receber' },
    ];
  } else {
    return [
      { name: 'Pago', code: 'pago' },
      { name: 'Pendente', code: 'pendente' },
    ];
  }
}

</script>
