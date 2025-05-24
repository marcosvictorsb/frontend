<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    closable
    header="Cadastrar categoria"
    :style="{ width: '25rem' }"
    class="p-fluid"
    @update:visible="testar"
  >
    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <InputText
          id="nameCategory"
          v-model="nameCategory"
          :invalid="!nameCategory && submitted"
          class="w-full"
        />
        <label for="nameCategory">Nome categoria</label>
      </FloatLabel>
    </div>

    <!-- Seletor de Cor
    <div class="mb-4 mt-2">
      <FloatLabel variant="on">
        <Select
          v-model="selectedColor"
          :options="colorOptions"
          aria-labelledby="basic"
          optionLabel="name"
          :invalid="submitted && !selectedColor"
          class="w-full"
        />
        <label for="color-picker">Cor da Categoria:</label>
      </FloatLabel>
    </div>
    <div class="category-preview" :class="selectedColor">
      {{ nameCategory || 'Preview' }}
    </div>
    -->

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        severity="secondary"
        @click="closeModal()"
      ></Button>
      <Button type="button" label="Salvar" @click="saveCategory()"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const isVisible = ref(false)
// const categorySelected = ref('')
const submitted = ref(false)
const nameCategory = ref('')

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

// const selectedColor = ref()
// const colorOptions = ref([
//   {
//     name: 'Secondary',
//   },
//   {
//     name: 'Success',
//   },
//   {
//     name: 'Info',
//   },
//   {
//     name: 'Warn',
//   },
//   {
//     name: 'Danger',
//   },
//   {
//     name: 'Contrast',
//   },
// ])

const emit = defineEmits(['close:modal', 'save:transaction'])

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue
  },
)
const clearForms = () => {
  nameCategory.value = ''
}

const closeModal = () => {
  clearForms()
  emit('close:modal')
}

const testar = () => {
  emit('close:modal')
}

const isValidForm = () => {
  console.log(nameCategory.value)
  if (!nameCategory.value) return false
  return true
}

// const createCategory = () => {
//   if (this.categoryName && this.selectedColor) {
//     const newCategory = {
//       name: this.categoryName,
//       color: this.selectedColor,
//     }
//     // Ação para salvar ou emitir o evento com a nova categoria
//     this.$emit('add-category', newCategory)
//     this.closeModal()
//   }
// }

const saveCategory = () => {
  submitted.value = true

  if (isValidForm()) {
    submitted.value = false
    emit('save:category', nameCategory.value)
    clearForms()
  }
}
</script>
