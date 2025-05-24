<template>
  <Select v-model="selectedBanks" filter :options="brazilianBanks" optionLabel="name" placeholder="Selecione um banco"
    class="w-full md:w-76" variant="filled" :virtualScrollerOptions="{ itemSize: 38 }">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <!-- <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`mr-2 flag flag-${slotProps.value.code}`" style="width: 18px" /> -->
        <i class="pi pi-building-columns" style="font-size: 2rem"></i>
        <div>{{ slotProps.value.name }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <!-- <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`mr-2 flag flag-${slotProps.option.code}`" style="width: 18px" /> -->
        <i class="pi pi-building-columns" style="font-size: 2rem"></i>
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
    <template #dropdownicon>
      <i class="pi pi-map" />
    </template>
    <template #header>
      <div class="font-medium p-3">Bancos Disponiveissss</div>
    </template>
    <template #footer>
      <div class="p-3">
        <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" />
      </div>
    </template>
  </Select>
</template>
<script setup>
import { ref } from 'vue'
import banks from '../../../service/bancos.json'

const emits = defineEmits(['bank:select'])


const selectedBanks = ref(undefined);
const brazilianBanks = ref([])
const loading = ref(false)





</script>
