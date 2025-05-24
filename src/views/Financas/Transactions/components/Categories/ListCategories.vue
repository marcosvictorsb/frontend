<template>
  <div class="col">
    <div class="card border border-surface rounded-2xl">
      <div class="flex justify-between items-center">
        <div
          class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4"
        >
          <span>Categorias</span>
        </div>
        <Button
          icon="pi pi-plus"
          raised
          @click="addCategories()"
          size="small"
        />
      </div>

      <ul class="list-none p-0 m-0">
        <li
          class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700 gap-4"
          v-for="category in categories"
          :key="category.id"
        >
          <div class="text-lg">
            <span class="ibb-caixa"></span>
          </div>

          <div class="flex flex-col">
            <span
              class="font-medium text-surface-900 dark:text-surface-0 mb-1"
              >{{ category.name }}</span
            >
          </div>
          <!-- <span
            class="text-surface-900 dark:text-surface-0 ml-auto font-semibold"
            >{{ categoriesbalance }}</span
          > -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
defineProps({
  categories: {
    type: Array,
  },
})

const emit = defineEmits(['open:modal'])

const addCategories = () => {
  emit('open:modal')
}

const init = async () => {}

init()
</script>
