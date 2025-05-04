<template>
  <div class="calendar-heat-map p-4 card">
    <!-- Controles de navegação -->
    <div class="controls flex justify-center items-center mb-4 mt-3">
      <Button label="Anterior" icon="pi pi-angle-left" @click="previousYear" />
      <span class="mx-4 text-lg font-semibold">{{ currentYear }}</span>
      <Button
        label="Próximo"
        icon="pi pi-angle-right"
        iconPos="right"
        @click="nextYear"
      />
    </div>

    <!-- Calendário -->
    <div class="calendar flex flex-wrap gap-4">
      <div
        v-for="month in months"
        :key="month"
        class="month flex-1 min-w-[200px]"
      >
        <h3 class="text-center font-bold mb-2">
          {{ capitalizeFirstLetter(getMonthName(month)) }}
        </h3>
        <div class="days grid grid-cols-7 gap-1">
          <div
            v-for="day in getDaysInMonth(currentYear, month)"
            :key="day"
            class="day w-6 h-6 rounded-sm relative"
            :class="{
              'cursor-pointer': hasTransaction(day, month),
              'hover:scale-110 transition-transform': hasTransaction(
                day,
                month,
              ),
            }"
            :style="getDayStyle(day, month)"
            @mouseover="showTooltip(day, month)"
            @mouseleave="hideTooltip"
          >
            <div
              v-if="tooltip.visible && tooltip.date === getDateKey(day, month)"
              class="tooltip absolute top-8 left-8 bg-white border border-gray-200 p-2 rounded-lg shadow-lg z-10"
            >
              <p class="text-sm"><strong>Data:</strong> {{ tooltip.date }}</p>
              <p v-if="tooltip.receitas.length > 0" class="text-sm">
                <strong>Receitas:</strong> {{ tooltip.receitas.join(', ') }}
              </p>
              <p v-if="tooltip.despesas.length > 0" class="text-sm">
                <strong>Despesas:</strong> {{ tooltip.despesas.join(', ') }}
              </p>
              <p
                v-if="
                  tooltip.receitas.length === 0 && tooltip.despesas.length === 0
                "
                class="text-sm"
              >
                Sem movimentações.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      tooltip: {
        visible: false,
        date: '',
        receitas: [],
        despesas: [],
      },
    }
  },
  computed: {
    firstTransactionDate() {
      if (this.transactions.length === 0) return null
      return new Date(this.transactions[0].date)
    },
  },
  methods: {
    getMonthName(month) {
      const date = new Date(this.currentYear, month - 1, 1)
      return date.toLocaleString('default', { month: 'long' })
    },
    getDaysInMonth(year, month) {
      return new Date(year, month, 0).getDate()
    },
    getDateKey(day, month) {
      return `${this.currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    },
    hasTransaction(day, month) {
      const dateKey = this.getDateKey(day, month)
      return this.transactions.some((t) => t.date === dateKey)
    },
    getDayStyle(day, month) {
      const dateKey = this.getDateKey(day, month)
      const transaction = this.transactions.find((t) => t.date === dateKey)

      // Se não houver transação ou o dia for anterior à primeira transação, não aplicar cor
      if (!transaction || this.isBeforeFirstTransaction(dateKey)) {
        return { backgroundColor: '#f0f0f0' } // Cinza claro para dias sem transação
      }

      const liquido = transaction.liquido

      let backgroundColor
      if (liquido > 2000) {
        backgroundColor = '#4caf50' // Verde
      } else if (liquido >= 1000 && liquido <= 2000) {
        backgroundColor = '#64b5f6' // Azul-centáurea-claro-3
      } else if (liquido >= 0 && liquido < 1000) {
        backgroundColor = '#fce8b2' // Laranja-claro-13
      } else {
        backgroundColor = '#f44336' // Vermelho
      }

      return { backgroundColor }
    },
    isBeforeFirstTransaction(dateKey) {
      if (!this.firstTransactionDate) return false
      const currentDate = new Date(dateKey)
      return currentDate < this.firstTransactionDate
    },
    showTooltip(day, month) {
      const dateKey = this.getDateKey(day, month)
      const transaction = this.transactions.find((t) => t.date === dateKey)

      this.tooltip = {
        visible: true,
        date: dateKey,
        receitas: transaction ? transaction.receitas : [],
        despesas: transaction ? transaction.despesas : [],
      }
    },
    hideTooltip() {
      this.tooltip.visible = false
    },
    previousYear() {
      this.currentYear -= 1
    },
    nextYear() {
      this.currentYear += 1
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
}
</script>
