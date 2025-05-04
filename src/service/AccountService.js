import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class AccountService {
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
    return await this.api.post('/accounts', account, this.config)
  }

  async getAccounts() {
    return await this.api.get(`/accounts`, this.config)
  }
}

export default new AccountService()
