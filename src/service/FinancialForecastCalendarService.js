import { useUserStore } from '@/store/user'
import ApiService from './api'

const user = useUserStore()

class FinancialForecastCalendarService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.user.token}`,
      },
    };
  }

  async getForecast(date) {
    const year = date.year;
    const month = date.month;
    const reference_month = `${month}/${year}`;

    const params = new URLSearchParams({
      reference_month,
    });

    return await this.api.get(`/forecast?${params.toString()}`, this.config);
  }
}

export default new FinancialForecastCalendarService()
