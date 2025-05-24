<template>
  <div class="card flex flex-col justify-between gap-4">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h4 class="text-lg font-medium text-surface-950 dark:text-surface-0">Lista de bancos</h4><!---->
        <div class="h-px w-full bg-[var(--surface-border)] dark:bg-white/8"></div>
        <div class="h-px w-full bg-[var(--surface-border)] dark:bg-white/8"></div>
        <div class="h-px w-full bg-[var(--surface-border)] dark:bg-white/8"></div>
      </div>
    </div>

    <div
      class="flex flex-nowrap flex-shrink-0 justify-between items-center border border-surface-200 dark:border-surface-700 rounded p-4 cursor-pointer select-none hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-150"
      tabindex="0" v-for="(bank, index) in banks" @click="clickBank(bank)">
      <div class="flex items-center">
        <div class="relative md:mr-4 flex-shrink-0">
          <img src="../../../../../img/banco-icone.jpg" alt="user" class="w-12 h-12 rounded-full shadow-lg">
        </div>
        <div class="flex-col hidden md:flex">
          <span class="text-surface-900 dark:text-surface-0 font-semibold block">
            {{ bank.name }}</span>
        </div>
      </div>
      <span class="text-surface-700 dark:text-surface-100 font-semibold ml-auto hidden md:inline">{{
        formatCurrency(bank.amount)
        }}</span>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import { formatCurrency } from '@/shared/Utils';


defineProps({
  banks: { type: Array, default: [] }
})

const emits = defineEmits(['open:modal-bank'])

const selectedBank = ref([])

const clickBank = (bank) => {
  emits('open:modal-bank', bank)
}

</script>
