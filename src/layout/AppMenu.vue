<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Hubs', icon: 'pi pi-fw pi-home', to: '/' }],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-id-card', to: '/financas' },
      { label: 'Transações', icon: 'pi pi-fw pi-wallet', to: '/transacoes' },
      { label: 'Previsibilidade', icon: 'pi pi-fw pi-calendar', to: '/previsibilidade' },
      // { label: 'Planejamento', icon: 'pi pi-fw pi-chart-line', to: '/planejamento' },
      // { label: 'Orçamento', icon: 'pi pi-fw pi-dollar', to: '/orcamento' },
      // { label: 'Contas a Pagar', icon: 'pi pi-fw pi-credit-card', to: '/contas-a-pagar' },
      // { label: 'Contas a Receber', icon: 'pi pi-fw pi-money-bill', to: '/contas-a-receber' },
      // { label: 'Bancos', icon: 'pi pi-fw pi-building', to: '/bancos' },
      
      
    ],
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing',
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login',
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error',
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access',
          },
        ],
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud',
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound',
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty',
      },
    ],
  },
  {
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            ],
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
          },
        ],
      },
    ],
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/documentation',
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/primefaces/sakai-vue',
        target: '_blank',
      },
    ],
  },
])
</script>

<style lang="scss" scoped></style>
