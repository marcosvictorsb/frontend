<template>
  <Card class="mb-4">
    <template #content>
      <div class="flex items-center justify-between">
        <button @click="previousMonth"
          class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <i class="pi pi-chevron-left text-surface-500 dark:text-surface-400"></i>
        </button>

        <div class="text-center">
          <h3 class="text-lg font-semibold text-surface-950 dark:text-surface-0">
            {{ formatMonthYear(selectedMonth) }}
          </h3>
        </div>

        <button @click="nextMonth"
          class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <i class="pi pi-chevron-right text-surface-500 dark:text-surface-400"></i>
        </button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['month-changed']);

const selectedMonth = ref('');

const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}/${year}`;
};

const formatMonthYear = (monthYear) => {
  if (!monthYear) return '';
  
  const [month, year] = monthYear.split('/');
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const previousMonth = () => {
  const [month, year] = selectedMonth.value.split('/').map(Number);
  
  let newMonth = month - 1;
  let newYear = year;
  
  if (newMonth === 0) {
    newMonth = 12;
    newYear = year - 1;
  }
  
  selectedMonth.value = `${String(newMonth).padStart(2, '0')}/${newYear}`;
};

const nextMonth = () => {
  const [month, year] = selectedMonth.value.split('/').map(Number);
  
  let newMonth = month + 1;
  let newYear = year;
  
  if (newMonth === 13) {
    newMonth = 1;
    newYear = year + 1;
  }
  
  selectedMonth.value = `${String(newMonth).padStart(2, '0')}/${newYear}`;
};

watch(selectedMonth, (newValue) => {
  emit('month-changed', newValue);
});

onMounted(() => {
  selectedMonth.value = getCurrentMonth();
});
</script>
