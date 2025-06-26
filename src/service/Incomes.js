import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class IncomesService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.user.token}`,
      },
    };
  }

  async createIncome(transaction) {
    return await this.api.post(`/incomes`, transaction, this.config);
  }

  async getIncomes(date) {
    const year = date.year;
    const month = date.month;
    const reference_month = `${month}/${year}`;

    const params = new URLSearchParams({
      reference_month,
    });

    return await this.api.get(`/incomes/?${params.toString()}`, this.config);
  }

  async deleteIncome(id) {
    return await this.api.delete(`/incomes/${id}`, this.config);
  }
  async updateIncome(transaction) {
    return await this.api.put(
      `/incomes/${transaction.id}`,
      transaction,
      this.config
    );
  }

  async getTotalIncomes(date) {
    const year = date.year;
    const month = date.month;
    const reference_month = `${month}/${year}`;

    const params = new URLSearchParams({
      reference_month,
    });

    return await this.api.get(
      `/incomes/calculate?${params.toString()}`,
      this.config
    );
  }
}

export default new IncomesService()
