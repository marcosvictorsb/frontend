import { useUserStore } from '@/store/user'
import axios from 'axios'
import router from '../router'

const api = axios.create({
  baseURL: 'http://localhost:3003/',
})

api.interceptors.response.use(
  (response) => {
    return {
      status: response.status,
      response: response.data,
    }
  },
  (error) => {
    console.log('---------------------------------------');
    console.log(error);
    if (error?.status === 401 || error.response.status === 401) {
      const useUser = useUserStore()
      useUser.logout()

      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
