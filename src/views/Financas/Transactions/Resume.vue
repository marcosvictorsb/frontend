<template>
  <Card>
    <template #content>
      <div class="flex flex-wrap gap-6">

        <div class="flex-1 flex gap-3 min-w-44">
          <div class="w-1.5 rounded-full bg-blue-500"></div>
          <div>
            <h5 class="text-surface-500 dark:text-white/72">Receita</h5>
            <p class="mt-1 text-xl font-medium text-surface-950 dark:text-surface-0">{{ formatCurrency(totalIncomes) }}
            </p>
          </div>
        </div>

        <div class="flex-1 flex gap-3 min-w-44">
          <div class="w-1.5 rounded-full bg-rose-500"></div>
          <div>
            <h5 class="text-surface-500 dark:text-white/72">Despesa pagas</h5>
            <p class="mt-1 text-xl font-medium text-surface-950 dark:text-surface-0">{{ formatCurrency(totalExpensePay)
              }}
            </p>
          </div>
        </div>

        <div class="flex-1 flex gap-3 min-w-44">
          <div class="w-1.5 rounded-full bg-rose-500"></div>
          <div>
            <h5 class="text-surface-500 dark:text-white/72">Despesa a pagar</h5>
            <p class="mt-1 text-xl font-medium text-surface-950 dark:text-surface-0">{{
              formatCurrency(totalExpenseToPay) }}
            </p>
          </div>
        </div>

        <div class="flex-1 flex gap-3 min-w-44">
          <div class="w-1.5 rounded-full bg-orange-500"></div>
          <div>
            <h5 class="text-surface-500 dark:text-white/72">Guardado</h5>
            <p class="mt-1 text-xl font-medium text-surface-950 dark:text-surface-0">{{ formatCurrency(0) }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  totalExpenseToPay: { type: Number, default: 0 },
  totalExpensePay: { type: Number, default: 0 },
  totalIncomes: { type: Number, default: 0 }
})

const formatCurrency = (value) => {
  if (value !== null && value !== undefined) {
    const amount = value / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return 'R$ 0,00';
};

</script>