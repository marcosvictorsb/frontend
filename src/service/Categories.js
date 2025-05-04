import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class TransactionService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
    }
  }

  async getCategories() {
    return await this.api.get(`/categories`, this.config)
  }

  async create(category) {
    return await this.api.post(
      `/categories`,
      { name: category, icon: '', id_user: user.user.id },
      this.config,
    )
  }
}

export default new TransactionService()
