<template>
  <div class="financial-forecast-calendar">
    <!-- Header do Calendário (alterado) -->
    <Card class="mb-4">
      <template #content>
        <div class="flex items-center justify-between">
          <Button @click="previousMonth" icon="pi pi-chevron-left" text rounded
            class="hover:bg-surface-100 dark:hover:bg-surface-800 flex-shrink-0" />

          <div class="text-center flex-1 mx-2">
            <h2 class="text-lg sm:text-xl font-semibold text-surface-950 dark:text-surface-0 mb-1 sm:mb-2">
              {{ formatMonthYear(currentMonth) }}
            </h2>
            <div class="text-xs sm:text-sm text-surface-500 dark:text-white/72 space-y-1 sm:space-y-0">
              <div class="block sm:inline">
                <span>Receita: {{ formatCurrency(forecastData?.totalIncome || 0) }}</span>
              </div>
              <span class="hidden sm:inline mx-2">•</span>
              <div class="block sm:inline">
                <span>Despesa: {{ formatCurrency(forecastData?.totalExpense || 0) }}</span>
              </div>
              <span class="hidden sm:inline mx-2">•</span>
              <div class="block sm:inline">
                <span>Saldo Final:
                  <span :class="forecastData?.performance >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(forecastData?.performance || 0) }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button @click="openDailyLimitModal" icon="pi pi-cog" text rounded
              class="hover:bg-surface-100 dark:hover:bg-surface-800"
              :title="dailyLimit > 0 ? `Limite diário: ${formatCurrency(dailyLimit)}` : 'Definir limite diário'" />
            <Button @click="nextMonth" icon="pi pi-chevron-right" text rounded
              class="hover:bg-surface-100 dark:hover:bg-surface-800" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Card de Limite Diário (novo) -->
    <Card class="mb-4" v-if="dailyLimit > 0">
      <template #content>
        <div class="flex items-center justify-between p-2">
          <div class="flex items-center gap-3">
            <i class="pi pi-clock text-blue-500"></i>
            <div>
              <span class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Limite Diário Ativo: {{ formatCurrency(dailyLimit) }}
              </span>
              <div class="text-xs text-surface-500 dark:text-surface-400">
                Aplicado apenas para dias futuros
              </div>
            </div>
          </div>
          <Button @click="openDailyLimitModal" icon="pi pi-pencil" text size="small"
            class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" />
        </div>
      </template>
    </Card>

    <!-- Legenda das Cores (alterada) -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-wrap gap-2 sm:gap-4 justify-center items-center text-center">
          <div class="flex items-center gap-1 sm:gap-2">
            <div class="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
            <span class="text-xs sm:text-sm text-surface-700 dark:text-surface-300">Saldo positivo</span>
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <div class="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded"></div>
            <span class="text-xs sm:text-sm text-surface-700 dark:text-surface-300">Saldo próximo de zero</span>
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <div class="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
            <span class="text-xs sm:text-sm text-surface-700 dark:text-surface-300">Saldo negativo</span>
          </div>
          <div v-if="dailyLimit > 0" class="flex items-center gap-1 sm:gap-2">
            <div class="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded"></div>
            <span class="text-xs sm:text-sm text-surface-700 dark:text-surface-300">Limite diário excedido</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Grid do Calendário (alterado) -->
    <Card>
      <template #content>
        <!-- Cabeçalho dos dias da semana (mantido) -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-3">
          <div v-for="dayName in dayNames" :key="dayName"
            class="text-center text-xs sm:text-sm font-medium text-surface-500 dark:text-white/72 p-1 sm:p-2">
            {{ dayName }}
          </div>
        </div>

        <!-- Grid dos dias do mês (melhorado) -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
          <!-- Dias vazios do início do mês (mantido) -->
          <div v-for="emptyDay in startEmptyDays" :key="`empty-start-${emptyDay}`" class="aspect-square"></div>

          <!-- Dias do mês (melhorado) -->
          <div v-for="day in daysInMonth" :key="day"
            class="relative aspect-square border rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105 p-0.5 sm:p-1"
            :class="getDayClasses(day)" @click="showDayDetails($event, day)">

            <!-- Container principal do dia (simplificado para mobile) -->
            <div class="h-full flex flex-col justify-between relative">

              <!-- Badges de transações no topo (apenas em desktop) -->
              <div class="absolute top-0.5 right-0.5 z-10 hidden sm:flex">
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

              <!-- Badges simplificados para mobile -->
              <div class="absolute top-0 right-0 z-10 flex sm:hidden">
                <!-- Indicador simples de transações no mobile -->
                <div v-if="getDayData(day)?.expenses?.length || getDayData(day)?.incomes?.length"
                  class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              </div>

              <!-- Número do dia centralizado -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-2xl md:text-3xl font-black text-gray-400 dark:text-gray-500 opacity-80 select-none">
                  {{ day }}
                </div>
              </div>

              <!-- Indicadores de fluxo no centro superior (apenas desktop) -->
              <div v-if="getDayData(day)?.income || getDayData(day)?.expense"
                class="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 hidden sm:flex">
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
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                <div
                  class="text-xs md:text-sm font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded shadow-md border border-white/50"
                  :class="getDayData(day).runningBalance >= 0
                    ? 'bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-200'
                    : 'bg-red-200 text-red-800 dark:bg-red-800/50 dark:text-red-200'">
                  {{ formatCurrencyShort(getDayData(day).runningBalance) }}
                </div>
              </div>

              <!-- Indicador de status no canto (mini dot) -->
              <div v-if="getDayData(day)"
                class="absolute top-0.5 left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-sm" :class="getDayData(day).limitExceeded && isFutureDay(day)
                  ? 'bg-orange-500'
                  : getDayData(day).runningBalance > 0
                    ? 'bg-green-400'
                    : getDayData(day).runningBalance === 0
                      ? 'bg-yellow-400'
                      : 'bg-red-400'">
              </div>

              <!-- Alerta de limite excedido (apenas desktop) -->
              <div v-if="getDayData(day)?.limitExceeded && isFutureDay(day)"
                class="absolute top-1 left-1/2 transform -translate-x-1/2 z-20 hidden sm:flex">
                <div class="bg-orange-500 text-white text-xs px-1 py-0.5 rounded shadow-md flex items-center gap-1"
                  :title="`Limite excedido em ${formatCurrency(getDayData(day).excessAmount)}`">
                  <i class="pi pi-exclamation-triangle text-xs"></i>
                  <span class="text-xs font-bold">!</span>
                </div>
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

          <!-- Informação do limite diário se aplicável -->
          <div v-if="dailyLimit > 0 && isFutureDay(selectedDay)" class="flex justify-between items-center">
            <span class="text-surface-600 dark:text-surface-400">Limite diário:</span>
            <span class="font-semibold text-blue-600">
              {{ formatCurrency(dailyLimit) }}
            </span>
          </div>

          <!-- Alerta de excesso se aplicável -->
          <div v-if="selectedDayData.limitExceeded && isFutureDay(selectedDay)"
            class="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
            <span class="text-orange-700 dark:text-orange-300 text-sm">Excesso sobre o limite:</span>
            <span class="font-semibold text-orange-700 dark:text-orange-300">
              {{ formatCurrency(selectedDayData.excessAmount) }}
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

    <!-- Modal de Limite Diário (novo) -->
    <Dialog v-model:visible="dailyLimitModalVisible" :style="{ width: '450px' }" header="Limite Diário de Gastos"
      :modal="true">
      <div class="flex flex-col gap-4">
        <div class="text-sm text-surface-600 dark:text-surface-400">
          Define o limite máximo de gastos por dia. Será aplicado apenas para dias futuros.
        </div>

        <div>
          <label for="dailyLimitInput" class="block font-bold mb-2">Limite Diário (R$)</label>
          <InputNumber id="dailyLimitInput" v-model="tempDailyLimit" mode="currency" currency="BRL" locale="pt-BR"
            :min="0" :max="100000" fluid placeholder="Ex: R$ 50,00" />
          <small class="text-surface-500 dark:text-surface-400">
            Deixe em branco ou zero para desativar o limite
          </small>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-400">
          <div class="flex items-start gap-2">
            <i class="pi pi-info-circle text-blue-500 mt-0.5"></i>
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Como funciona:</strong>
              <ul class="mt-1 space-y-1 text-xs">
                <li>• O limite será aplicado apenas para dias a partir de hoje</li>
                <li>• Dias passados não são afetados</li>
                <li>• Se as despesas do dia ultrapassarem o limite, será exibido um alerta</li>
                <li>• O saldo será calculado considerando o limite definido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="closeDailyLimitModal" />
        <Button label="Salvar" icon="pi pi-check" @click="saveDailyLimit" />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import FinancialForecastCalendarService from '@/service/FinancialForecastCalendarService';

