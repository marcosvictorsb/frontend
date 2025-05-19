import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class GraphService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
    }
  }

  async getBalanceYear() {
    return await this.api.get(`/graphic/balance-year`, this.config)
  }
}

export default new GraphService()
