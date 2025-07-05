<template>
  <Loading v-if="loading" />
  <Toast />
  <ModalCategories :visible="isVisibleModalCategory" @close:modal="closeCategoryDialog" @save:category="saveCategory" />
  <Dialog v-model:visible="isVisible" modal closable header="Cadastrar transação" :style="{ width: '40rem' }"
    class="p-fluid" @update:visible="testar">
    <!-- Mensagem de erro global -->
    <Message v-if="errorMessage" severity="error" :closable="true" @close="errorMessage = ''">
      {{ errorMessage }}
    </Message>
    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <InputText v-model="transaction.name" inputId="on_label" fluid required="true"
          :invalid="submitted && !transaction.name" />
        <label for="on_label">Nome da transação</label>
      </FloatLabel>
      <small v-if="submitted && !transaction.name" class="text-red-500 block mt-1">
        Nome da transação é obrigatório
      </small>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <DatePicker v-model="buttondisplay" showIcon fluid :showOnFocus="false" :default-value="defaultDate" />
        <!-- <Calendar
          v-model="transaction.date"
          inputId="date"
          fluid
          required="true"
          dateFormat="dd/mm/yy"
          :invalid="submitted && !transaction.date"
          :defaultValue="defaultDate"
        /> -->
        <label for="date">Data da Transação</label>
      </FloatLabel>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <InputNumber v-model="transaction.value" inputId="valorTransacao" mode="currency" currency="BRL" locale="pt-BR"
          fluid :invalid="(transaction.value <= 0) || (submitted && !transaction.value)" />
        <label for="valorTransacao">Valor da transação</label>
      </FloatLabel>
      <small v-if="submitted && !transaction.value" class="text-red-500 block mt-1">
        Valor da transação é obrigatório
      </small>
      <small v-else-if="transaction.value <= 0" class="text-red-500 block mt-1">
        Valor deve ser maior que zero
      </small>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <Select v-model="transaction.account" :options="props.accounts" filter
          filterPlaceholder="Digite a conta bancaria" optionLabel="name_bank" class="w-full" inputId="accounts"
          :invalid="submitted && !transaction.account" placeholder="Selecione a conta bancaria">
          <template #header>
            <div class="font-medium p-3">Contas bancarias disponíveis</div>
          </template>
        </Select>
        <label for="accounts">Conta Bancaria</label>
      </FloatLabel>
      <small v-if="submitted && !transaction.account" class="text-red-500 block mt-1">
        Conta bancária é obrigatória
      </small>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <Select v-model="transaction.payment_method" :options="payment_methods" filter
          filterPlaceholder="Digite o meio de pagamento" optionLabel="name" class="w-full" inputId="payment_method"
          :invalid="submitted && !transaction.payment_method">
          <template #header>
            <div class="font-medium p-3">Meios de pagamentos disponíveis</div>
          </template>
        </Select>
        <label for="payment_method">Meio de Pagamento</label>
      </FloatLabel>
      <small v-if="submitted && !transaction.payment_method" class="text-red-500 block mt-1">
        Meio de pagamento é obrigatório
      </small>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <Select v-model="transaction.category" :options="props.categories" filter filterPlaceholder="Digite a categoria"
          optionLabel="name" class="w-full" inputId="transaction.category"
          :invalid="submitted && !transaction.category?.name">
          <template #header>
            <div class="font-medium p-3">Categorias disponível</div>
          </template>
          <template #footer>
            <div class="p-3">
              <Button label="Adicionar nova categoria" fluid raised size="small" icon="pi pi-plus" severity="info"
                @click="showAddCategoryDialog()" />
            </div>
          </template>
        </Select>
        <label for="transaction.category">Categoria</label>
      </FloatLabel>
      <small v-if="submitted && !transaction.category?.name" class="text-red-500 block mt-1">
        Categoria é obrigatória
      </small>
    </div>

    <div class="flex mb-4 mt-2 items-center">
      <label for="email" class="font-semibold w-24">Tipo</label>
      <SelectButton v-model="transaction.operation" :options="typesOperation" aria-labelledby="basic"
        :invalid="submitted && !transaction.operation" />
      <small v-if="submitted && !transaction.operation" class="text-red-500 block ml-2">
        Tipo é obrigatório
      </small>
    </div>

    <div class="flex mb-4 mt-2 items-center">
      <label for="email" class="font-semibold w-24">Status</label>
      <SelectButton v-model="transaction.status" :options="typesStatus" aria-labelledby="basic"
        :invalid="submitted && !transaction.status" />
      <small v-if="submitted && !transaction.status" class="text-red-500 block ml-2">
        Status é obrigatório
      </small>
    </div>

    <div class="flex mb-4 mt-2 items-center">
      <label for="email" class="font-semibold w-24">Formato</label>
      <SelectButton v-model="transaction.format" :options="typesFormat" aria-labelledby="basic"
        :invalid="submitted && !transaction.format" />
      <small v-if="submitted && !transaction.format" class="text-red-500 block ml-2">
        Formato é obrigatório
      </small>
    </div>

    <div class="mb-4 mt-2" v-if="transaction.format === 'Recorrente'">
      <FloatLabel variant="on">
        <Select v-model="transaction.amount_recurrence" :options="recurrence" class="w-full" inputId="recurrence"
          :invalid="submitted && transaction.format === 'Recorrente' && (!transaction.amount_recurrence || transaction.amount_recurrence <= 0)" />
        <label for="recurrence">Quantidade de Recorrência</label>
      </FloatLabel>
      <small
        v-if="submitted && transaction.format === 'Recorrente' && (!transaction.amount_recurrence || transaction.amount_recurrence <= 0)"
        class="text-red-500 block mt-1">
        Quantidade de recorrência é obrigatória para transações recorrentes
      </small>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancelar" severity="secondary" @click="closeModal()"></Button>
      <Button type="button" label="Salvar" @click="saveTransaction()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import Loading from '@/components/Loading/Loading.vue'
