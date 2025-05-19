<template>
  <div class="card  col-span-12 flex flex-col p-6 border border-surface rounded-2xl overflow-hidden">
    <div class="flex items-start justify-between gap-2 mb-4">
      <div>
        <h3 class="label-medium">Gastos Anual</h3>
      </div>

    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
  </div>
</template>
<script setup>
import GraphicService from '@/service/Graphic';
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
          offset: true,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          offset: true,
        },
      },
    },
    borderRadius: 15,
  }
}

const getMonthlySummary = async () => {
  const { response } = await GraphicService.getMonthlySummary()
  return response;
}

const init = async () => {
  try {
    graphStackedBar.value = await getMonthlySummary();
    chartData.value = setChartData(graphStackedBar.value)
    chartOptions.value = setChartOptions()
  } catch (e) {
    console.log(e.message)
  }
}

init()
</script>
