import ApiService from './api'

class AuthService {
  constructor() {
    this.api = ApiService
    this.config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  async authenticate(email, password) {
    return await this.api.post(
      '/auth/authenticate',
      { email, password },
      this.config,
    )
  }
}

export default new AuthService()
