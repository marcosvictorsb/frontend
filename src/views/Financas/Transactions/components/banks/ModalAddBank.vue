<template>
  <Dialog :visible="visible" modal header="Adicionar Banco" :style="{ width: '30rem' }">
    <div class="flex flex-col gap-2">
      <label for="username">Nome Banco</label>
      <Select v-model="selectedBanks" filter :options="brazilianBanks" optionLabel="name"
        placeholder="Selecione um banco" class="w-full md:w-76" variant="filled"
        :virtualScrollerOptions="{ itemSize: 38 }">
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
          <div class="font-medium p-3">Bancos Disponiveis</div>
        </template>
        <template #footer>
          <div class="p-3">
            <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" />
          </div>
        </template>
      </Select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="username">Valor</label>
      <InputNumber v-model="amount" inputId="locale-pt" locale="pt-Br" :minFractionDigits="2" fluid />
    </div>

    <div class="flex justify-end gap-2 mt-3">
      <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
      <Button type="button" label="Save" @click="saveBank"></Button>
    </div>
  </Dialog>
</template>
<script setup>
import { defineEmits, ref } from 'vue'
import banks from '../../../../../service/bancos.json'

defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close:modal', 'save:bank'])

const selectedBanks = ref(undefined);
const brazilianBanks = ref([]);
const loading = ref(false);
const amount = ref(0);

const closeModal = () => {
  emit('close:modal')
}

const saveBank = () => {
  emit('save:bank', { nameBank: selectedBanks.value.name, amount: amount.value })
}


const getBanks = async () => {
  loading.value = true;
  brazilianBanks.value = banks.map((bank) => {
    const sizeShortName = bank.ShortName.length
    const sizeLongName = bank.LongName.length

    return {
      name: sizeShortName <= sizeLongName ? bank.ShortName : bank.LongName,
      code: bank.COMPE
    }
  })

  loading.value = false;
}

const init = async () => {
  selectedBanks.value = undefined
  await getBanks()
}

init();

</script>