<template>
  <div class="grid gap-8 mt-8">
    <div
      class="lg:col-span-1 xl:col-span-3 border rounded-border border-surface rounded-2xl"
    >
      <router-link
        :to="{ name: 'financas' }"
        class="block card mb-0 cursor-pointer alt-card p-6"
      >
        <div class="flex mb-4 gap-2">
          <div
            class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-blue-500 !text-xl"></i>
          </div>
          <div class="">
            <span
              class="block font-medium mb-4 text-2xl text-center text-primary ml-2"
              >Finanças</span
            >
          </div>
        </div>
        <span class="text-muted-color text-lg">Gerencie suas financas</span>
      </router-link>
    </div>
  </div>
</template>

<script src=""></script>

<style scoped>
.alt-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.alt-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
</style>
