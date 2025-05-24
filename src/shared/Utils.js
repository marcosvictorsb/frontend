export const formatCurrency = (value) => {
  if (value !== null && value !== undefined) {
    const amount = value / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  return "R$ 0,00";
};

export const ajustDatePayment = (date) => {
  const dataOriginal = new Date(date);
  const agora = new Date();

  date.setHours(agora.getHours());
  date.setMinutes(agora.getMinutes());
  date.setSeconds(agora.getSeconds());

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  };

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", options)
    .format(dataOriginal)
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
    .replace(",", "");

  return dataFormatada;
};
