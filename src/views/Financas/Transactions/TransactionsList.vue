<template>
  <div class="w-full">
    <!-- Header com busca e ações -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h4 class="text-lg font-semibold text-gray-900 m-0">Gerenciar Transações</h4>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="searchTerm" placeholder="Buscar transações..." class="w-full sm:w-64" />
              </IconField>
            </div>
            <div class="flex gap-2">
              <Button label="Receita" icon="pi pi-plus" severity="success" size="small" @click="$emit('new-income')" />
              <Button label="Despesa" icon="pi pi-minus" severity="danger" size="small" @click="$emit('new-expense')" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros rápidos -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <div class="flex flex-wrap gap-2">
          <Button :label="`Todas (${filteredTransactions.length})`"
            :severity="selectedFilter === 'all' ? 'primary' : 'secondary'" :outlined="selectedFilter !== 'all'"
            size="small" @click="selectedFilter = 'all'" class="text-xs sm:text-sm" />
          <Button :label="`Receitas (${incomeCount})`" :severity="selectedFilter === 'income' ? 'success' : 'secondary'"
            :outlined="selectedFilter !== 'income'" size="small" @click="selectedFilter = 'income'"
            class="text-xs sm:text-sm" />
          <Button :label="`Despesas (${expenseCount})`"
            :severity="selectedFilter === 'expense' ? 'danger' : 'secondary'" :outlined="selectedFilter !== 'expense'"
            size="small" @click="selectedFilter = 'expense'" class="text-xs sm:text-sm" />
          <Button :label="`Pendentes (${pendingCount})`"
            :severity="selectedFilter === 'pending' ? 'warning' : 'secondary'" :outlined="selectedFilter !== 'pending'"
            size="small" @click="selectedFilter = 'pending'" class="text-xs sm:text-sm" />
        </div>
      </div>
    </div>

    <!-- Lista de transações -->
    <div v-if="props.loading" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="pi pi-spin pi-spinner text-4xl"></i>
      </div>
      <p class="text-gray-500 text-lg">Carregando transações...</p>
    </div>

    <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <i class="pi pi-inbox text-4xl"></i>
      </div>
      <p class="text-gray-500 text-lg mb-2">Nenhuma transação encontrada</p>
      <p class="text-gray-400 text-sm">
        {{ searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando sua primeira transação' }}
      </p>
    </div>

    <div v-else class="space-y-3">
      <!-- Card para cada transação -->
      <div v-for="transaction in paginatedTransactions" :key="transaction.id"
        class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 hover:shadow-sm">
        <div class="p-4">
          <!-- Header do card - Desktop -->
          <div class="hidden md:flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  transaction.type === 'receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                ]">
                  <i :class="transaction.type === 'receita' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-base">{{ transaction.description }}</h3>
                <p class="text-sm text-gray-500">{{ transaction.reference_month }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div :class="[
                  'font-bold text-lg',
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ formatCurrency(transaction.amount) }}
                </div>
                <div class="text-sm text-gray-500">{{ formatDate(transaction.date_payment) }}</div>
              </div>

              <div class="flex items-center space-x-2">
                <Tag :value="getStatusLabel(transaction.status)" :severity="getStatusSeverity(transaction.status)"
                  class="text-xs" />
                <Tag :value="getTypeLabel(transaction.type)" :severity="getTypeSeverity(transaction.type)"
                  class="text-xs" />
              </div>

              <div class="flex items-center space-x-1">
                <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
                  @click="$emit('edit-transaction', transaction)" v-tooltip.top="'Editar'" />
                <Button icon="pi pi-trash" severity="danger" text rounded size="small"
                  @click="$emit('delete-transaction', transaction)" v-tooltip.top="'Excluir'" />
              </div>
            </div>
          </div>

          <!-- Header do card - Mobile -->
          <div class="md:hidden">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  transaction.type === 'receita' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                ]">
                  <i
                    :class="transaction.type === 'receita' ? 'pi pi-arrow-up text-xs' : 'pi pi-arrow-down text-xs'"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-gray-900 text-sm truncate">{{ transaction.description }}</h3>
                  <p class="text-xs text-gray-500">{{ transaction.reference_month }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-1 flex-shrink-0">
                <Button icon="pi pi-pencil" severity="secondary" text rounded size="small"
                  @click="$emit('edit-transaction', transaction)" />
                <Button icon="pi pi-trash" severity="danger" text rounded size="small"
                  @click="$emit('delete-transaction', transaction)" />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500">Valor:</span>
                <span :class="[
                  'font-bold text-sm',
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ formatCurrency(transaction.amount) }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500">Data:</span>
                <span class="text-xs text-gray-700">{{ formatDate(transaction.date_payment) }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500">Status:</span>
                <Tag :value="getStatusLabel(transaction.status)" :severity="getStatusSeverity(transaction.status)"
                  class="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div v-if="filteredTransactions.length > itemsPerPage" class="mt-6">
      <Paginator :rows="itemsPerPage" :totalRecords="filteredTransactions.length" :rowsPerPageOptions="[10, 20, 50]"
        v-model:first="first" @page="onPageChange"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} transações" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatCurrency } from '@/shared/Utils'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['new-income', 'new-expense', 'edit-transaction', 'delete-transaction'])

