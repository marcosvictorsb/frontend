<template>
  <div class="card col-span-12 xl:col-span-6">
    <div class="font-semibold text-xl mb-4">Formato das Transações</div>
    <Chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      :plugins="plugins"
      class="w-full md:w-[30rem]"
    />
  </div>
</template>

<script setup>
import GraphService from '@/service/Graph'
import { ref } from 'vue'

const chartData = ref()
const chartOptions = ref(null)
const graphDoughnut = ref()
const plugins = ref({
  datalabels: {
    display: true,
    backgroundColor: '#ccc',
    borderRadius: 3,
    font: {
      color: 'red',
      weight: 'bold',
    },
  },
  doughnutlabel: {
    labels: [
      {
        text: '550',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      {
        text: 'total',
      },
    ],
  },
})

const setChartData = (graphDoughnut) => {
  console.log(graphDoughnut)
  const documentStyle = getComputedStyle(document.body)

  const colors = [
    '--p-cyan-500',
    '--p-orange-500',
    '--p-gray-500',
    '--p-green-500',
    '--p-purple-500',
    '--p-red-500',
    '--p-blue-500',
    '--p-pink-500',
    '--p-yellow-500',
    '--p-teal-500',
    '--p-brown-500',
    '--p-lime-500',
    '--p-indigo-500',
    '--p-amber-500',
    '--p-deep-orange-500',
    '--p-light-blue-500',
    '--p-deep-purple-500',
    '--p-light-green-500',
    '--p-cyan-600',
    '--p-orange-600',
    '--p-gray-600',
    '--p-green-600',
    '--p-purple-600',
    '--p-red-600',
    '--p-blue-600',
    '--p-pink-600',
    '--p-yellow-600',
    '--p-teal-600',
    '--p-brown-600',
    '--p-lime-600',
  ]

  const hoverColors = [
    '--p-cyan-400',
    '--p-orange-400',
    '--p-gray-400',
    '--p-green-400',
    '--p-purple-400',
    '--p-red-400',
    '--p-blue-400',
    '--p-pink-400',
    '--p-yellow-400',
    '--p-teal-400',
    '--p-brown-400',
    '--p-lime-400',
    '--p-indigo-400',
    '--p-amber-400',
    '--p-deep-orange-400',
    '--p-light-blue-400',
    '--p-deep-purple-400',
    '--p-light-green-400',
    '--p-cyan-500',
    '--p-orange-500',
    '--p-gray-500',
    '--p-green-500',
    '--p-purple-500',
    '--p-red-500',
    '--p-blue-500',
    '--p-pink-500',
    '--p-yellow-500',
    '--p-teal-500',
    '--p-brown-500',
    '--p-lime-500',
  ]

  const getRepeatedColors = (colorArray, length) => {
    return Array.from({ length }, (_, index) =>
      documentStyle.getPropertyValue(colorArray[index % colorArray.length]),
    )
  }

  const backgroundColor = getRepeatedColors(colors, graphDoughnut.length)
  const hoverBackgroundColor = getRepeatedColors(
    hoverColors,
    graphDoughnut.length,
  )

  return {
    labels: graphDoughnut.map((item) => item.format),
    datasets: [
      {
        data: graphDoughnut.map((item) => item.totalValue),
        backgroundColor,
        hoverBackgroundColor,
      },
    ],
  }
}

const setChartOptions = () => {
  return {
    plugins: {
      legend: {
        position: 'right',
      },
    },
  }
}

const getFormatGrouped = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const { response } = await GraphService.getTransactionGroupByFormat({
      month: currentMonth,
      year: currentYear,
    })

    graphDoughnut.value = response
    chartData.value = setChartData(graphDoughnut.value)
    chartOptions.value = setChartOptions()
  } catch (e) {
    console.log(e.message)
  }
}

const init = async () => {
  await getFormatGrouped()
}

init()
</script>
