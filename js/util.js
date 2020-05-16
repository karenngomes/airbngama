const ONE_DAY = 24 * 60 * 60 * 1000;

function formattedCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function daysBetween(firstDate, lastDate) {
  return parseInt((lastDate - firstDate) / ONE_DAY) + 1;
}
