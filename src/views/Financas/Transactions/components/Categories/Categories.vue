<template>
  <div class="col-span-12 md:col-span-4 xl:col-span-3">
    <Toast />
    <Loading v-if="loading" />
    <ModalCategories
      :visible="visible"
      @close:modal="closeModal()"
      @save:categories="saveCategories"
    />
    <ListCategories :categories="categories" @open:modal="openModal" />
  </div>
</template>
<script setup>
import Loading from '@/components/Loading/Loading.vue'
import CategoryService from '@/service/CategoryService'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import ListCategories from './ListCategories.vue'
import ModalCategories from './ModalCategories.vue'

const visible = ref(false)
const loading = ref(false)

const toast = useToast()

defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:categories'])

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const saveCategories = async (categories) => {
  closeModal()
  loading.value = true
  try {
    const { status } = await CategoryService.create(categories)
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

  emit('update:categories')
}
</script>
