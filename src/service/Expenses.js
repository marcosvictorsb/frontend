import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class ExpensesService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
    }
  }

  async createExpense(transaction) {
    return await this.api.post(`/expenses`, [transaction], this.config);
  }

  async getExpenses(date) {
    const year = date.year
    const month = date.month
    const reference_month = `${month}/${year}`;

    const params = new URLSearchParams({
      reference_month
    });

    return await this.api.get(`/expenses/?${params.toString()}`, this.config)      
  }
  
  async deleteExpense(id) {
    return await this.api.delete(`/expenses/${id}`, this.config)
  }
  async updateExpense(transaction) {
    return await this.api.put(`/expenses/${transaction.id}`, transaction, this.config)
  }

  async getTotalExpenses() {
    return await this.api.get(`/expenses/calculate`, this.config)      
  }
}

export default new ExpensesService()
