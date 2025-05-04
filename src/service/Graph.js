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

  async getStackedBar() {
    return await this.api.get(`/graph/stacked-bar`, this.config)
  }
  async getCategoriesGrouped() {
    return await this.api.get(`/graph/categories-group`, this.config)
  }

  async getTransactionGroupByFormat({ month, year }) {
    this.config.query = { month, year }
    return await this.api.get(`/graph/format-transactions`, this.config)
  }
}

export default new GraphService()
