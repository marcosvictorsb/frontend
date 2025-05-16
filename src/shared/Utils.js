export const formatCurrency = (value) =>{
  if (value !== null && value !== undefined) {
    const amount = value / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return 'R$ 0,00';
};

