
<template>
  <div class="financial-forecast-calendar">
    <!-- Header do Calendário (alterado) -->
    <Card class="mb-4">
      <template #content>
        <div class="flex items-center justify-between">
          <Button @click="previousMonth" icon="pi pi-chevron-left" text rounded
            class="hover:bg-surface-100 dark:hover:bg-surface-800" />

          <div class="text-center">
            <h2 class="text-xl font-semibold text-surface-950 dark:text-surface-0 mb-2">
              {{ formatMonthYear(currentMonth) }}
            </h2>
            <div class="text-sm text-surface-500 dark:text-white/72">
              <span>Receita Total: {{ formatCurrency(forecastData?.totalIncome || 0) }}</span>
              <span class="mx-2">•</span>
              <span>Despesa Total: {{ formatCurrency(forecastData?.totalExpense || 0) }}</span>
              <span class="mx-2">•</span>
              <span>Saldo Final:
                <span :class="forecastData?.performance >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatCurrency(forecastData?.performance || 0) }}
                </span>
              </span>
            </div>
          </div>

          <Button @click="nextMonth" icon="pi pi-chevron-right" text rounded
            class="hover:bg-surface-100 dark:hover:bg-surface-800" />
        </div>
      </template>
    </Card>

    <!-- Legenda das Cores (alterada) -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-wrap gap-4 justify-center items-center">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Saldo positivo</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Saldo próximo de zero</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Saldo negativo</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Grid do Calendário (alterado) -->
    <Card>
      <template #content>
        <!-- Cabeçalho dos dias da semana (mantido) -->
        <div class="grid grid-cols-7 gap-2 md:gap-3 mb-3">
          <div v-for="dayName in dayNames" :key="dayName"
            class="text-center text-sm font-medium text-surface-500 dark:text-white/72 p-2">
            {{ dayName }}
          </div>
        </div>

        <!-- Grid dos dias do mês (melhorado) -->
        <div class="grid grid-cols-7 gap-2 md:gap-3">
          <!-- Dias vazios do início do mês (mantido) -->
          <div v-for="emptyDay in startEmptyDays" :key="`empty-start-${emptyDay}`" class="aspect-square"></div>

          <!-- Dias do mês (melhorado) -->
          <div v-for="day in daysInMonth" :key="day"
            class="relative aspect-square border rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 p-1"
            :class="getDayClasses(day)" @click="showDayDetails($event, day)">

            <!-- Container principal do dia -->
            <div class="h-full flex flex-col justify-between relative">

              <!-- Badges de transações no topo -->
              <div class="absolute top-1 right-1 z-10">
                <div v-if="(getDayData(day)?.expenses?.length || getDayData(day)?.incomes?.length)"
                  class="flex items-center gap-1">
                  <!-- Badge de receitas -->
                  <div v-if="getDayData(day)?.incomes?.length > 0"
                    class="w-4 h-4 md:w-5 md:h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                    :title="`${getDayData(day).incomes.length} receita(s)`">
                    {{ getDayData(day).incomes.length }}
                  </div>

                  <!-- Badge de despesas -->
                  <div v-if="getDayData(day)?.expenses?.length > 0"
                    class="w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                    :title="`${getDayData(day).expenses.length} despesa(s)`">
                    {{ getDayData(day).expenses.length }}
                  </div>
                </div>
              </div>

              <!-- Número do dia centralizado (MELHORADO) -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-2xl md:text-3xl font-black text-gray-400 dark:text-gray-500 opacity-80 select-none">
                  {{ day }}
                </div>
              </div>

              <!-- Indicadores de fluxo no centro superior -->
              <div v-if="getDayData(day)?.income || getDayData(day)?.expense"
                class="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
                <div
                  class="flex items-center gap-0.5 bg-white/90 dark:bg-surface-800/90 rounded-full px-2 py-0.5 shadow-sm">
                  <!-- Seta de entrada -->
                  <div v-if="getDayData(day)?.income > 0" class="text-green-600 text-sm font-bold"
                    :title="`Receita: ${formatCurrency(getDayData(day).income)}`">
                    ↑
                  </div>

                  <!-- Seta de saída -->
                  <div v-if="getDayData(day)?.expense > 0" class="text-red-600 text-sm font-bold"
                    :title="`Despesa: ${formatCurrency(getDayData(day).expense)}`">
                    ↓
                  </div>
                </div>
              </div>

              <!-- Saldo no rodapé -->
              <div v-if="getDayData(day)?.runningBalance !== undefined"
                class="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-10">
                <div class="text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow-md border border-white/50"
                  :class="getDayData(day).runningBalance >= 0
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'">
                  {{ formatCurrencyShort(getDayData(day).runningBalance) }}
                </div>
              </div>

              <!-- Indicador de status no canto (mini dot) -->
              <div v-if="getDayData(day)" class="absolute top-1 left-1 w-2 h-2 rounded-full shadow-sm"
                :class="getDayData(day).runningBalance > 0 ? 'bg-green-400' : getDayData(day).runningBalance === 0 ? 'bg-yellow-400' : 'bg-red-400'">
              </div>
            </div>
          </div>

          <!-- Dias vazios do final do mês (mantido) -->
          <div v-for="emptyDay in endEmptyDays" :key="`empty-end-${emptyDay}`" class="aspect-square"></div>
        </div>
      </template>
    </Card>

    <!-- Tooltip/OverlayPanel para detalhes do dia (alterado) -->
    <OverlayPanel ref="dayDetailsPanel" class="w-80">
      <div v-if="selectedDayData">
        <h4 class="font-semibold text-surface-950 dark:text-surface-0 mb-3">
          {{ formatDayDate(selectedDay) }}
        </h4>

        <div class="mb-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-surface-600 dark:text-surface-400">Entradas:</span>
            <span class="font-semibold text-green-600">
              {{ formatCurrency(selectedDayData.income) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-surface-600 dark:text-surface-400">Saídas:</span>
            <span class="font-semibold text-red-600">
              {{ formatCurrency(selectedDayData.expense) }}
            </span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-surface-200 dark:border-surface-700">
            <span class="text-surface-600 dark:text-surface-400">Saldo do dia:</span>
            <span class="font-semibold"
              :class="selectedDayData.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatCurrency(selectedDayData.runningBalance) }}
            </span>
          </div>
        </div>

        <!-- Lista de receitas (novo) -->
        <div v-if="selectedDayData.incomes?.length > 0">
          <h5 class="font-medium text-surface-800 dark:text-surface-200 mb-2">Receitas:</h5>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="income in selectedDayData.incomes" :key="'i' + income.id"
              class="flex justify-between items-start p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-surface-900 dark:text-surface-100 truncate">
                  {{ income.description }}
                </div>
                <div class="text-xs text-surface-500 dark:text-surface-400">
                  {{ income.bankName }}
                </div>
              </div>
              <div class="font-semibold text-sm text-green-700 dark:text-green-300 ml-2">
                +{{ formatCurrency(income.amount) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de despesas (alterado) -->
        <div v-if="selectedDayData.expenses?.length > 0">
          <h5 class="font-medium text-surface-800 dark:text-surface-200 mb-2">Despesas:</h5>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="expense in selectedDayData.expenses" :key="'e' + expense.id"
              class="flex justify-between items-start p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-surface-900 dark:text-surface-100 truncate">
                  {{ expense.description }}
                </div>
                <div class="text-xs text-surface-500 dark:text-surface-400">
                  {{ expense.bankName }}
                </div>
              </div>
              <div class="font-semibold text-sm text-red-700 dark:text-red-300 ml-2">
                -{{ formatCurrency(expense.amount) }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!selectedDayData.incomes?.length && !selectedDayData.expenses?.length"
          class="text-center text-surface-500 dark:text-surface-400 py-4">
          Nenhuma transação neste dia
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import FinancialForecastCalendarService from '@/service/FinancialForecastCalendarService';

// Refs
const currentMonth = ref('');
const forecastData = ref(null);
const dayDetailsPanel = ref();
const selectedDay = ref(null);
const selectedDayData = ref(null);
const loading = ref(false);

// Nomes dos dias da semana
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Nomes dos meses
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Computed properties
const daysInMonth = computed(() => {
  if (!currentMonth.value) return 0;
  const [month, year] = currentMonth.value.split('/').map(Number);
  return new Date(year, month, 0).getDate();
});

const startEmptyDays = computed(() => {
  if (!currentMonth.value) return 0;
  const [month, year] = currentMonth.value.split('/').map(Number);
  return new Date(year, month - 1, 1).getDay();
});

const endEmptyDays = computed(() => {
  const totalCells = 42; // 6 semanas × 7 dias
  const usedCells = startEmptyDays.value + daysInMonth.value;
  return totalCells - usedCells;
});

// Methods
const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}/${year}`;
};

const formatMonthYear = (monthYear) => {
  if (!monthYear) return '';
  const [month, year] = monthYear.split('/');
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const formatCurrency = (value) => {
  if (value == null) return 'R$ 0,00';
  const amount = value / 100;
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatCurrencyShort = (value) => {
  if (value == null) return 'R$ 0';
  const amount = value / 100;
  if (amount >= 1000) {
    return `R$ ${(amount / 1000).toFixed(1)}k`;
  }
  return `R$ ${amount.toFixed(0)}`;
};

const formatDayDate = (day) => {
  if (!currentMonth.value || !day) return '';
  const [month, year] = currentMonth.value.split('/');
  return `${day}/${month}/${year}`;
};

const previousMonth = () => {
  const [month, year] = currentMonth.value.split('/').map(Number);
  let newMonth = month - 1;
  let newYear = year;

  if (newMonth === 0) {
    newMonth = 12;
    newYear = year - 1;
  }

  currentMonth.value = `${String(newMonth).padStart(2, '0')}/${newYear}`;
};

const nextMonth = () => {
  const [month, year] = currentMonth.value.split('/').map(Number);
  let newMonth = month + 1;
  let newYear = year;

  if (newMonth === 13) {
    newMonth = 1;
    newYear = year + 1;
  }

  currentMonth.value = `${String(newMonth).padStart(2, '0')}/${newYear}`;
};

const getDayData = (day) => {
  if (!forecastData.value?.days) return null;
  const [month, year] = currentMonth.value.split('/');
  const dateStr = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return forecastData.value.days.find(d => d.date === dateStr);
};

// const getDayClasses = (day) => {
//   const dayData = getDayData(day);
//   if (!dayData) return 'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700';

//   const baseClasses = 'border-surface-200 dark:border-surface-700';

//   if (dayData.runningBalance > dayData.dailyLimit * 0.3) {
//     return `${baseClasses} bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50`;
//   } else if (dayData.runningBalance > 0) {
//     return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50`;
//   } else {
//     return `${baseClasses} bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50`;
//   }
// };

const getDayClasses = (day) => {
  const dayData = getDayData(day);
  if (!dayData) return 'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700';

  const baseClasses = 'border-surface-200 dark:border-surface-700';

  if (dayData.runningBalance > 0) {
    // Saldo positivo - verde
    return `${baseClasses} bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50`;
  } else if (dayData.runningBalance === 0) {
    // Saldo zero - amarelo
    return `${baseClasses} bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50`;
  } else {
    // Saldo negativo - vermelho
    return `${baseClasses} bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50`;
  }
};

const showDayDetails = (event, day) => {
  const dayData = getDayData(day);
  if (dayData) {
    selectedDay.value = day;
    selectedDayData.value = dayData;
    dayDetailsPanel.value.toggle(event);
  }
};

const showTooltip = (event, day) => {
  // Implementar tooltip se necessário
};

const hideTooltip = () => {
  // Implementar hide tooltip se necessário
};

const fetchForecastData = async () => {
  loading.value = true;
  try {
    const [month, year] = currentMonth.value.split('/').map(Number);

    const { status, response } = await FinancialForecastCalendarService.getForecast({
      year: year,
      month: String(month).padStart(2, '0')
    });

    if (status === 200 || status === 'success') {
      forecastData.value = response;
    } else {
      console.error('Erro na resposta da API:', status);
      forecastData.value = null;
    }

  } catch (error) {
    console.error('Erro ao buscar dados de previsão:', error);
    forecastData.value = null;
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(currentMonth, () => {
  fetchForecastData();
});

// Lifecycle
onMounted(() => {
  currentMonth.value = getCurrentMonth();
});
</script>

<style scoped>
.financial-forecast-calendar .aspect-square {
  aspect-ratio: 1;
  min-height: 95px;
}

@media (min-width: 768px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 115px;
  }
}

@media (max-width: 480px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 80px;
  }
}

/* Transições suaves para hover */
.financial-forecast-calendar .aspect-square:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Efeito de profundidade no número do dia */
.financial-forecast-calendar .aspect-square:hover .text-gray-400 {
  opacity: 1;
  transform: scale(1.05);
  transition: all 0.2s ease;
}

/* Melhor visibilidade dos badges */
.financial-forecast-calendar .aspect-square .badge {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Animação suave para os elementos flutuantes */
.financial-forecast-calendar .absolute {
  transition: all 0.2s ease;
}

/* Sombra especial para o saldo */
.financial-forecast-calendar .aspect-square:hover .shadow-md {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>