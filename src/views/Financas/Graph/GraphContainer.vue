<template>
  <ConfirmDialog
    :pt="{
      content: {
        style: {
          fontSize: '18px',
        },
      },
    }"
  />

  <HeatMapFinance
    :transactions="transactions"
    :round="1"
    :end-date="endDate"
    class="mt-20"
  />

  <!-- <div class="col-span-4">
    <StackedBar />
    <div class="grid grid-cols-12 gap-8">
      <CategoryDoughnut />
      <FormatDoughnut />
    </div>
  </div> -->
</template>
<script setup>
import { ref } from 'vue'

const data = ref([])
const endDate = ref('2025-12-31')
data.value = [
  { date: '2025-02-01', count: 2 },
  { date: '2025-02-05', count: 5 },
  { date: '2025-02-10', count: 8 },
  { date: '2025-02-15', count: 1 },
  { date: '2025-02-20', count: 4 },
  { date: '2025-02-20', count: 4 },
  { date: '2025-04-20', count: 4 },
  { date: '2025-05-20', count: 4 },
]

const generateTransactions = () => {
  const transactions = []
  let liquido = 5000 // Valor inicial
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2025-02-28')

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateKey = date.toISOString().split('T')[0]
    const despesas = []
    const receitas = []

    // Adiciona despesas ou receitas aleatórias
    if (Math.random() > 0.5) {
      const valor = Math.floor(Math.random() * 1000)
      if (Math.random() > 0.5) {
        despesas.push(`Despesa - R$ ${valor}`)
        liquido -= valor
      } else {
        receitas.push(`Receita - R$ ${valor}`)
        liquido += valor
      }
    }

    transactions.push({
      date: dateKey,
      despesas,
      receitas,
      liquido,
    })
  }

  return transactions
}

const transactions = ref(generateTransactions())
</script>
