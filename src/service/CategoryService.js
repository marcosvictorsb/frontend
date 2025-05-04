import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class CategoryService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.user.token}`,
      },
    }
  }

  async to(promise) {
    return promise.then((data) => [null, data]).catch((err) => [null, err])
  }

  async create(account) {
    account.idUser = user.user.id
    return await this.api.post('/categories', account, this.config)
  }

  async getCategories() {
    return await this.api.get(`/categories`, this.config)
  }
}

export default new CategoryService()
