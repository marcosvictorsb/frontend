<template>
  <div class="card mt-20">
    <div class="font-semibold text-xl mb-4">Gastos</div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>
<script setup>
import GraphService from '@/service/Graphic'
import { ref } from 'vue'

const chartData = ref()
const chartOptions = ref()
const graphStackedBar = ref()

const setChartData = (graphStackedBarData) => {
  const documentStyle = getComputedStyle(document.documentElement)
  let dataCredit = []
  let dataDebit = []

  for (let i = 0; i <= graphStackedBarData.length - 1; i++) {
    dataCredit.push(graphStackedBarData[i].total_credit)
    dataDebit.push(graphStackedBarData[i].total_debit)
  }

  const optionsGraph = {
    labels: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    datasets: [
      {
        label: 'Minhas receitas',
        backgroundColor: documentStyle.getPropertyValue('--p-emerald-400'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: dataCredit,
        barThickness: 45,
      },
      {
        label: 'Minhas despesas',
        backgroundColor: documentStyle.getPropertyValue('--p-rose-400'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: dataDebit,
        barThickness: 45,
      },
    ],
  }

  return optionsGraph
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue(
    '--p-text-muted-color',
  )
  const surfaceBorder = documentStyle.getPropertyValue(
    '--p-content-border-color',
  )

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.5,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          offset: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          offset: false,
        },
      },
    },
    borderRadius: 15,
  }
}

const init = async () => {
  try {
    // const { response } = await GraphService.getStackedBar()
    graphStackedBar.value = []
    chartData.value = setChartData(graphStackedBar.value)
    chartOptions.value = setChartOptions()
  } catch (e) {
    console.log(e.message)
  }
}

init()
</script>