// Refs
const currentMonth = ref('');
const forecastData = ref(null);
const dayDetailsPanel = ref();
const selectedDay = ref(null);
const selectedDayData = ref(null);
const loading = ref(false);

// Limite diário
const dailyLimit = ref(0);
const dailyLimitModalVisible = ref(false);
const tempDailyLimit = ref(0);

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

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isFutureDay = (day) => {
  if (!currentMonth.value) return false;

  const [month, year] = currentMonth.value.split('/');
  const dayDate = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const currentDate = getCurrentDate();

  const isFuture = dayDate >= currentDate;

  console.log(`isFutureDay(${day}): dayDate=${dayDate}, currentDate=${currentDate}, isFuture=${isFuture}`);

  return isFuture;
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

  // Verificar se o limite foi excedido para dias futuros
  if (isFutureDay(day) && dayData.limitExceeded) {
    return `${baseClasses} bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 border-orange-300 dark:border-orange-600`;
  }

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

// Métodos do limite diário
const loadDailyLimit = () => {
  const savedLimit = localStorage.getItem('financial-forecast-daily-limit');
  if (savedLimit) {
    dailyLimit.value = parseInt(savedLimit);
    console.log('Limite diário carregado:', dailyLimit.value, 'centavos');
  } else {
    console.log('Nenhum limite diário salvo encontrado');
  }
};

const openDailyLimitModal = () => {
  tempDailyLimit.value = dailyLimit.value / 100; // Converte centavos para reais
  dailyLimitModalVisible.value = true;
};

const closeDailyLimitModal = () => {
  dailyLimitModalVisible.value = false;
  tempDailyLimit.value = 0;
};

const saveDailyLimit = () => {
  const limitInCents = Math.round((tempDailyLimit.value || 0) * 100);
  console.log('Salvando limite:', {
    tempValue: tempDailyLimit.value,
    limitInCents,
    formatted: formatCurrency(limitInCents)
  });

  dailyLimit.value = limitInCents;
  localStorage.setItem('financial-forecast-daily-limit', limitInCents.toString());
  closeDailyLimitModal();

  // Recalcular os dados com o novo limite
  console.log('Aplicando novo limite aos dados...');
  applyDailyLimitToForecast();
};

const applyDailyLimitToForecast = () => {
  if (!forecastData.value?.days || dailyLimit.value <= 0) {
    console.log('Não aplicando limite:', {
      hasDays: !!forecastData.value?.days,
      dailyLimit: dailyLimit.value
    });
    return;
  }

  console.log('Aplicando limite diário:', dailyLimit.value, 'centavos');

  forecastData.value.days.forEach(dayData => {
    const dayNumber = new Date(dayData.date).getDate();
    const isFuture = isFutureDay(dayNumber);

    // Aplicar limite apenas para dias futuros
    if (isFuture) {
      const totalExpense = dayData.expense || 0;
      const income = dayData.income || 0;

      console.log(`Dia ${dayNumber} (${dayData.date}):`, {
        income,
        totalExpense,
        dailyLimit: dailyLimit.value,
        isFuture
      });

      // Verificar se as despesas ultrapassam o limite
      if (totalExpense > dailyLimit.value) {
        dayData.limitExceeded = true;
        dayData.excessAmount = totalExpense - dailyLimit.value;
        // Para dias que excedem o limite, usar o limite como gasto máximo
        dayData.runningBalance = income - dailyLimit.value;
        console.log(`  -> Limite excedido! Novo saldo: ${dayData.runningBalance}`);
      } else {
        dayData.limitExceeded = false;
        dayData.excessAmount = 0;
        // Para dias dentro do limite, usar o gasto real
        dayData.runningBalance = income - totalExpense;
        console.log(`  -> Dentro do limite. Saldo: ${dayData.runningBalance}`);
      }
    } else {
      // Para dias passados, manter o cálculo original
      dayData.limitExceeded = false;
      dayData.excessAmount = 0;
      const totalExpense = dayData.expense || 0;
      const income = dayData.income || 0;
      dayData.runningBalance = income - totalExpense;
    }
  });

  // Recalcular saldo acumulado
  recalculateRunningBalance();
};

const recalculateRunningBalance = () => {
  if (!forecastData.value?.days) return;

  console.log('Recalculando saldo acumulado...');

  // Ordenar dias por data
  const sortedDays = [...forecastData.value.days].sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalance = 0;

  sortedDays.forEach((dayData, index) => {
    const dayNumber = new Date(dayData.date).getDate();
    const income = dayData.income || 0;
    const expense = dayData.expense || 0;
    const isFuture = isFutureDay(dayNumber);

    let dailyChange = 0;

    if (isFuture && dailyLimit.value > 0) {
      // Para dias futuros com limite
      if (expense > dailyLimit.value) {
        // Se excede o limite, usar apenas o limite
        dailyChange = income - dailyLimit.value;
      } else {
        // Se não excede, usar o gasto real
        dailyChange = income - expense;
      }
    } else {
      // Para dias passados ou sem limite, usar valores reais
      dailyChange = income - expense;
    }

    runningBalance += dailyChange;
    dayData.runningBalance = runningBalance;

    console.log(`${dayData.date}: income=${income}, expense=${expense}, dailyChange=${dailyChange}, runningBalance=${runningBalance}, isFuture=${isFuture}`);
  });

  // Atualizar o saldo final
  if (forecastData.value) {
    forecastData.value.performance = runningBalance;
    console.log('Saldo final atualizado:', runningBalance);
  }
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

      // Aguardar próximo tick antes de aplicar o limite
      await nextTick();

      // Aplicar limite diário após carregar os dados
      if (dailyLimit.value > 0) {
        applyDailyLimitToForecast();
      }
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

watch(dailyLimit, () => {
  if (forecastData.value?.days) {
    applyDailyLimitToForecast();
  }
});

// Lifecycle
onMounted(async () => {
  console.log('Componente montado');
  currentMonth.value = getCurrentMonth();
  loadDailyLimit();

  // Aguardar um pouco para garantir que os dados sejam carregados
  await nextTick();
  console.log('Limite após montagem:', dailyLimit.value);
});
</script>

<style scoped>
.financial-forecast-calendar .aspect-square {
  aspect-ratio: 1;
  min-height: 120px;
}

@media (min-width: 768px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 130px;
  }
}

/* Mobile otimizado para 346px de largura total */
@media (max-width: 640px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 45px;
    /* Reduzido drasticamente para caber na tela */
    max-height: 45px;
  }

  /* Badges super pequenos no mobile */
  .financial-forecast-calendar .aspect-square .w-4 {
    width: 0.5rem;
    height: 0.5rem;
    font-size: 0.5rem;
  }

  .financial-forecast-calendar .aspect-square .md\\:w-5 {
    width: 0.625rem;
    height: 0.625rem;
    font-size: 0.5rem;
  }

  /* Número do dia muito menor */
  .financial-forecast-calendar .aspect-square .text-2xl {
    font-size: 0.75rem;
    font-weight: bold;
  }

  .financial-forecast-calendar .aspect-square .md\\:text-3xl {
    font-size: 0.875rem;
    font-weight: bold;
  }

  /* Esconder setas de fluxo no mobile para economizar espaço */
  .financial-forecast-calendar .aspect-square .top-6 {
    display: none;
  }

  /* Saldo muito pequeno */
  .financial-forecast-calendar .aspect-square .bottom-1 {
    bottom: 0px;
  }

  .financial-forecast-calendar .aspect-square .text-xs {
    font-size: 0.5rem;
    line-height: 0.625rem;
  }

  .financial-forecast-calendar .aspect-square .md\\:text-sm {
    font-size: 0.5rem;
    line-height: 0.625rem;
  }

  /* Padding mínimo */
  .financial-forecast-calendar .aspect-square .px-2 {
    padding-left: 0.125rem;
    padding-right: 0.125rem;
  }

  .financial-forecast-calendar .aspect-square .py-1 {
    padding-top: 0rem;
    padding-bottom: 0rem;
  }

  /* Mini dot menor */
  .financial-forecast-calendar .aspect-square .w-2 {
    width: 0.375rem;
    height: 0.375rem;
  }
}

