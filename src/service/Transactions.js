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

  async create(transaction) {
    transaction.id_user = user.user.id
    return await this.api.post(`/transactions`, [transaction], this.config);
  }

  async getTransactions(date) {
    const year = date.year
    const month = date.month

    return await this.api.get(`/transactions/${month}-${year}`, this.config)
  }

  async getTransactionsByName(name) {
    return await this.api.get(`/transactions/${name}`, this.config)
  }

  async deleteTransaction(ids) {
    return await this.api.delete(`/transactions`, {
      data: { ids },
      ...this.config,
    })
  }
}

export default new TransactionService()
