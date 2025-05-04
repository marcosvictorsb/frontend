import { useUserStore } from '../store/user'

const authGuard = (to, from, next) => {
  const userStore = useUserStore()
  if (userStore.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}
export default authGuard