import CategoryService from '@/service/Categories'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'
import ModalCategories from '../Categories/ModalCategories.vue'

const isVisible = ref(false)
const transaction = ref({
  name: '',
  value: 0,
  account: {
    id: '',
    balance: 0,
    fullNameBank: '',
    icon: '',
  },
  payment_method: '',
  category: {
    id: '',
    name: '',
    icon: '',
  },
  format: '',
  operation: '',
  amount_recurrence: 0,
  date: '',
})
const typesFormat = ref(['Único', 'Recorrente'])
const recurrence = ref([1, 2, 3, 4, 5, 10, 15, 20])
const typesOperation = ref(['Entrada', 'Saída'])
const payment_methods = ref([
  { name: 'Depósito' },
  { name: 'Dinheiro' },
  { name: 'Empréstimo' },
  { name: 'Transferencia' },
  { name: 'Pix' },
])
const typesStatus = ref(['Pago', 'A pagar', 'Recebido'])
const submitted = ref(false)
const isVisibleModalCategory = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const data = new Date()
const dia = String(data.getDate()).padStart(2, '0')
const mes = String(data.getMonth() + 1).padStart(2, '0') // Mês começa do zero
const ano = data.getFullYear()

const dataFormatada = `${dia}/${mes}/${ano}`
const defaultDate = ref(dataFormatada)

const toast = useToast()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },

  categories: {
    type: Array,
    required: true,
  },

  accounts: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close:modal', 'save:transaction', 'saved:category'])

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue
  },
)
const clearForms = () => {
  transaction.value = {
    name: '',
    value: 0,
    account: {
      id: '',
      balance: 0,
      fullNameBank: '',
      icon: '',
    },
    payment_method: '',
    category: {
      id: '',
      name: '',
      icon: '',
    },
    format: '',
    operation: '',
    amount_recurrence: 0,
    date: '',
  }
  errorMessage.value = ''
  submitted.value = false
}

const closeModal = () => {
  clearForms()
  emit('close:modal')
}

const testar = () => {
  emit('close:modal')
}

const isValidForm = () => {
  const errors = []

  if (!transaction.value.name) errors.push('Nome da transação é obrigatório')
  if (!transaction.value.value || transaction.value.value <= 0) errors.push('Valor deve ser maior que zero')
  if (!transaction.value.payment_method) errors.push('Meio de pagamento é obrigatório')
  if (!transaction.value.category?.name) errors.push('Categoria é obrigatória')
  if (!transaction.value.format) errors.push('Formato é obrigatório')
  if (!transaction.value.operation) errors.push('Tipo de operação é obrigatório')
  if (!transaction.value.status) errors.push('Status é obrigatório')
  if (!transaction.value.account) errors.push('Conta bancária é obrigatória')

  if (transaction.value.format === 'Recorrente' && (!transaction.value.amount_recurrence || transaction.value.amount_recurrence <= 0)) {
    errors.push('Quantidade de recorrência é obrigatória para transações recorrentes')
  }

  if (errors.length > 0) {
    errorMessage.value = 'Por favor, corrija os seguintes erros: ' + errors.join(', ')
    return false
  }

  errorMessage.value = ''
  return true
}

const saveTransaction = () => {
  submitted.value = true
  errorMessage.value = ''

  if (isValidForm()) {
    submitted.value = false

    try {
      const transactionPayload = {
        name: transaction.value.name,
        value: transaction.value.value,
        payment_method: transaction.value.payment_method.name,
        format: transaction.value.format,
        operation: transaction.value.operation,
        status: transaction.value.status,
        id_category: transaction.value.category.id,
        id_account: transaction.value.account.id,
      }

      emit('save:transaction', transactionPayload)
      clearForms()
    } catch (error) {
      errorMessage.value = 'Erro ao salvar a transação. Tente novamente.'
      console.error('Erro ao salvar transação:', error)
    }
  }
}

const showAddCategoryDialog = () => {
  isVisibleModalCategory.value = true
}

const closeCategoryDialog = () => {
  isVisibleModalCategory.value = false
}

const saveCategory = async (category) => {
  try {
    const { status } = await CategoryService.create(category)
    if (status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Categoria Salva!',
        detail: 'A categoria foi salva com sucesso',
        life: 3000,
      })
      closeCategoryDialog()
      emit('saved:category')
    }

    loading.value = false
  } catch (error) {
    console.log(error)
    if (error.status === 409) {
      toast.add({
        severity: 'warn',
        summary: 'Categoria Já Existe!',
        detail: 'Já existe uma categoria com esse nome',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Falha',
        detail:
          'Não foi possível salvar a categoria. Por favor, tente novamente',
        life: 3000,
      })
    }
    loading.value = false
    return
  }
}
</script>
