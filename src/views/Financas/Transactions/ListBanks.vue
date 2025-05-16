<template>
  <div class="card flex flex-col justify-between gap-4">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h4 class="text-lg font-medium text-surface-950 dark:text-surface-0">Lista de bancos</h4><!---->
      </div>
      <!-- <button class="p-button p-component p-button-contrast p-button-rounded p-button-text !py-0.5 !px-1.5 !text-sm"
        type="button" aria-label="View All" data-pc-name="button" data-p-disabled="false" data-p-severity="contrast"
        pc230="" data-pc-section="root"><span class="p-button-label" data-pc-section="label">View
          All</span></button> -->
    </div>
    <div class="flex-1 flex flex-col justify-between" v-for="(bank, index) in banks">
      <div class="flex items-center gap-4 py-4">
        <div
          class="w-12 h-12 bg-surface-0 dark:bg-white/4 border border-surface-200 dark:border-white/8 rounded-2xl flex items-center justify-center">
          <img src="../../../img/banco-icone.jpg" class="rounded-2xl" alt="Logo">
        </div>
        <div class="flex-1">
          <h5 class="font-medium text-surface-950 dark:text-surface-0">{{ bank.name }}</h5>
        </div>
        <div
          class="flex-1 inline-flex items-center justify-end text-right text-lg font-medium text-surface-500 dark:text-white/72">
          <span class="text-red-500">{{ formatCurrency(bank.amount) }}</span>&nbsp;
        </div>
      </div>
      <div class="h-px w-full bg-[var(--surface-border)] dark:bg-white/8"></div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import { formatCurrency } from '@/shared/Utils'

defineProps({
  banks: { type: Array, default: [] }
})


</script>
