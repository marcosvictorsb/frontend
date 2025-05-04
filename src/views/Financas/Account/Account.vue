<template>
  <div class="col-span-12 md:col-span-4 xl:col-span-3">
    <Toast />
    <Loading v-if="loading" />
    <ModalAccount
      :visible="visible"
      @close:modal="closeModal()"
      @save:account="saveAccount"
    />
    <ListAccounts :accounts="accounts" @open:modal="openModal" />
  </div>
</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue'
import AccountService from '@/service/AccountService'
import { useUserStore } from '@/store/user'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import ListAccounts from './ListAccounts.vue'
import ModalAccount from './ModalAccount.vue'

const visible = ref(false)
const loading = ref(false)

const toast = useToast()
const user = useUserStore()

defineProps({ accounts: { type: Array, required: true } })

const emit = defineEmits(['update:accounts'])

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const saveAccount = async (account) => {
  closeModal()
  loading.value = true
  try {
    const { status } = await AccountService.create(account)
    if (status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Conta Salva!',
        detail: 'A conta foi salva com sucesso.',
        life: 3000,
      })
    }
    loading.value = false
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Falha',
      detail: 'Não foi possível salvar a conta. Por favor, tente novamente',
      life: 3000,
    })
    loading.value = false
  }

  emit('update:accounts')
}
</script>
