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
          <span class="mt-1 text-xl font-medium text-surface-950 dark:text-surface-0">{{ formatCurrency(bank.amount)
          }}</span>&nbsp;
        </div>
      </div>
      <div class="h-px w-full bg-[var(--surface-border)] dark:bg-white/8"></div>
    </div>

    <!-- <DataTable ref="dt" v-model:selection="selectedBank" :value="banks" dataKey="id" :paginator="true" :rows="10"
      :filters="filters">
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">Manage Products</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar banco..." />
          </IconField>
        </div>
      </template>

<Column header="Image">
  <template #body="slotProps">
          <img src="../../../img/banco-icone.jpg" class="rounded" style="width: 20px" />
        </template>
</Column>
<Column field="name" header="Name" sortable style="min-width: 8rem"></Column>

<Column field="amount" header="Price" sortable style="min-width: 5rem">
  <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
</Column>
<Column :exportable="false" style="min-width: 8rem">
  <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
        </template>
</Column>
</DataTable> -->



  </div>
</template>
<script setup>
import { defineProps, ref } from 'vue';
import { formatCurrency } from '@/shared/Utils';
import { FilterMatchMode } from '@primevue/core/api';

defineProps({
  banks: { type: Array, default: [] }
})

const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedBank = ref([])

</script>