// Estado da busca e filtros
const searchTerm = ref('')
const selectedFilter = ref('all')
const first = ref(0)
const itemsPerPage = ref(10)

// Computed para transações filtradas
const filteredTransactions = computed(() => {
  let filtered = props.transactions

  // Filtro por busca
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(transaction =>
      transaction.description?.toLowerCase().includes(search) ||
      transaction.reference_month?.toLowerCase().includes(search) ||
      transaction.status?.toLowerCase().includes(search) ||
      transaction.type?.toLowerCase().includes(search)
    )
  }

  // Filtro por tipo
  if (selectedFilter.value === 'income') {
    filtered = filtered.filter(t => t.type === 'receita')
  } else if (selectedFilter.value === 'expense') {
    filtered = filtered.filter(t => t.type === 'despesa')
  } else if (selectedFilter.value === 'pending') {
    filtered = filtered.filter(t => t.status === 'pendente' || t.status === 'aguardando receber')
  }

  return filtered
})

// Computed para contadores
const incomeCount = computed(() =>
  props.transactions.filter(t => t.type === 'receita').length
)

const expenseCount = computed(() =>
  props.transactions.filter(t => t.type === 'despesa').length
)

const pendingCount = computed(() =>
  props.transactions.filter(t => t.status === 'pendente' || t.status === 'aguardando receber').length
)

// Computed para paginação
const paginatedTransactions = computed(() => {
  const start = first.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// Watchers
watch(searchTerm, () => {
  first.value = 0 // Reset pagination when searching
})

watch(selectedFilter, () => {
  first.value = 0 // Reset pagination when filtering
})

// Métodos
const onPageChange = (event) => {
  first.value = event.first
  itemsPerPage.value = event.rows
}

const formatDate = (date) => {
  if (!date) return ''

  const dateObj = new Date(date)
  const day = String(dateObj.getUTCDate()).padStart(2, '0')
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
  const year = dateObj.getUTCFullYear()

  return `${day}/${month}/${year}`
}

const getStatusLabel = (status) => {
  const statusMap = {
    'pago': 'Pago',
    'pendente': 'Pendente',
    'recebido': 'Recebido',
    'aguardando receber': 'Aguardando'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'pago': 'success',
    'pendente': 'warning',
    'recebido': 'success',
    'aguardando receber': 'warning'
  }
  return severityMap[status] || 'secondary'
}

const getTypeLabel = (type) => {
  return type === 'receita' ? 'Receita' : 'Despesa'
}

const getTypeSeverity = (type) => {
  return type === 'receita' ? 'success' : 'danger'
}
</script>

<style scoped>
/* Estilos customizados se necessário */
</style>
