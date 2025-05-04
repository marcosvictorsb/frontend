<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Adicionar Conta"
    :style="{ width: '40rem' }"
    @update:visible="updateVisible"
  >
    <div class="mb-3">
      <label for="multiple-ac-1" class="font-bold mb-2 block"
        >Selecione um banco</label
      >
      <AutoComplete
        v-model="selectedBank"
        optionLabel="fullName"
        dropdown
        fluid
        placeholder="Digite o nome do seu banco"
        :suggestions="filteredBank"
        dropdownIcon
        @complete="search"
        :invalid="isInvalidSelectedBank"
      >
        <template #option="slotProps">
          <div class="flex items-center">
            <span :class="`${slotProps.option.icon} mr-2`"></span>
            <div>{{ slotProps.option.fullName }}</div>
          </div>
        </template>
      </AutoComplete>
      <small class="p-invalid" v-if="submitted && !selectedBank"
        >Selecione um banco</small
      >
    </div>

    <div class="mb-7">
      <label for="multiple-ac-1" class="font-bold mb-2 block"
        >Saldo Inicial</label
      >
      <InputNumber
        :invalid="isInvalidCurrency"
        v-model="currency"
        inputId="currency-brl"
        mode="currency"
        currency="BRL"
        fluid
        :minFractionDigits="2"
        :maxFractionDigits="2"
      />
      <small class="p-invalid" v-if="submitted && currency < 0"
        >Informe um valor igual ou maior que 0</small
      >
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        severity="secondary"
        @click="closeModal"
      />
      <Button type="button" label="Salvar" @click="accountSave" />
    </div>
  </Dialog>
</template>
<script setup>
import AccountService from '@/service/AccountService'
import { BankService } from '@/service/BankService'
import { useUserStore } from '@/store/user'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'

const props = defineProps({
  isVisible: { type: Boolean, default: false },
})
const emit = defineEmits(['close:modal', 'create:account'])

const selectedBank = ref(null)
const filteredBank = ref()
const banks = ref([])
const visible = ref(props.isVisible)
const currency = ref(0.0)
const isInvalidCurrency = ref(false)
const isInvalidSelectedBank = ref(false)
const submitted = ref(false)

const toast = useToast()
const { user } = useUserStore()

watch(
  () => props.isVisible,
  (newValue) => {
    visible.value = newValue
  },
)

const search = (event) => {
  setTimeout(() => {
    const query = event.query.trim().toLowerCase()
    if (!query.length) {
      filteredBank.value = [...banks.value]
    } else {
      filteredBank.value = banks.value.filter((bank) => {
        return bank?.fullName.toLowerCase().includes(query)
      })
    }
  }, 250)
}

const clearForm = () => {
  selectedBank.value = null
  currency.value = 0.0
  isInvalidCurrency.value = false
  isInvalidSelectedBank.value = false
  submitted.value = false
}

const closeModal = () => {
  clearForm()
  emit('close:modal')
}

const updateVisible = () => {
  clearForm()
  emit('close:modal')
}

const isValidForms = () => {
  submitted.value = true
  isInvalidSelectedBank.value = false
  if (selectedBank.value === null) {
    isInvalidSelectedBank.value = true
  }

  // console.log({valorSelecionado: Number(currency.value)});
  isInvalidCurrency.value = false

  if (parseInt(currency.value, 10) < 0) {
    isInvalidCurrency.value = true
    submitted.value = true
  }

  return !isInvalidCurrency.value && !isInvalidSelectedBank.value
}

const accountSave = async () => {
  const isValid = isValidForms()
  const account = {
    fullNameBank: selectedBank.value.fullName,
    balance: currency.value,
    idUser: user.id,
  }
  const response = await AccountService.create(account)
  console.log(response)
  emit('create:account')
}

const init = async () => {
  banks.value = await BankService.getAllBanks()
  filteredBank.value = [...banks.value]
}

init()
</script>
