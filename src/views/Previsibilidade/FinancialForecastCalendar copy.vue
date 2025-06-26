<template>
  <div class="financial-forecast-calendar">
    <!-- Header do Calendário -->
    <Card class="mb-4">
      <template #content>
        <div class="flex items-center justify-between">
          <Button 
            @click="previousMonth" 
            icon="pi pi-chevron-left"
            text 
            rounded
            class="hover:bg-surface-100 dark:hover:bg-surface-800"
          />
          
          <div class="text-center">
            <h2 class="text-xl font-semibold text-surface-950 dark:text-surface-0 mb-2">
              {{ formatMonthYear(currentMonth) }}
            </h2>
            <div class="text-sm text-surface-500 dark:text-white/72">
              <span>Receita Total: {{ formatCurrency(forecastData?.incomeTotal || 0) }}</span>
              <span class="mx-2">•</span>
              <span>Limite Diário: {{ formatCurrency(forecastData?.dailyLimit || 0) }}</span>
            </div>
          </div>
          
          <Button 
            @click="nextMonth" 
            icon="pi pi-chevron-right"
            text 
            rounded
            class="hover:bg-surface-100 dark:hover:bg-surface-800"
          />
        </div>
      </template>
    </Card>

    <!-- Legenda das Cores -->
    <Card class="mb-4">
      <template #content>
        <div class="flex flex-wrap gap-4 justify-center items-center">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Dentro do limite</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Perto do limite</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-500 rounded"></div>
            <span class="text-sm text-surface-700 dark:text-surface-300">Ultrapassou limite</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Grid do Calendário -->
    <Card>
      <template #content>
        <!-- Cabeçalho dos dias da semana -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="dayName in dayNames" 
            :key="dayName"
            class="text-center text-sm font-medium text-surface-500 dark:text-white/72 p-2"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Grid dos dias do mês -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Dias vazios do início do mês -->
          <div 
            v-for="emptyDay in startEmptyDays" 
            :key="`empty-start-${emptyDay}`"
            class="aspect-square"
          ></div>

          <!-- Dias do mês -->
          <div 
            v-for="day in daysInMonth" 
            :key="day"
            class="relative aspect-square border rounded-lg cursor-pointer transition-all hover:shadow-md"
            :class="getDayClasses(day)"
            @click="showDayDetails($event, day)"
            @mouseenter="showTooltip($event, day)"
            @mouseleave="hideTooltip"
          >
            <div class="absolute top-1 left-1 text-xs font-medium text-surface-900 dark:text-surface-100">
              {{ day }}
            </div>
            
            <!-- Indicador de gastos -->
            <div 
              v-if="getDayData(day)?.totalSpent > 0"
              class="absolute bottom-1 right-1 text-xs font-bold text-white bg-surface-900/20 rounded px-1"
            >
              {{ formatCurrencyShort(getDayData(day)?.totalSpent || 0) }}
            </div>

            <!-- Indicador de número de transações -->
            <div 
              v-if="getDayData(day)?.expenses?.length > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-surface-700 dark:bg-surface-300 text-white dark:text-surface-900 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {{ getDayData(day).expenses.length }}
            </div>
          </div>

          <!-- Dias vazios do final do mês -->
          <div 
            v-for="emptyDay in endEmptyDays" 
            :key="`empty-end-${emptyDay}`"
            class="aspect-square"
          ></div>
        </div>
      </template>
    </Card>

    <!-- Tooltip/OverlayPanel para detalhes do dia -->
    <OverlayPanel ref="dayDetailsPanel" class="w-80">
      <div v-if="selectedDayData">
        <h4 class="font-semibold text-surface-950 dark:text-surface-0 mb-3">
          {{ formatDayDate(selectedDay) }}
        </h4>
        
        <div class="mb-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-surface-600 dark:text-surface-400">Total Gasto:</span>
            <span class="font-semibold text-surface-950 dark:text-surface-0">
              {{ formatCurrency(selectedDayData.totalSpent) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-surface-600 dark:text-surface-400">Disponível:</span>
            <span class="font-semibold" :class="selectedDayData.available >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatCurrency(selectedDayData.available) }}
            </span>
          </div>
        </div>

        <div v-if="selectedDayData.expenses?.length > 0">
          <h5 class="font-medium text-surface-800 dark:text-surface-200 mb-2">Despesas:</h5>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div 
              v-for="expense in selectedDayData.expenses" 
              :key="expense.id"
              class="flex justify-between items-start p-2 bg-surface-50 dark:bg-surface-800 rounded"
            >
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-surface-900 dark:text-surface-100 truncate">
                  {{ expense.description }}
                </div>
                <div class="text-xs text-surface-500 dark:text-surface-400">
                  {{ expense.bankName }}
                </div>
              </div>
              <div class="font-semibold text-sm text-surface-900 dark:text-surface-100 ml-2">
                {{ formatCurrency(expense.amount) }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center text-surface-500 dark:text-surface-400 py-4">
          Nenhuma despesa neste dia
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

const getDayClasses = (day) => {
  const dayData = getDayData(day);
  if (!dayData) return 'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700';
  
  const baseClasses = 'border-surface-200 dark:border-surface-700';
  
  switch (dayData.color) {
    case 'green':
      return `${baseClasses} bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50`;
    case 'yellow':
      return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50`;
    case 'red':
      return `${baseClasses} bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50`;
    default:
      return `${baseClasses} bg-surface-0 dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800`;
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
  min-height: 80px;
}

@media (max-width: 768px) {
  .financial-forecast-calendar .aspect-square {
    min-height: 60px;
  }
}
</style>