@media (max-width: 480px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 42px;
    /* Ainda menor para mobile muito pequeno */
    max-height: 42px;
  }

  /* Badges ainda menores */
  .financial-forecast-calendar .aspect-square .w-4 {
    width: 0.375rem;
    height: 0.375rem;
    font-size: 0.375rem;
  }

  .financial-forecast-calendar .aspect-square .md\\:w-5 {
    width: 0.5rem;
    height: 0.5rem;
    font-size: 0.375rem;
  }

  /* Número do dia ainda menor */
  .financial-forecast-calendar .aspect-square .text-2xl {
    font-size: 0.625rem;
  }

  .financial-forecast-calendar .aspect-square .md\\:text-3xl {
    font-size: 0.75rem;
  }

  /* Saldo no rodapé ainda menor */
  .financial-forecast-calendar .aspect-square .text-xs {
    font-size: 0.375rem;
    line-height: 0.5rem;
  }

  .financial-forecast-calendar .aspect-square .md\\:text-sm {
    font-size: 0.375rem;
    line-height: 0.5rem;
  }
}

/* Transições suaves para hover (apenas desktop) */
@media (min-width: 768px) {
  .financial-forecast-calendar .aspect-square:hover {
    transform: translateY(-2px) scale(1.02);
  }

  /* Efeito de profundidade no número do dia */
  .financial-forecast-calendar .aspect-square:hover .text-gray-400 {
    opacity: 1;
    transform: scale(1.05);
    transition: all 0.2s ease;
  }

  /* Sombra especial para o saldo */
  .financial-forecast-calendar .aspect-square:hover .shadow-md {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

/* Melhor visibilidade dos badges */
.financial-forecast-calendar .aspect-square .badge {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Animação suave para os elementos flutuantes */
.financial-forecast-calendar .absolute {
  transition: all 0.2s ease;
}

/* Grid com espaçamento mínimo no mobile */
@media (max-width: 640px) {
  .financial-forecast-calendar .grid-cols-7 {
    gap: 0.125rem;
    /* Gap mínimo */
  }
}

@media (max-width: 480px) {
  .financial-forecast-calendar .grid-cols-7 {
    gap: 0.0625rem;
    /* Gap ainda menor */
  }
}

/* Otimizações específicas para largura de 346px */
@media (max-width: 350px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 40px;
    max-height: 40px;
    border-radius: 0.25rem;
  }
}
</style>