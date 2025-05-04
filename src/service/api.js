import { useUserStore } from '@/store/user'
import axios from 'axios'
import router from '../router'


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/'

const api = axios.create({
  baseURL
})

api.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      response: response.data,
    }
  },
  (error) => {
    if (error?.status === 401 || error.response.status === 401) {
      const useUser = useUserStore()
      useUser.logout()

      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
