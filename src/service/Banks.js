import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class BanksService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
    }
  }

  async createBank({ name, amount }) {
    return await this.api.post(`/banks`, { name, amount }, this.config)
  }

  async getBanks() {
    return await this.api.get(`/banks`, this.config)      
  }
  
  // async deleteExpense(id) {
  //   return await this.api.delete(`/expenses/${id}`, this.config)
  // }
  // async updateExpense(transaction) {
  //   return await this.api.put(`/expenses/${transaction.id}`, transaction, this.config)
  // }

  // async getTotalExpenses() {
  //   return await this.api.get(`/expenses/calculate`, this.config)      
  // }
}

export default new BanksService()
