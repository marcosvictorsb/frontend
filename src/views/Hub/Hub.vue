<template>
  <CardWelcome :name="NameUser" class="mt-20" />
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <HubCard />
    <HubCard />
    <HubCard />
    <HubCard />
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout'
import { ProductService } from '@/service/ProductService'
import { onMounted, ref, watch } from 'vue'
import CardWelcome from './components/CardWelcome.vue'
import HubCard from './components/HubCard.vue'

const { getPrimary, getSurface, isDarkTheme } = useLayout()

const products = ref(null)
const chartData = ref(null)
const chartOptions = ref(null)
const NameUser = ref('')

const items = ref([
  { label: 'Add New', icon: 'pi pi-fw pi-plus' },
  { label: 'Remove', icon: 'pi pi-fw pi-trash' },
])

onMounted(() => {
  ProductService.getProductsSmall().then((data) => (products.value = data))
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        type: 'bar',
        label: 'Subscriptions',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
        data: [4000, 10000, 15000, 4000],
        barThickness: 32,
      },
      {
        type: 'bar',
        label: 'Advertising',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
        data: [2100, 8400, 2400, 7500],
        barThickness: 32,
      },
      {
        type: 'bar',
        label: 'Affiliate',
        backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
        data: [4100, 5200, 3400, 7400],
        borderRadius: {
          topLeft: 8,
          topRight: 8,
        },
        borderSkipped: true,
        barThickness: 32,
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const borderColor = documentStyle.getPropertyValue('--surface-border')
  const textMutedColor = documentStyle.getPropertyValue(
    '--text-color-secondary',
  )

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textMutedColor,
        },
        grid: {
          color: 'transparent',
          borderColor: 'transparent',
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textMutedColor,
        },
        grid: {
          color: borderColor,
          borderColor: 'transparent',
          drawTicks: false,
        },
      },
    },
  }
}

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

watch([getPrimary, getSurface, isDarkTheme], () => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const init = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) NameUser.value = user.name
  // console.log(credential);
  // if (!credential) {
  //   return;
  // }

  // const decodedToken = jsonwebtoken.decode(credential);
  // console.log(decodedToken);
  // if (!decodedToken || decodedToken.exp < Date.now() / 1000) {
  //   return;
  // }
}

init()
</script>
<style scope>
.welcome-message {
  font-size: 24px; /* Aumenta o tamanho da fonte */
  font-weight: bold; /* Deixa o texto em negrito */
  text-align: left; /* Alinhamento à esquerda */
  padding: 10px 0; /* Espaçamento interno */
}
</style>
