const Utils = {
  totalCurrency: (transactions, format) => {
    return transactions.reduce((total, revenue) => {
      if (revenue.operation === format) {
        const value = revenue.currency
          .replace('R$ ', '')
          .replace(/\./g, '')
          .replace(',', '.')
        return total + parseFloat(value)
      } else {
        return total
      }
    }, 0)
  },
}

export default Utils
