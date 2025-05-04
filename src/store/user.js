import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || { token: null },
  }),
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout() {
      this.user = { token: null }
      localStorage.removeItem('user')
      window.location.href = '/login'
    },
    resetState() {
      this.user = { token: null }
      localStorage.removeItem('user')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user.token,
  },
})
