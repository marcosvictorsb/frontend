<template>
  <DatePicker
    v-model="dateSelection"
    inline
    :view="month"
    :showWeek="true"
    :manualInput="false"
    :variant="filled"
    :class="seu - elemento"
    currentView="date"
    :style="{ border: '0px solid' }"
    :pt="{
      dayView: {
        class: ['hidden'],
      },
      panel: {
        style: {
          border: '0px solid',
        },
      },
      selectMonth: {
        class: ['pointer-events-none', 'opacity-50', 'cursor-not-allowed'],
      },
      selectYear: {
        class: ['pointer-events-none', 'opacity-50', 'cursor-not-allowed'],
      },
    }"
    @month-change="monthChange"
  />
</template>

<script setup>
import { ref } from 'vue'

const dateSelection = ref(null)

const emit = defineEmits(['update:month'])

const monthChange = (event) => {
  emit('update:month', event)
}
</script>
