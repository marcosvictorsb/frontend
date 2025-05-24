<template>
  <Dialog v-model:visible="localVisible" :style="{ width: '555px' }" :header="title" :modal="true">
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
            placeholder="Selecione o status" class="w-full md:w-100">
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

        <div class="col-span-6" v-if="selectedStatus && selectedStatus.name === 'Pago'">
          <label for="status" class="block font-bold mb-3">Data Pagamento</label>
          <DatePicker name="date_payment" fluid v-model="date_payment" dateFormat="dd/mm/yy" />
        </div>

        <div class="col-span-6">
          <label for="recorrent" class="block font-bold mb-3">Recorrencia</label>
          <InputNumber v-model="recorrent" showButtons buttonLayout="horizontal" :min="0" :max="99"
            class="text-right w-1.5">
            <template #incrementIcon>
              <span class=" pi pi-plus" />
            </template>
            <template #decrementIcon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="emits('hide:modal')" />
      <Button v-if="!isEdit" label="Salvar" icon="pi pi-check" @click="saveTransaction(isIncome)" />
      <Button v-if="isEdit" label="Editar" icon="pi pi-check" @click="editedTransaction(isIncome)" />
    </template>
  </Dialog>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ajustDatePayment } from '@/shared/Utils'


const props = defineProps({
  transaction: {
    type: Object,
    required: true
  },
  banks: {
    type: Array,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isIncome: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Adicionar Transação'
  },
  showModalExpenseIncome: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['save:transaction', 'edited:transaction', 'hide:modal']);

const localVisible = ref(props.showModalExpenseIncome);

const submitted = ref(false);

watch(() => props.showModalExpenseIncome, (newVal) => {
  localVisible.value = newVal;
});

watch(localVisible, (newVal) => {
  if (!newVal) {
    emits('hide:modal');
  }
});

// Add these inside the script setup
const selectedBank = ref(props.transaction.id_bank ? props.banks.find(bank => bank.id === props.transaction.id_bank) : null);
const selectedStatus = ref(props.transaction.status ? getOptionSelectedStatus(props.isIncome).find(opt => opt.name === props.transaction.status) : null);
const date_payment = ref(props.transaction.date_payment ? new Date(props.transaction.date_payment) : null);
const recorrent = ref(props.transaction.recurring_count || 0);

watch(() => props.transaction, (newVal) => {
  if (newVal && newVal.id) {
    selectedBank.value = props.banks.find(bank => bank.id === newVal.id_bank);
    selectedStatus.value = getOptionSelectedStatus(props.isIncome)
      .find(opt => opt.name === newVal.status);
    date_payment.value = newVal.date_payment ? new Date(newVal.date_payment) : null;
    recorrent.value = newVal.recurring_count || 0;
  } else {
    selectedBank.value = null;
    selectedStatus.value = null;
    date_payment.value = null;
    recorrent.value = 0;
  }
}, { deep: true });


const saveTransaction = async () => {
  submitted.value = false;
  if (props.isIncome || selectedStatus.value.name === 'Pendente') {
    emits('save:transaction', {
      transaction: props.transaction,
      status: selectedStatus.value.name,
      is_recurring: recorrent.value > 0,
      recurring_count: recorrent.value,
      isIncome: props.isIncome,
      id_bank: selectedBank.value.id
    });
    emits('hide:modal');
    reset();
    return
  }
  emits('save:transaction', {
    transaction: props.transaction,
    status: selectedStatus.value.name,
    is_recurring: recorrent.value > 0,
    recurring_count: recorrent.value,
    isIncome: props.isIncome,
    id_bank: selectedBank.value.id,
    date_payment: ajustDatePayment(date_payment.value)
  });
  reset();

  submitted.value = false;
  emits('hide:modal');
};

const editedTransaction = (isIncome) => {
  if (isIncome) {
    transaction.type = 'income';
  } else {
    transaction.type = 'expense';
  }

  if (selectedStatus && selectedStatus.name === 'Pago') {
    transaction.date_payment = date_payment;
  }

  transaction.bank_id = selectedBank.id;
  transaction.recorrent = recorrent;

  emits('edited:transaction', transaction);
};

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

const reset = () => {
  selectedBank.value = null;
  selectedStatus.value = null;
  date_payment.value = null;
  recorrent.value = 0;
  submitted.value = false;
}


</script>
<style scoped></style>