<template>
  <div class="grid grid-cols-12 gap-4">
    <Banner :balanceYear="balanceYear" :percentual="percentual" />
    <ChartIncomeExpense />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Banner from './components/Banner.vue';
import ChartIncomeExpense from './components/ChartIncomeExpense.vue';
import GraphicService from '@/service/Graphic';

const balanceYear = ref(0);
const percentual = ref('0%');

const getBalanceYear = async () => {
  const { response } = await GraphicService.getBalanceYear();
  balanceYear.value = response.totalBalance;
  percentual.value = response.percetual;
}



const init = async () => {
  await getBalanceYear();
}

init();

</script>
