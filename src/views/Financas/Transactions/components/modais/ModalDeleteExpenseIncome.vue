<template>
  <Dialog v-model:visible="deleteTransactionDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span v-if="transaction">Tem certeza de que deseja excluir <b>{{ transaction.description }}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" text @click="deleteTransactionDialog = false" />
      <Button label="Sim" icon="pi pi-check" @click="deleteTransaction" />
    </template>
  </Dialog>
</template>
<script setup>
</script>