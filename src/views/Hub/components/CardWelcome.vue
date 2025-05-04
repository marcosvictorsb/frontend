<template>
  <div
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8 border-surface rounded-2xl"
  >
    <Card
      :pt="{
        root: {
          style: {
            height: '11.5rem',
            'margin-top': '70px',
          },
        },
      }"
      class="col-span-12 lg:col-span-6 xl:col-span-12"
    >
      <template #content>
        <div class="flex justify-center">
          <div class="content-center items-center welcome-container-title">
            <h1 class="welcome-title">Olá {{ name }}!</h1>
            <p class="welcome-msg">Bem-vindo de volta ao seu hub.</p>
          </div>
          <div
            class="relative w-80 space-x-reverse place-content-end img-container"
          >
            <img
              src="../imgs/welcome.png"
              :class="[{ 'img-color': isDarkTheme }, 'absolute']"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useLayout } from '@/layout/composables/layout'
const { isDarkTheme } = useLayout()

defineProps({
  name: { type: String, required: true },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400..800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

.welcome-png {
  width: 100%;
  z-index: 1;
}
.size-img {
  max-height: 160px;
}

.welcome-title {
  font-size: 36px;
  line-height: 57.38px;
  font-family: 'Baloo Da 2', sans-serif;
  font-weight: 700;
  font-style: bold;
}

.welcome-container-title {
  width: 390px;
}

.welcome-msg {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
}

.img-container {
  top: -9.3rem;
}

.img-color {
  filter: invert(0.8);
}

@media (max-width: 991px) {
  .welcome-container-title {
    width: 390px;
  }

  .img-container {
    top: -100px;
  }

  .welcome-title {
    font-size: 30px;
    line-height: 57.38px;
    font-family: 'Baloo Da 2', sans-serif;
    font-weight: 700;
    font-style: bold;
  }
}
</style>
