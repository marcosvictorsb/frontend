<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    closable
    header="Cadastrar conta bancaria"
    :style="{ width: '25rem' }"
    class="p-fluid"
    @update:visible="testar"
  >
    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <Select
          v-model="accountSelected"
          :options="listOfBanks"
          filter
          optionLabel="label"
          class="w-full"
          inputId="account"
          :invalid="submitted && !accountSelected"
        />
        <label for="account">Selecione o banco</label>
      </FloatLabel>
    </div>

    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <InputNumber
          v-model="balanceSelected"
          inputId="balanceSelected"
          mode="currency"
          currency="BRL"
          locale="pt-BR"
          :minFractionDigits="2"
          :maxFractionDigits="5"
          fluid
          :invalid="balanceSelected < 0"
        />
        <label for="balanceSelected">Valor bancário</label>
      </FloatLabel>
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        severity="secondary"
        @click="closeModal()"
      ></Button>
      <Button type="button" label="Salvar" @click="saveAccount()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { listOfBanks } from '@/shared/list_banks'
import { ref, watch } from 'vue'

const isVisible = ref(false)
const account = ref({ bank_balance: 0, name_bank: '', icon: '', id_user: null })

const accountSelected = ref(null)
const balanceSelected = ref(0)
const submitted = ref(false)

const props = defineProps({ visible: { type: Boolean, required: true } })

const emit = defineEmits(['close:modal', 'save:transaction'])

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue
  },
)
const clearForms = () => {
  accountSelected.value = ''
  balanceSelected.value = 0
  account.value = { bank_balance: 0, name_bank: '', icon: '' }
}

const closeModal = () => {
  clearForms()
  emit('close:modal')
}

const testar = () => {
  emit('close:modal')
}

const isValidForm = () => {
  if (!accountSelected.value) return false
  return true
}

const saveAccount = () => {
  submitted.value = true

  if (isValidForm()) {
    submitted.value = false
    account.value.name_bank = accountSelected.value.label
    account.value.bank_balance = balanceSelected.value
    emit('save:account', account.value)
    clearForms()
  }
}
</script>
